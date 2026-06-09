# Karry 的技术文档

基于 VitePress 的个人技术知识库。

## 文档分类

网站顶部固定保留两个入口：

```text
- 编程：docs/programming/ 与 docs/linux/
- 网络：docs/network/
```

在这些目录中新增 Markdown 文件后，对应顶部菜单、侧栏和首页文档数量会自动更新：

```text
docs/
  linux/
    docker.md
    git-remote.md
  programming/
    index.md
    openpi.md
  network/
    wireguard.md
```

文章的第一个 `# 一级标题` 会作为侧栏名称。

## 本地运行

```bash
npm install
npm run docs:dev
```

生产构建：

```bash
npm run docs:build
```
