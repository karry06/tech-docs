import { createContentLoader } from 'vitepress'

const sections = [
  {
    key: 'programming',
    title: '编程',
    description: '编程语言、Linux、Git、Docker 与机器人开发',
    icon: '</>',
    directories: ['programming', 'linux']
  },
  {
    key: 'network',
    title: '网络',
    description: '网络基础、安全连接与组网实践',
    icon: 'N',
    directories: ['network']
  }
]

export default createContentLoader('**/*.md', {
  transform(pages) {
    return sections.map((section) => ({
      ...section,
      links: pages
        .filter((page) => section.directories.includes(page.url.split('/').filter(Boolean)[0]))
        .map((page) => page.url)
    }))
  }
})
