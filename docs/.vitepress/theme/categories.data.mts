import { createContentLoader } from 'vitepress'

const categoryMeta: Record<string, { title: string; description: string; icon: string }> = {
  programming: { title: '编程', description: '编程语言、工具链与开发实践', icon: '</>' },
  linux: { title: 'Linux / Docker', description: '系统运维、容器化与开发环境', icon: 'L' },
  git: { title: 'Git / GitHub', description: '版本控制、远程仓库与协作工作流', icon: 'G' },
  robot: { title: 'VLA / 机器人', description: '具身智能、机器人模型与实验记录', icon: 'R' },
  network: { title: '网络 / WireGuard', description: '网络基础、安全连接与组网实践', icon: 'N' }
}

export default createContentLoader('**/*.md', {
  transform(pages) {
    const groups = new Map<string, { key: string; title: string; description: string; icon: string; links: string[] }>()

    for (const page of pages) {
      const key = page.url.split('/').filter(Boolean)[0]
      if (!key) continue

      const meta = categoryMeta[key] ?? {
        title: key,
        description: `${key} 分类下的技术文章`,
        icon: key.slice(0, 1).toUpperCase()
      }
      const group = groups.get(key) ?? { key, ...meta, links: [] }
      group.links.push(page.url)
      groups.set(key, group)
    }

    return [...groups.values()]
  }
})
