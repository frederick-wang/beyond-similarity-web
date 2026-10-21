#!/usr/bin/env node
// Public-content check. Scans what is about to become public against two rule
// sets, and reports hits by location and rule line only, never with the
// matched text:
//
// - Private rules: hosting details, private names and other items listed in
//   the maintainer's rule file. It lives only in the gitignored `.private/`
//   directory of the main checkout, so this script names no sensitive string.
// - Status rules: generic wording about the paper's standing with a venue,
//   tracked in scripts/status-phrases.txt. That file is exempt from the status
//   rules, which it spells out, but not from the private rules.
//
// Binary files are not scanned as text: random bytes in an image can spell a
// rule by chance. PNG files still have their text chunks scanned, since image
// metadata can carry paths or notes.
//
// Usage:
//   node scripts/check-public.mjs              tracked files, unpushed commit messages, and dist/ if built
//   node scripts/check-public.mjs --pre-push   git pre-push hook: every object and commit message being pushed
//   node scripts/check-public.mjs --ci         tracked files and dist/ against the status rules only; CI runs this, having no private rules
//   node scripts/check-public.mjs <file>...    arbitrary files, such as an issue or PR body before posting
//
// Exit codes: 0 clean; 1 hits found; 2 repository not found, a rule file
// missing, unreadable, invalid or empty, an input file missing, a PNG that
// does not parse, no dist/ under --ci, or a fault in this script or its
// environment, a module that fails to load included.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// png.ts is imported dynamically so that a module that fails to load ends
// through exitWithFault with code 2. A static import that fails ends the
// process before any code here runs, with Node's code 1, which means hits.
const { isPng, PngFormatError, readPngWords } = await import('./png.ts').catch(exitWithFault)

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
// untracked files, so the private rules are read from the main checkout, the
// parent of the common git directory. The status rules are tracked, so each
// checkout uses its own version.
//
// githooks(5): git exports GIT_DIR and related variables to a hook, and a hook
// that runs git in another repository or working tree should clear them. In
// a linked worktree the pre-push hook receives GIT_DIR (its
// .git/worktrees/<name>) and no GIT_WORK_TREE, and `git rev-parse
// --show-toplevel` run from scripts/ then answers scripts/ itself: with
// GIT_DIR alone, git takes the current directory as the top of the working
// tree (git-config(1), core.worktree). In the main checkout the hook receives
// neither variable. The lookup therefore runs with both cleared.
function locateRepository() {
  const scriptDirectory = dirname(fileURLToPath(import.meta.url))
  // process.env is a dictionary whose keys are only known at run time, so it
  // is copied whole; the two variables are then removed.
  const env = { ...process.env, GIT_DIR: undefined, GIT_WORK_TREE: undefined }
  const locate = (args, cwd) => execFileSync('git', args, { cwd, env, encoding: 'utf8' }).trim()
  try {
    const checkoutRoot = locate(['rev-parse', '--show-toplevel'], scriptDirectory)
    const commonDirectory = locate(['rev-parse', '--path-format=absolute', '--git-common-dir'], checkoutRoot)
    return { checkoutRoot, mainRoot: dirname(commonDirectory) }
  } catch (error) {
    exitWithSetupError(`无法定位脚本所在的仓库：${error.message}`)
  }
}

const { checkoutRoot, mainRoot } = locateRepository()

const privateRuleFile = {
  path: join(mainRoot, '.private', 'public-check-patterns.txt'),
  name: '.private/public-check-patterns.txt',
  missing: '请在维护者本机放置规则文件后重试。',
}
const statusRuleFile = {
  path: join(checkoutRoot, 'scripts', 'status-phrases.txt'),
  name: 'scripts/status-phrases.txt',
  missing: '这个文件随仓库提交，请检查工作区。',
}

function exitWithSetupError(message) {
  console.error(message)
  process.exit(2)
}

