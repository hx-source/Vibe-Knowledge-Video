# 工程调用与版本边界

## 定位

将下面的 Skill 路径替换为本次实际安装位置；脚本只读取信息，不创建或改动工程。

```powershell
python -X utf8 C:/Users/hx/.codex/skills/knowledge-video/scripts/locate_engine.py
# 用户指定其他工程时
python -X utf8 C:/Users/hx/.codex/skills/knowledge-video/scripts/locate_engine.py --root D:/Documents/dy/knowledge-video-template
```

优先使用显式路径，其次环境变量，再检查当前目录及父目录中的工程。多份本地工程同时匹配时脚本报出候选，不静默挑选。当前环境的已知工程位置只是最后回退，不能覆盖用户指定的错误路径。

从定位结果读取 engineRoot；后续命令的工作目录均为该路径。读取其 README.md 和 package.json，以及所选项目的配置。工程声音详情以 `docs/AUDIO-WORKFLOW-v0.3.md` 为准，结构说明为 `docs/ENGINE-REVIEW-v0.3.md`，避免把这些文件复制进 Skill 形成另一份规范。

## 项目与版本

| 项目 | project.json | audio-plan.json |
| --- | --- | --- |
| 新一期 | schemaVersion 2、templateVersion 0.3.0 | schemaVersion 2 |
| v0.2 历史声音试验 | schemaVersion 2、templateVersion 0.2.0 | schemaVersion 1 |
| 死锁/TCP 已有影片 | schemaVersion 1、templateVersion 0.1.0 | 声音配置在 project.json 中 |

新模式：`video.duration`、字幕、事件、场景 t、CLI、播放器都是成片秒数；字幕必须连续覆盖总时长。字幕 start/end 可以引用 `{ "event":"reveal", "offset":0 }`，动画从 `config.timeline.events` 取值。

旧模式：源时间 = 成片秒数 × video.speed。旧片的 1.25 倍速是项目选择，不是后续视频默认值。修改旧片时先明确该秒数是哪一条时间轴；不要直接把字幕、音效或场景秒数混用。

`projects/catalog.json` 区分主题样例、工程验证和历史试听试验。`audio-policy-demo` 用于验证功能，不代表声音方案已被认可。新建项目从 starter 开始，不复制试验中不合适的音效。

## 常用命令

以下以 `topic-id` 为示例名称，替换成本期实际的小写字母、数字、连字符名称。不要在终端执行未替换的尖括号占位符。

```powershell
npm run new -- --project topic-id --title "本期主题"
npm run doctor -- --project topic-id
npm run audio -- --project topic-id
npm run preview -- --project topic-id --port 8737
npm run stills -- --project topic-id --times 1,5,9 --name review-frames-v1
npm run render -- --project topic-id --from 4 --to 7 --name transition-v1
npm run check -- --project topic-id --name check-v1
npm run render -- --project topic-id --name full-v1
```

环境首次使用或发生变化时运行 doctor。工程依赖由 package-lock.json 固定；缺失时根据实际环境执行 npm ci。不要无故升级依赖。Chrome 或 localhost 被执行环境限制时按工具权限流程处理，不能把验证没运行写成“通过”。

preview 是持续运行的本机服务；告知实际地址，并记录本次启动的进程。任务结束是否保留服务以预览需要为准，不结束其他用户进程。

所有 CLI 区间均为成片秒数。输出默认拒绝覆盖；迭代通常换 --name。正式混音会由 audio/render/preview/check 重建，audio-review 单独输出，不覆盖正式 mix.wav。

本期文件分工：facts.md 放知识边界；project.json 放事件、时长、风格；captions.json 放字幕与场景段落；film.js 和 scenes/ 放本期画面；audio-plan.json 放当前声音；assets/ 放素材；output/ 放视频、SRT、试听页和 manifest。

## 声音试听命令

```powershell
# settle 为本期已定义事件；前后范围按实际内容需要选择
npm run audio-review -- --project topic-id --event settle --before 1 --after 1.5 --name ending-v1
npm run audio-review -- --project topic-id --event settle --compare audio-alternative.json --name ending-ab-v1
npm run audio-review -- --project topic-id --from 4 --to 7 --name sound-range-v1
```

--event 与 --from/--to 不能同时使用；--compare 是项目内的音频方案 JSON 路径。新版试听工具要求音频 schema 2，旧项目需显式升级副本后才能使用；不要修改版本字段伪造迁移。

打开 output/对应名称/index.html，可单听混音、配乐、音效和各角色，切换 A/B 保留进度。它是音频试听页，只有字幕上下文，尚未内置画面 A/B。需要同时检查动作时配合现有播放器或局部视频。

## 合理检查范围

- 新主题：核查配置、关键帧、最难短片段、浏览器 check，以及完整视频的解码结果。
- 局部画面修改：检查修改区间及其前后交接，必要时运行项目 check。
- 局部声音修改：核对计划与事件、混音报告、局部 A/B、最终导出解码；画面未改时不要求重跑所有旧片。
- 公共引擎改动：npm test，并按改动范围运行旧片回归及新骨架验证。工程测试通过不代表知识和声音审美通过。

输出 manifest 记录实际引擎、素材和配置摘要。改变了源码或配置后应生成新的输出清单，不把历史记录改写成最新验证。
