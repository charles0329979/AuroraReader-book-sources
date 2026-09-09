# 发布官方书源仓库

本目录设计为一个独立公开仓库，不与 Android 应用二进制和发布周期绑定。

## 首次发布

1. 在 GitHub 创建一个公开仓库，例如 `AuroraReader-book-sources`，默认分支使用 `main`。
2. 把本目录中的 `catalog.json`、文档和 `.github` 目录复制到仓库根目录。
3. 等待 `Validate book-source catalog` 工作流通过。
4. 确认下面形式的原始地址能直接返回 JSON，而不是网页或 404：

   `https://raw.githubusercontent.com/<owner>/<repository>/main/catalog.json`

5. 在 Android 应用仓库的 Settings → Actions → Variables 中新增变量：

   `BOOK_SOURCE_REPOSITORY_URL=<上面的原始 HTTPS 地址>`

以后 Release/FOSS 构建会把该地址注入应用。新用户首次启动后自动订阅，已有用户联网时每日检查更新。

## 日常更新

1. 修改规则并提升 `catalog.json` 的 `updatedAt`。
2. 先运行自动校验，再在实体设备完成关键词搜索、详情、章节、首图四阶段检测。
3. 更新筛选记录，合并到 `main`。
4. 客户端下载或解析失败时保留最后一次成功版本，因此不要通过删除历史文件来进行紧急回滚；直接把
   `catalog.json` 恢复到上一份健康内容并重新发布。

不要向仓库提交账号、Cookie、令牌、签名密钥、成人源或绕过网站验证的脚本。