/** One case-insensitive regular expression per line; `#` comments and blank lines are skipped. */
function loadRules(file) {
  if (!existsSync(file.path)) {
    exitWithSetupError(`公开内容检查规则缺失：${file.path}。${file.missing}`)
  }
  let lines
  try {
    lines = readFileSync(file.path, 'utf8').split('\n')
  } catch (error) {
    exitWithSetupError(`公开内容检查规则无法读取：${file.path}（${error.message}）`)
  }
  const rules = []
  lines.forEach((raw, index) => {
    const line = raw.trim()
    if (line.length === 0 || line.startsWith('#')) {
      return
    }
    try {
      // g lets scanText find every match in a text; search() ignores it.
      rules.push({ line: index + 1, pattern: new RegExp(line, 'giu') })
    } catch {
      exitWithSetupError(`公开内容检查规则第 ${index + 1} 行不是合法的正则表达式：${file.path}`)
    }
  })
  if (rules.length === 0) {
    exitWithSetupError(`公开内容检查规则为空：${file.path}`)
  }
  return { file, rules }
}

// Chinese and Japanese are written without spaces between words, so a wrap
// between two of these characters joins them: Han, Hiragana, Katakana, and
// the CJK Symbols and Punctuation and Halfwidth and Fullwidth Forms blocks.
// Korean separates words with spaces, so Hangul is not among them.
const cjkCharacter = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\u3000-\u303f\uff00-\uffef]/u

