#!/usr/bin/env node
// Public-content check. Scans what is about to become public for patterns
// that must never appear in this repository: hosting details and anything
// else listed in the maintainer's private rule file. The rules live only in
// the gitignored `.private/` directory of the main checkout, so this script
// names no sensitive string. Hits are reported by location only.
//
// Binary files are not scanned as text: random bytes in an image can spell a
// rule by chance. PNG files still have their text chunks scanned, since image
// metadata can carry paths or notes.
//
// Usage:
//   node scripts/check-public.mjs              tracked files, unpushed commit messages, and dist/ if built
//   node scripts/check-public.mjs --pre-push   git pre-push hook: every object and commit message being pushed
//   node scripts/check-public.mjs <file>...    arbitrary files, such as an issue or PR body before posting
//
// Exit codes: 0 clean; 1 hits found; 2 repository not found, rules missing, unreadable or invalid, or an input file missing.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { isPng, readPngTexts } from './png.ts'

// Pushed blobs can be large (figures); the default 1 MB buffer is too small.
const maxBuffer = 256 * 1024 * 1024

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer })
}

function gitBlob(sha, cwd) {
  return execFileSync('git', ['cat-file', 'blob', sha], { cwd, maxBuffer })
}

// The script lives in the working tree it checks, so its own location finds
// the repository even when it runs from elsewhere, such as .git/scratch/ where
// issue and PR drafts are kept. Linked worktrees share the repository but not
// untracked files, so the rules are read from the main checkout, the parent of
// the common git directory.
function locateRepository() {
  const scriptDirectory = dirname(fileURLToPath(import.meta.url))
  try {
    const checkoutRoot = git(['rev-parse', '--show-toplevel'], scriptDirectory).trim()
    const commonDirectory = git(['rev-parse', '--path-format=absolute', '--git-common-dir'], checkoutRoot).trim()
    return { checkoutRoot, mainRoot: dirname(commonDirectory) }
  } catch (error) {
    exitWithSetupError(`无法定位脚本所在的仓库：${error.message}`)
  }
}

const { checkoutRoot, mainRoot } = locateRepository()
const rulesPath = join(mainRoot, '.private', 'public-check-patterns.txt')

function exitWithSetupError(message) {
  console.error(message)
  process.exit(2)
}

function loadRules() {
  if (!existsSync(rulesPath)) {
    exitWithSetupError(`公开内容检查规则缺失：${rulesPath}。请在维护者本机放置规则文件后重试。`)
  }
  let lines
  try {
    lines = readFileSync(rulesPath, 'utf8').split('\n')
  } catch (error) {
    exitWithSetupError(`公开内容检查规则无法读取：${rulesPath}（${error.message}）`)
  }
  const rules = []
  lines.forEach((raw, index) => {
    const line = raw.trim()
    if (line.length === 0 || line.startsWith('#')) {
      return
    }
    try {
      rules.push({ line: index + 1, pattern: new RegExp(line, 'iu') })
    } catch {
      exitWithSetupError(`公开内容检查规则第 ${index + 1} 行不是合法的正则表达式：${rulesPath}`)
    }
  })
  if (rules.length === 0) {
    exitWithSetupError(`公开内容检查规则为空：${rulesPath}`)
  }
  return rules
}

/** Returns hit locations for one text as "<label>:<line>（规则第 n 行）". */
function scanText(label, text, rules) {
  const hits = []
  text.split('\n').forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        hits.push(`${label}:${index + 1}（规则第 ${rule.line} 行）`)
      }
    }
  })
  return hits
}

/**
 * Scans a file's bytes: text files line by line, PNG files through their text
 * chunks, and other binary files (any NUL byte in the first 8,000, as git
 * decides) not at all.
 */
