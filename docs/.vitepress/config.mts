import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, type DefaultTheme } from 'vitepress'

const docsRoot = path.resolve(import.meta.dirname, '..')

const groups = {
  programming: {
    text: '编程',
    directories: [
      { key: 'programming', text: '编程笔记' },
      { key: 'linux', text: 'Linux / Git / Docker' }
    ]
  },
  network: {
    text: '网络',
    directories: [{ key: 'network', text: '网络 / WireGuard' }]
  }
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

function groupItems(group: keyof typeof groups) {
  return groups[group].directories.flatMap((directory) => directoryItems(directory.key))
}

function sidebarGroups(group: keyof typeof groups): DefaultTheme.SidebarItem[] {
  return groups[group].directories
    .map((directory) => ({
      text: directory.text,
      collapsed: false,
      items: directoryItems(directory.key)
    }))
    .filter((directory) => directory.items.length > 0)
}

const programmingItems = groupItems('programming')
const networkItems = groupItems('network')

export default defineConfig({
  lang: 'zh-CN',
  title: 'Karry 的技术文档',
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
      { text: '编程', items: programmingItems },
      { text: '网络', items: networkItems }
    ],
    sidebar: {
      '/programming/': sidebarGroups('programming'),
      '/linux/': sidebarGroups('programming'),
      '/network/': sidebarGroups('network')
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
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
  lastUpdated: true,
  markdown: { lineNumbers: true }
})
