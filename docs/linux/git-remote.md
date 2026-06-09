# Git 远程仓库

Git 远程仓库用于在本地仓库和 GitHub 等托管平台之间同步代码。

## 查看远程仓库

```bash
git remote -v
```

## 添加与修改远程地址

```bash
git remote add origin git@github.com:karry06/tech-docs.git
git remote set-url origin git@github.com:karry06/tech-docs.git
```

## 推送 main 分支

```bash
git push -u origin main
```
