# beyond-similarity-web

论文 *Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories*（arXiv:2607.27595）的论文主页源码，站点地址 <https://beyond-similarity.zhaoji.ac.cn/>。

本仓库公开。提交、Issue、PR 与站点内容只写读者能公开获取的信息：论文一律按 arXiv 预印本描述，出版信息以 arXiv 页面为准；托管环境的说明在仓库之外维护，仓库只包含站点源码与构建流程。

## 导航

- 写代码、写文案、做评审之前读 `CODING_STANDARDS.md`，其中包括公开内容检查和中英文写作规范。
- 产品事实在 `PRODUCT.md`；页面结构与视觉方向的契约在 `.impeccable/surfaces/`，改页面前先读。
- 部署说明和公开内容检查规则只存在于维护者本机的 `.private/`（被 git 忽略）。
- 公开内容检查：工作区用 `pnpm check:public`，Issue 与 PR 正文发出前用 `node scripts/check-public.mjs <文件>`。每个克隆执行一次 `git config core.hooksPath .githooks`，推送前会自动检查。
- 本地验证：`pnpm build`（先做类型检查）、`pnpm test`（Playwright 在 `PREVIEW_PORT` 上启动本工作区的预览，默认 4321）。几个工作区并行时各用不同的 `PREVIEW_PORT`。设置 `BASE_URL` 后，同一套测试改为访问该地址。
- 智能体手动运行的 `pnpm preview` 会被 Astro 转到后台，用完执行 `pnpm exec astro preview stop`。`pkill -f 'astro preview'` 匹配不到后台进程（它的命令行是 `astro.mjs preview`）。
- 论文的四张图由 `node scripts/build-figures.mjs` 从 arXiv v1 源文件重新生成到 `src/assets/figures/`，需要 poppler 的 `pdftocairo`。页面上的古文引文、三张表的数据各只写一处，见 `src/data/quotations.ts` 与 `src/data/tables.ts`。
- 合并 PR 时，squash 提交的标题和正文由 GitHub 直接写进 main，推送前的检查看不到。先把两者分别写进临时文件，用 `node scripts/check-public.mjs <标题文件> <正文文件>` 检查，再执行 `gh pr merge <pr> --squash --delete-branch --subject "$(cat <标题文件>)" --body-file <正文文件>`。标题的格式是 `<emoji> <type>: <标题> (#<pr>)`，不写 `--subject` 时标题是 PR 标题，不符合提交约定。不给正文时，正文是分支上全部提交说明的拼接；正文用几段话写这次合并改了什么、为什么这样改，不复述分支上的修订过程。
- main 上测试通过的构建由 CI 的 publish 任务交给 `scripts/publish-site.mjs`，发布为 `site` 分支（ADR 0003）。不要手动推送或改写 `site`。改发布脚本后，在本地用临时裸仓库充当 origin，逐一验证六种情形：首次发布、在上一次发布之上快进、同一构建再次发布、build.json 与源码不符、origin/main 已前进、拉取与推送之间 `site` 被更新。
- 工作流里的 action 固定到提交 SHA，行尾注明版本。用 `gh api repos/<owner>/<repo>/git/ref/tags/<tag>` 解析；`object.type` 为 `tag` 时是附注标签，再查 `git/tags/<sha>` 取得提交。

## Agent skills

### Issue tracker

Issue 与 spec 放在本仓库的 GitHub Issues，用 `gh` CLI 操作。见 `docs/agents/issue-tracker.md`。

### Triage labels

五个标准分诊角色，标签名与角色名相同。见 `docs/agents/triage-labels.md`。

### Domain docs

单一上下文：仓库根目录的 `GLOSSARY.md` 加 `docs/adr/`。见 `docs/agents/domain.md`。