// The leader a comment line opens with, after its indentation.
const commentLeader = /^[ \t]*(\/\/|#|\*|>)/u

/**
 * The lines with their comment leaders removed inside comment blocks. A
 * comment block is a run of consecutive lines that open, after indentation,
 * with the same leader (//, #, * or >). A line's leader counts only when the
 * line before it opens with the same leader, so the first line of a block, a
 * lone list item or a heading keeps what it opens with.
 */
function withoutCommentLeaders(lines) {
  return lines.map((line, index) => {
    const leader = commentLeader.exec(line)?.[1]
    const previous = index === 0 ? undefined : commentLeader.exec(lines[index - 1])?.[1]
    return leader !== undefined && leader === previous ? line.replace(commentLeader, '') : line
  })
}

/**
 * The text with its hard wraps undone, and the line each of its UTF-16 code
 * units came from. Comment leaders inside comment blocks are removed first
 * (see withoutCommentLeaders). Then each run of whitespace is read by the line
 * breaks it holds. A run with exactly one is a wrap: removed between two
 * Chinese or Japanese characters, and after a hyphen that follows a letter or
 * digit (camera- / ready), one space elsewhere, so a spaced dash keeps its
 * space. A run with two or more is a paragraph break, an empty comment line
 * inside a block included, and stays a line break. A run with none becomes one
 * space.
 *
 * The comment rule has two known limits. Consecutive list items that open
 * with * count as one block, so their texts join into one paragraph. An
 * end-of-line comment (code, then //) does not open a block, so the comment
 * line after it keeps its leader and does not join it.
 */
function unwrap(text) {
  const stripped = withoutCommentLeaders(text.split('\n')).join('\n')
  let flat = ''
  const lineOf = []
  let line = 1
  for (const piece of stripped.matchAll(/\s+|\S+/gu)) {
    const value = piece[0]
    if (/\S/u.test(value)) {
      flat += value
      for (let unit = 0; unit < value.length; unit += 1) {
        lineOf.push(line)
      }
      continue
    }
    const breaks = value.split('\n').length - 1
    // The last two characters so far; the start of the text has none.
    const tail = Array.from(flat.slice(-4))
    const before = tail.at(-1) ?? ''
    const beforeThat = tail.at(-2) ?? ''
    const next = stripped.codePointAt(piece.index + value.length)
    const after = next === undefined ? '' : String.fromCodePoint(next)
    const joinsCjk = cjkCharacter.test(before) && cjkCharacter.test(after)
    const joinsHyphen = before === '-' && /[\p{L}\p{N}]/u.test(beforeThat)
    if (breaks >= 2) {
      flat += '\n'
      lineOf.push(line)
    } else if (breaks === 0 || !(joinsCjk || joinsHyphen)) {
      flat += ' '
      lineOf.push(line)
    }
    line += breaks
  }
  return { flat, lineOf }
}

/**
 * Returns hit locations for one text as "<label>:<line>（<rule file> 第 n 行）".
 * Every rule is matched twice. It is matched against each line as written, so
 * that a rule anchored to a line keeps working. It is also matched globally
 * against each paragraph of the text with its hard wraps undone (see unwrap),
 * so that a phrase wrapped across lines matches, inside a comment block too,
 * while no match spans a paragraph break. A hit names the line where its match
 * starts, once per rule and line.
 */
function scanText(label, text, ruleSets) {
  const hits = new Set()
  const hit = (line, ruleSet, rule) => hits.add(`${label}:${line}（${ruleSet.file.name} 第 ${rule.line} 行）`)
  const { flat, lineOf } = unwrap(text)
  const paragraphs = Array.from(flat.matchAll(/[^\n]+/gu))
  for (const ruleSet of ruleSets) {
    for (const rule of ruleSet.rules) {
      text.split('\n').forEach((line, index) => {
        if (line.search(rule.pattern) !== -1) {
          hit(index + 1, ruleSet, rule)
        }
      })
      for (const paragraph of paragraphs) {
        for (const match of paragraph[0].matchAll(rule.pattern)) {
          hit(lineOf[paragraph.index + match.index], ruleSet, rule)
        }
      }
    }
  }
  return [...hits]
}

/**
 * The words of a PNG (see scripts/png.ts), one line each: every field of its
 * text chunks, an iTXt chunk's language tag and translated keyword included,
 * and the names in its iCCP and sPLT chunks. A PNG that does not parse stops
 * the check with exit code 2, since its words could not all be read: calling
 * it clean would hide whatever the parser could not reach. The message names
 * only the file, the byte offset and the kind of fault, never bytes from the
 * file, because CI logs are public.
 */
function pngWords(label, bytes) {
  try {
    const words = readPngWords(bytes)
    const lines = words.texts
      .map((chunk) =>
        chunk.type === 'iTXt'
          ? `${chunk.keyword} ${chunk.language} ${chunk.translatedKeyword}: ${chunk.text}`
          : `${chunk.keyword}: ${chunk.text}`,
      )
      .concat(words.names)
    return { text: lines.join('\n'), exif: words.exif, nonstandard: words.nonstandard }
  } catch (error) {
    if (error instanceof PngFormatError) {
      exitWithSetupError(`PNG 文件无法解析：${label}（第 ${error.offset} 字节，${error.problem}）`)
    }
    throw error
  }
}

/**
 * Scans a file's bytes: text files line by line, PNG files through their
 * words, and other binary files (any NUL byte in the first 8,000, as git
 * decides) not at all. In every mode a PNG is also a hit when it has an eXIf
 * chunk, since EXIF can hold host names, paths, device serial numbers and
 * places, or a chunk type the PNG specification does not define, which could
 * hold anything. Such a chunk is reported by its byte offset only: its type is
 * four bytes of the file.
 */
function scanBytes(label, bytes, ruleSets) {
  if (isPng(bytes)) {
    const words = pngWords(label, bytes)
    const hits = scanText(`${label}（PNG 文本块）`, words.text, ruleSets)
    if (words.exif) {
      hits.push(`${label}（PNG eXIf 块）：发布的 PNG 不应带 EXIF，请去掉 eXIf 块后再提交`)
    }
    for (const offset of words.nonstandard) {
      hits.push(`${label}（PNG 第 ${offset} 字节，nonstandard chunk）：发布的 PNG 只应含 PNG 规范定义的块`)
    }
    return hits
  }
  if (bytes.subarray(0, 8000).includes(0)) {
    return []
  }
  return scanText(label, bytes.toString('utf8'), ruleSets)
}

/** The rule sets for one file. The status rule file spells out the status rules, so only the private rules apply to it. */
function ruleSetsFor(isStatusRuleFile, ruleSets) {
  return isStatusRuleFile ? ruleSets.filter((ruleSet) => ruleSet.file !== statusRuleFile) : ruleSets
}

function listFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? listFiles(path) : [path]
  })
}

function scanDirectory(directory, ruleSets) {
  return listFiles(directory).flatMap((file) => scanBytes(relative(checkoutRoot, file), readFileSync(file), ruleSets))
}

function scanCommitMessages(revisionArgs, ruleSets) {
  const fields = git(['log', '--format=%H%x00%B%x00', ...revisionArgs], checkoutRoot).split('\0')
  const hits = []
  for (let index = 0; index + 1 < fields.length; index += 2) {
    hits.push(...scanText(`提交信息 ${fields[index].trim().slice(0, 7)}`, fields[index + 1], ruleSets))
  }
  return hits
}