function scanBytes(label, bytes, rules) {
  if (isPng(bytes)) {
    const texts = readPngTexts(bytes).map((chunk) => `${chunk.keyword}: ${chunk.text}`)
    return scanText(`${label}（PNG 文本块）`, texts.join('\n'), rules)
  }
  if (bytes.subarray(0, 8000).includes(0)) {
    return []
  }
  return scanText(label, bytes.toString('utf8'), rules)
}

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? listFiles(path) : [path]
  })
}

function scanCommitMessages(revisionArgs, rules) {
  const fields = git(['log', '--format=%H%x00%B%x00', ...revisionArgs], checkoutRoot).split('\0')
  const hits = []
  for (let index = 0; index + 1 < fields.length; index += 2) {
    hits.push(...scanText(`提交信息 ${fields[index].trim().slice(0, 7)}`, fields[index + 1], rules))
  }
  return hits
}

/**
 * Every blob reachable from the pushed commits but not from origin, so a file
 * added in one commit and deleted in a later one is still caught: the push
 * publishes the whole history, not only its last tree.
 */
function scanNewObjects(revisionArgs, rules) {
  const objects = git(['rev-list', '--objects', ...revisionArgs], checkoutRoot)
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => {
      const space = line.indexOf(' ')
      return space === -1 ? { sha: line, path: '' } : { sha: line.slice(0, space), path: line.slice(space + 1) }
    })
  const hits = []
  for (const object of objects) {
    if (git(['cat-file', '-t', object.sha], checkoutRoot).trim() !== 'blob') {
      continue
    }
    const content = gitBlob(object.sha, checkoutRoot)
    hits.push(...scanBytes(`${object.sha.slice(0, 7)} ${object.path}`, content, rules))
  }
  return hits
}

function scanPrePush(rules) {
  const zero = /^0+$/
  const hits = []
  for (const line of readFileSync(0, 'utf8').split('\n')) {
    const [localRef, localSha, , remoteSha] = line.trim().split(/\s+/)
    // Blank lines carry nothing; an all-zero local sha is a branch deletion.
    if (localRef === undefined || localSha === undefined || remoteSha === undefined || zero.test(localSha)) {
      continue
    }
    const revisionArgs = zero.test(remoteSha) ? [localSha, '--not', '--remotes=origin'] : [localSha, `^${remoteSha}`]
    hits.push(...scanNewObjects(revisionArgs, rules))
    hits.push(...scanCommitMessages(revisionArgs, rules))
  }
  return hits
}

function scanWorkingState(rules) {
  const hits = []
  for (const path of git(['ls-files', '-z'], checkoutRoot).split('\0').filter((entry) => entry.length > 0)) {
    const absolute = join(checkoutRoot, path)
    // A tracked file deleted in the working tree has nothing left to publish.
    if (existsSync(absolute)) {
      hits.push(...scanBytes(path, readFileSync(absolute), rules))
    }
  }
  hits.push(...scanCommitMessages(['HEAD', '--not', '--remotes=origin'], rules))
  const dist = join(checkoutRoot, 'dist')
  if (existsSync(dist)) {
    for (const file of listFiles(dist)) {
      hits.push(...scanBytes(relative(checkoutRoot, file), readFileSync(file), rules))
    }
  }
  return hits
}

function scanFiles(paths, rules) {
  const hits = []
  for (const path of paths) {
    if (!existsSync(path)) {
      exitWithSetupError(`文件不存在：${path}`)
    }
    hits.push(...scanBytes(path, readFileSync(path), rules))
  }
  return hits
}

const rules = loadRules()
const args = process.argv.slice(2)
const hits =
  args[0] === '--pre-push' ? scanPrePush(rules) : args.length > 0 ? scanFiles(args, rules) : scanWorkingState(rules)

if (hits.length > 0) {
  console.error('公开内容检查未通过，命中位置如下（不显示命中的内容）：')
  for (const hit of hits) {
    console.error(`  ${hit}`)
  }
  process.exit(1)
}
console.log('公开内容检查通过。')
