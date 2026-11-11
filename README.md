# Vibe Knowledge Video

用于制作内容驱动的知识讲解动画，采用 **模板工程 + 项目配置 + Skill** 的组织方式，正在从 Canvas 制作流程迁移到 Remotion。

**当前是工程骨架，不是可以直接生成视频的完整工具。**

## 当前状态

| 部分 | 版本 | 状态 |
| --- | --- | --- |
| Remotion 模板工程 | 0.1.0-alpha.0 | 目录、配置草案和骨架检查已完成；尚未安装 Remotion、React 或接通预览和导出 |
| knowledge-video Skill | 1.0.0 | 保留已有维护源，仅适配旧 Canvas 工程 v0.3.0；尚未接入本仓库的新工程 |
| 旧 Canvas 工程 | 0.3.0 | 本次未收录，用作本地迁移对照 |

不要把当前 Skill 安装后即可制作 Remotion 视频作为本版本的能力。Skill 的旧工程定位规则和本机回退路径保留供迁移参考，不适用于其他电脑的默认安装。

## 仓库结构

```text
knowledge-video-remotion-template/  新工程、配置模板、迁移设计与检查工具
skills/knowledge-video/             Skill 维护源文件
README.md                          项目入口与当前状态
.gitignore                         本地文件和生成结果的排除规则
.gitattributes                     文本换行规则
```

工程中的 `projects/` 保存各期内容，`templates/starter/` 提供空白配置。当前没有实际主题项目或已渲染影片。

## 现在可以运行什么

安装 Node.js 20 或更高版本后，在仓库根目录执行：

```sh
cd knowledge-video-remotion-template
npm run check:scaffold
```

此命令只使用 Node.js 自带功能，不需要先安装第三方依赖。它检查目录、JSON、模板文件引用及示例事件关系，不代表画面、混音、视频导出或听感已经验证。

Remotion 运行依赖和锁文件将在下一阶段加入。目前没有可运行的 `dev` 或 `render` 命令。

## 制作原则

- 先确定内容、必要解释和讲解时间，再参考音乐节拍设计动作。
- 配乐保持连贯；开始、结束和转场音效服务于具体内容。
- 同一用途可以使用不同声音，但要与当时的配乐和画面协调。
- 过程音按需要启用，不要求每个动作都发声。
- 公共能力放工程，单期选择放项目，制作方法放 Skill。
- 自动检查和人工观看、试听分别记录，不把技术检查通过当作审美通过。

## 下一步

按 [迁移清单](knowledge-video-remotion-template/docs/MIGRATION.md) 接通最小预览与导出，再逐项实现时间轴、画面、声音和审片。完成旧案例验证后更新 Skill 的兼容范围。

相关说明：

- [工程总览](knowledge-video-remotion-template/README.md)
- [工程架构](knowledge-video-remotion-template/docs/ARCHITECTURE.md)
- [项目配置约定](knowledge-video-remotion-template/docs/PROJECT-CONTRACT.md)
- [Skill 当前适用范围](skills/README.md)

## 版本和文件管理

- 这个仓库是后续工程与 Skill 维护源的统一位置；已安装 Skill 是运行副本。
- 一次提交对应一个明确改动；较大的功能改造使用分支，验证后合并到 `main`。
- 工程与 Skill 独立编号，发布时注明兼容关系；当前 alpha 版本只表示骨架阶段。
- 上传源码、配置、文档、检查工具，以及安装阶段生成的依赖锁文件。
- 不上传依赖目录、渲染浏览器、缓存、账号信息或每次生成的视频和混音。
- 公共素材索引可以上传；原始媒体默认忽略，只按需要明确收录可以公开分发的样例，并保留来源说明。
- 当前未附加源码开源许可证；第三方依赖和素材分别遵循其自身许可。
