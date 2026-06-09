import DefaultTheme from 'vitepress/theme'
import KnowledgeHome from './KnowledgeHome.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('KnowledgeHome', KnowledgeHome)
  }
}
