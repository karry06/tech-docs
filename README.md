# Karry 的技术博客

基于 VitePress 的个人技术知识库。

## 文章分类

首页会自动展示 `docs/` 下的全部文章分类。顶部导航只精选展示：

```text
- 编程：`docs/programming/`
- 网络：`docs/network/`
```

在任意分类目录中新增 Markdown 文件后，首页分类、侧栏和文章数量会自动更新：

```text
docs/
  linux/
    docker.md
  git/
    git-remote.md
  programming/
    index.md
  robot/
    openpi.md
  network/
    wireguard.md
```

只有 `programming` 和 `network` 下的文章会显示在顶部导航中。文章的第一个 `# 一级标题` 会作为侧栏名称。

本地开发使用根路径，文章可直接访问：

```text
http://localhost:5173/linux/docker
```

生产构建仍会使用 GitHub Pages 所需的 `/tech-docs/` 路径。

## Markdown 写法

加粗标记内部不要在结尾保留空格：

```md
<!-- 正确 -->
**`--policy.config`** 参数说明

<!-- 错误 -->
**--policy.config ** 参数说明
```

外部资料可以使用链接预览卡片：

```md
<LinkCard
  title="PyOrbbecSDK · SDK V2"
  url="https://github.com/orbbec/pyorbbecsdk/tree/v2-main"
  description="v2-main 分支，Orbbec SDK V2"
/>
```

## 本地运行

```bash
npm install
npm run docs:dev
```

生产构建：

```bash
npm run docs:build
```
