import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type DefaultTheme } from 'vitepress'

const docsRoot = path.resolve(import.meta.dirname, '..')

const categoryMeta: Record<string, string> = {
  programming: '编程',
  network: '网络',
  linux: 'Linux / Docker',
  git: 'Git / GitHub',
  robot: 'VLA / 机器人'
}

function documentTitle(file: string) {
  const source = fs.readFileSync(file, 'utf8')
  return source.match(/^#\s+(.+)$/m)?.[1] ?? path.basename(file, '.md')
}

function directoryItems(directory: string) {
  const absoluteDirectory = path.join(docsRoot, directory)
  if (!fs.existsSync(absoluteDirectory)) return []

  return fs.readdirSync(absoluteDirectory, { withFileTypes: true })
    .filter((file) => file.isFile() && file.name.endsWith('.md'))
    .map((file) => ({
      text: documentTitle(path.join(absoluteDirectory, file.name)),
      link: `/${directory}/${file.name.replace(/\.md$/, '')}`
    }))
}

function discoverSidebars(): DefaultTheme.SidebarMulti {
  return Object.fromEntries(
    fs.readdirSync(docsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'public')
      .map((entry) => {
        const items = directoryItems(entry.name)
        return [
          `/${entry.name}/`,
          [{ text: categoryMeta[entry.name] ?? entry.name, collapsed: false, items }]
        ]
      })
  )
}

export default defineConfig({
  lang: 'zh-CN',
  title: 'Karry 的技术博客',
  description: '记录学习笔记、实验过程、环境配置和技术总结',
  base: '/tech-docs/',
  cleanUrls: true,
  head: [
    ['meta', { name: 'theme-color', content: '#f7f8fa' }],
    ['link', { rel: 'icon', href: '/tech-docs/favicon.svg', type: 'image/svg+xml' }]
  ],
  themeConfig: {
    logo: '/favicon.svg',
    nav: [
      { text: '编程', items: directoryItems('programming') },
      { text: '网络', items: directoryItems('network') }
    ],
    sidebar: discoverSidebars(),
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/karry06/tech-docs' }],
    footer: {
      message: '持续记录，保持好奇。',
      copyright: 'Copyright © 2026 Karry'
    }
  },
  markdown: { lineNumbers: true }
})