/**
 * Every blob reachable from the pushed commits but not from origin, so a file
 * added in one commit and deleted in a later one is still caught: the push
 * publishes the whole history, not only its last tree.
 */
function scanNewObjects(revisionArgs, ruleSets) {
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
    hits.push(...scanBytes(`${object.sha.slice(0, 7)} ${object.path}`, content, ruleSetsFor(object.path === statusRuleFile.name, ruleSets)))
  }
  return hits
}

function scanPrePush(ruleSets) {
  const zero = /^0+$/
  const hits = []
  for (const line of readFileSync(0, 'utf8').split('\n')) {
    const [localRef, localSha, , remoteSha] = line.trim().split(/\s+/)
    // Blank lines carry nothing; an all-zero local sha is a branch deletion.
    if (localRef === undefined || localSha === undefined || remoteSha === undefined || zero.test(localSha)) {
      continue
    }
    const revisionArgs = zero.test(remoteSha) ? [localSha, '--not', '--remotes=origin'] : [localSha, `^${remoteSha}`]
    hits.push(...scanNewObjects(revisionArgs, ruleSets))
    hits.push(...scanCommitMessages(revisionArgs, ruleSets))
  }
  return hits
}

/** The working-tree contents of every tracked file, such as README.md, which is public without reaching dist/. */
function scanTrackedFiles(ruleSets) {
  const hits = []
  for (const path of git(['ls-files', '-z'], checkoutRoot).split('\0').filter((entry) => entry.length > 0)) {
    const absolute = join(checkoutRoot, path)
    // A tracked file deleted in the working tree has nothing left to publish.
    if (existsSync(absolute)) {
      hits.push(...scanBytes(path, readFileSync(absolute), ruleSetsFor(path === statusRuleFile.name, ruleSets)))
    }
  }
  return hits
}

function scanWorkingState(ruleSets) {
  const hits = scanTrackedFiles(ruleSets)
  hits.push(...scanCommitMessages(['HEAD', '--not', '--remotes=origin'], ruleSets))
  const dist = join(checkoutRoot, 'dist')
  if (existsSync(dist)) {
    hits.push(...scanDirectory(dist, ruleSets))
  }
  return hits
}

function scanFiles(paths, ruleSets) {
  const hits = []
  for (const path of paths) {
    if (!existsSync(path)) {
      exitWithSetupError(`文件不存在：${path}`)
    }
    hits.push(...scanBytes(path, readFileSync(path), ruleSetsFor(resolve(path) === statusRuleFile.path, ruleSets)))
  }
  return hits
}

function scanForCi(ruleSets) {
  const dist = join(checkoutRoot, 'dist')
  if (!existsSync(dist)) {
    exitWithSetupError(`构建产物不存在：${dist}。先运行 pnpm build。`)
  }
  return scanTrackedFiles(ruleSets).concat(scanDirectory(dist, ruleSets))
}

function main() {
  const args = process.argv.slice(2)
  const statusRules = loadRules(statusRuleFile)
  let hits
  if (args[0] === '--ci') {
    hits = scanForCi([statusRules])
  } else {
    const ruleSets = [loadRules(privateRuleFile), statusRules]
    hits = args[0] === '--pre-push' ? scanPrePush(ruleSets) : args.length > 0 ? scanFiles(args, ruleSets) : scanWorkingState(ruleSets)
  }
  if (hits.length > 0) {
    console.error('公开内容检查未通过，命中位置如下（不显示命中的内容）：')
    for (const hit of hits) {
      console.error(`  ${hit}`)
    }
    process.exit(1)
  }
  console.log('公开内容检查通过。')
}

/**
 * Ends the run for a fault in this script or its environment rather than in
 * what it checks, with exit code 2, since 1 means hits. It prints only the
 * stack, which opens with the message. An error from execFileSync also
 * carries the child's output in error.stdout and error.stderr, and stdout can
 * hold bytes of a checked file, such as a blob from git cat-file, so the whole
 * error object must never be printed. The messages of git and Node errors name
 * the command, git's diagnostic, a path or an error code. A module that fails
 * to load also quotes its failing source line, which is this script's own
 * tracked code, never a checked file.
 */
function exitWithFault(error) {
  console.error(`检查脚本出错：${error instanceof Error ? error.stack : String(error)}`)
  process.exit(2)
}

try {
  main()
} catch (error) {
  exitWithFault(error)
}
