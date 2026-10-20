#!/usr/bin/env node
// Public-content check. Scans what is about to become public for patterns
// that must never appear in this repository: hosting details and anything
// else listed in the maintainer's private rule file. The rules themselves
// live only in the gitignored `.private/` directory, so this script names no
// sensitive string. Hits are reported by location only, never by content.
//
// Usage:
//   node scripts/check-public.mjs                 tracked files, unpushed commit messages, and dist/ if built
//   node scripts/check-public.mjs --pre-push      git pre-push hook mode: refs on stdin
//   node scripts/check-public.mjs <file>...       arbitrary files, such as an issue or PR body before posting
//
// Exit codes: 0 clean, 1 hits found, 2 rule file missing or unreadable.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
const rulesPath = join(repoRoot, '.private', 'public-check-patterns.txt')

function loadRules() {
  if (!existsSync(rulesPath)) {
    console.error(`公开内容检查规则缺失：${relative(repoRoot, rulesPath)}。请在维护者本机放置规则文件后重试。`)
    process.exit(2)
  }
  const rules = readFileSync(rulesPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line, index) => ({ number: index + 1, pattern: new RegExp(line, 'iu') }))
  if (rules.length === 0) {
    console.error(`公开内容检查规则为空：${relative(repoRoot, rulesPath)}。`)
    process.exit(2)
  }
  return rules
}

function git(args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

function gitBuffer(args) {
  return execFileSync('git', args, { cwd: repoRoot, maxBuffer: 64 * 1024 * 1024 })
}

/** Returns hit descriptions for one text, as "<label>:<line> (rule <n>)". */
function scanText(label, text, rules) {
  const hits = []
  const lines = text.split('\n')
  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (rule.pattern.test(line)) {
        hits.push(`${label}:${index + 1}（规则 ${rule.number}）`)
      }
    }
  })
  return hits
}

function listFiles(directory) {
  const files = []
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    if (statSync(path).isDirectory()) {
      files.push(...listFiles(path))
    } else {
      files.push(path)
    }
  }
  return files
}

/** Every file in a commit's tree. */
function scanTree(commit, rules) {
  const hits = []
  const paths = git(['ls-tree', '-r', '--name-only', '-z', commit]).split('\0').filter((path) => path.length > 0)
  for (const path of paths) {
    const content = gitBuffer(['show', `${commit}:${path}`]).toString('utf8')
    hits.push(...scanText(`${commit.slice(0, 7)}:${path}`, content, rules))
  }
  return hits
}

/** Messages of the commits selected by `git log <logArgs>`. */
function scanCommitMessages(logArgs, rules) {
  const hits = []
  const fields = git(['log', '--format=%H%x00%B%x00', ...logArgs]).split('\0')
  for (let index = 0; index + 1 < fields.length; index += 2) {
    hits.push(...scanText(`提交信息 ${fields[index].trim().slice(0, 7)}`, fields[index + 1], rules))
  }
  return hits
}

function scanWorkingState(rules) {
  const hits = []
  const tracked = git(['ls-files', '-z']).split('\0').filter((path) => path.length > 0)
  for (const path of tracked) {
    const absolute = join(repoRoot, path)
    // A tracked file deleted in the working tree has nothing left to publish.
    if (existsSync(absolute)) {
      hits.push(...scanText(path, readFileSync(absolute).toString('utf8'), rules))
    }
  }
  hits.push(...scanCommitMessages(['HEAD', '--not', '--remotes=origin'], rules))
  const dist = join(repoRoot, 'dist')
  if (existsSync(dist)) {
    for (const file of listFiles(dist)) {
      hits.push(...scanText(relative(repoRoot, file), readFileSync(file).toString('utf8'), rules))
    }
  }
  return hits
}

/** Pre-push hook: stdin carries "<local ref> <local sha> <remote ref> <remote sha>" per pushed ref. */
function scanPrePush(rules) {
  const zero = /^0+$/
  const hits = []
  for (const line of readFileSync(0, 'utf8').split('\n')) {
    const [localRef, localSha, , remoteSha] = line.trim().split(/\s+/)
    // Blank lines carry nothing; an all-zero local sha is a branch deletion.
    if (localRef === undefined || localSha === undefined || remoteSha === undefined || zero.test(localSha)) {
      continue
    }
    hits.push(...scanTree(localSha, rules))
    const logArgs = zero.test(remoteSha) ? [localSha, '--not', '--remotes=origin'] : [`${remoteSha}..${localSha}`]
    hits.push(...scanCommitMessages(logArgs, rules))
  }
  return hits
}

function scanFiles(paths, rules) {
  const hits = []
  for (const path of paths) {
    if (!existsSync(path)) {
      console.error(`文件不存在：${path}`)
      process.exit(2)
    }
    hits.push(...scanText(path, readFileSync(path).toString('utf8'), rules))
  }
  return hits
}

const rules = loadRules()
const args = process.argv.slice(2)
const hits = args[0] === '--pre-push' ? scanPrePush(rules) : args.length > 0 ? scanFiles(args, rules) : scanWorkingState(rules)

if (hits.length > 0) {
  console.error('公开内容检查未通过，命中位置如下（不显示命中的内容）：')
  for (const hit of hits) {
    console.error(`  ${hit}`)
  }
  process.exit(1)
}
console.log('公开内容检查通过。')
