# Git 本地仓库配置多git平台

## 目标

让本地同一个 Git 仓库同时绑定 Gitee 和 GitHub。以后在 VSCode 中点击「提交并推送」，或者执行 `git push origin 分支名`，代码会同时推送到两个远程仓库。

## 当前远程仓库查看

```powershell
git remote -v
```

示例输出：

```text
origin  git@gitee.com:gao_kaiwei622/gkwchatmind.git (fetch)
origin  git@gitee.com:gao_kaiwei622/gkwchatmind.git (push)
origin  git@github.com:karry06/gkwchatmind.git (push)
```

含义：

```text
fetch：默认从 Gitee 拉取代码
push：同时推送到 Gitee 和 GitHub
```

## 配置方法

假设原本已经绑定 Gitee：

```text
git@gitee.com:gao_kaiwei622/gkwchatmind.git
```

现在新增 GitHub 仓库：

```text
git@github.com:karry06/gkwchatmind.git
```

执行：

```powershell
git remote set-url --add --push origin git@gitee.com:gao_kaiwei622/gkwchatmind.git
git remote set-url --add --push origin git@github.com:karry06/gkwchatmind.git
```

然后检查：

```powershell
git remote -v
```

正确结果应类似：

```text
origin  git@gitee.com:gao_kaiwei622/gkwchatmind.git (fetch)
origin  git@gitee.com:gao_kaiwei622/gkwchatmind.git (push)
origin  git@github.com:karry06/gkwchatmind.git (push)
```

## 推送代码

查看当前分支：

```powershell
git branch --show-current
```

如果当前分支是 `main`：

```powershell
git push origin main
```

如果当前分支是 `master`：

```powershell
git push origin master
```

之后在 VSCode 中使用「提交并推送」，也会按照 `origin` 的 push 配置，同时推送到 Gitee 和 GitHub。

## 注意事项

1. GitHub 仓库最好提前创建为空仓库，不要勾选 README、`.gitignore`、License，避免历史冲突。
2. 如果使用 SSH 地址，需要提前把本机 SSH Key 添加到 Gitee 和 GitHub。
3. `git remote -v` 中 Gitee 出现两次是正常的，一个表示 `fetch`，一个表示 `push`。
4. 当前配置表示：默认从 Gitee 拉取代码，同时推送到 Gitee 和 GitHub。
