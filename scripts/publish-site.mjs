#!/usr/bin/env node
// Publishes one tested build as the contents of the `site` branch (ADR 0003).
//
// Usage: node scripts/publish-site.mjs <build-directory> <source-sha>
//
// Run it inside the git checkout whose `origin` receives the branch. CI runs it
// in the publishing job of a run on main, after the same run built and tested
// the directory, with <source-sha> set to the commit that run checked out.
//
// Each publish adds one commit whose tree is exactly the build directory and
// whose parent is the previous publish; the first publish is a root commit. The
// branch never holds source files, and earlier publishes stay reachable, as the
// deploy step in ADR 0003 needs.
//
// Outcomes, in the order they are decided:
//   exit 1  build.json names another commit than <source-sha>, the arguments or
//           build.json are invalid, or a git step fails
//   exit 0  `site` already holds this exact build, so nothing is pushed
//   exit 0  origin/main is no longer <source-sha>, so this run gives up and
//           leaves publishing to the run for the newer commit
//   exit 0  published

import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const siteBranch = 'site'
const mainBranch = 'main'

/** A failure reported in one line. Any other error is a bug and keeps its stack trace. */
class PublishError extends Error {}

/**
 * Runs git and returns its stdout. Its stderr goes straight to the log, so a
 * failing step shows git's own explanation above the line printed here.
 */
function git(args, options = {}) {
  const result = spawnSync('git', args, {
    cwd: options.cwd,
    env: options.env,
    input: options.input,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'inherit'],
  })
  if (result.error !== undefined) {
    throw new PublishError(`无法运行 git：${result.error.message}`)
  }
  if (result.signal !== null) {
    throw new PublishError(`git ${args.join(' ')} 被信号 ${result.signal} 终止。`)
  }
  if (result.status !== 0) {
    throw new PublishError(`git ${args.join(' ')} 失败，退出码 ${result.status}。`)
  }
  return result.stdout
}

function readBuildInfo(path) {
  let parsed
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new PublishError(`无法读取构建信息 ${path}：${error.message}`)
  }
  if (typeof parsed?.commit !== 'string' || typeof parsed?.builtAt !== 'string') {
    throw new PublishError(`构建信息 ${path} 缺少字符串字段 commit 或 builtAt。`)
  }
  return { commit: parsed.commit, builtAt: parsed.builtAt }
}

/** The commit a branch points to on origin, or null when origin has no such branch. */
function remoteHead(branch) {
  const ref = `refs/heads/${branch}`
  const match = git(['ls-remote', 'origin', ref])
    .split('\n')
    .map((line) => line.split('\t'))
    .find(([, name]) => name === ref)
  return match === undefined ? null : match[0]
}

/**
 * Stores the directory's files as a tree object and returns its id. A
 * temporary index keeps the checkout's own index untouched. --force also adds
 * files that ignore rules (info/exclude, core.excludesFile) would drop, because
 * the branch must hold the build exactly.
 */
function writeTree(gitDirectory, directory) {
  const scratch = mkdtempSync(join(tmpdir(), 'publish-site-'))
  // The child inherits the whole environment (PATH, git identity, credentials);
  // only the index file differs.
  const env = { ...process.env, GIT_INDEX_FILE: join(scratch, 'index') }
  try {
    git(['--git-dir', gitDirectory, '--work-tree', directory, 'add', '--all', '--force', '.'], { cwd: directory, env })
    return git(['--git-dir', gitDirectory, 'write-tree'], { env }).trim()
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
}

/** The current publish on origin, or null before the first one. */
function fetchSite() {
  if (remoteHead(siteBranch) === null) {
    return null
  }
  const trackingRef = `refs/remotes/origin/${siteBranch}`
  git(['fetch', '--quiet', '--no-tags', 'origin', `+refs/heads/${siteBranch}:${trackingRef}`])
  const commit = git(['rev-parse', '--verify', `${trackingRef}^{commit}`]).trim()
  const tree = git(['rev-parse', '--verify', `${commit}^{tree}`]).trim()
  return { commit, tree }
}

function publish(args) {
  const [buildArgument, sourceSha, ...extra] = args
  if (buildArgument === undefined || sourceSha === undefined || extra.length > 0) {
    throw new PublishError('用法：node scripts/publish-site.mjs <构建目录> <源码提交号>')
  }
  if (!/^[0-9a-f]{40}$/.test(sourceSha)) {
    throw new PublishError(`源码提交号应是 40 位小写十六进制的完整 SHA，收到的是 ${sourceSha}。`)
  }

  const buildDirectory = resolve(buildArgument)
  const buildInfoPath = join(buildDirectory, 'build.json')
  const buildInfo = readBuildInfo(buildInfoPath)
  if (buildInfo.commit !== sourceSha) {
    throw new PublishError(
      `不发布：${buildInfoPath} 记录的源码提交是 ${buildInfo.commit}，本次运行的源码提交是 ${sourceSha}，这份产物不是本次运行的构建。`,
    )
  }
  console.log(`待发布的构建：源码 ${sourceSha}，构建时间 ${buildInfo.builtAt}。`)

  const gitDirectory = git(['rev-parse', '--absolute-git-dir']).trim()
  const tree = writeTree(gitDirectory, buildDirectory)
  const previous = fetchSite()
  if (previous !== null && previous.tree === tree) {
    console.log(`${siteBranch} 分支已是这份构建（${previous.commit}），无需发布。`)
    return
  }

  const parentArguments = previous === null ? [] : ['-p', previous.commit]
  const message = `📦 build: 发布 ${sourceSha} 的构建产物\n\n构建时间：${buildInfo.builtAt}\n`
  const commit = git(['commit-tree', tree, ...parentArguments], { input: message }).trim()

  // origin/main is read as late as possible. It can still move between this
  // read and the push, which is harmless: the workflow runs one publish at a
  // time, so a run for the newer commit publishes after this one, and an older
  // build never replaces a newer one. The push never forces: if the branch
  // moved since it was fetched, git rejects the push instead of discarding
  // that commit.
  const mainHead = remoteHead(mainBranch)
  if (mainHead === null) {
    throw new PublishError(`不发布：origin 上没有 ${mainBranch} 分支。`)
  }
  if (mainHead !== sourceSha) {
    console.log(`放弃发布：origin/${mainBranch} 现在是 ${mainHead}，不再是本次构建的源码 ${sourceSha}。发布留给 ${mainHead} 的运行。`)
    return
  }

  git(['push', 'origin', `${commit}:refs/heads/${siteBranch}`])
  console.log(`已发布：${siteBranch} 分支现为 ${commit}，源码 ${sourceSha}。`)
}

try {
  publish(process.argv.slice(2))
} catch (error) {
  if (!(error instanceof PublishError)) {
    throw error
  }
  console.error(error.message)
  // exitCode rather than exit(): the message above is flushed before the process ends.
  process.exitCode = 1
}
