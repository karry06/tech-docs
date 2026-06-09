import DefaultTheme from 'vitepress/theme'
import KnowledgeHome from './KnowledgeHome.vue'
import LinkCard from './LinkCard.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('KnowledgeHome', KnowledgeHome)
    app.component('LinkCard', LinkCard)
  }
}
