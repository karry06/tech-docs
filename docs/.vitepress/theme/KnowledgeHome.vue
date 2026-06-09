<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as categories } from './categories.data'
</script>

<template>
  <main class="knowledge-home">
    <section class="home-hero">
      <div class="home-kicker"><span></span> PERSONAL TECH BLOG</div>
      <h1>Karry 的技术博客</h1>
      <p>记录我的学习笔记、实验过程、环境配置和技术总结。</p>
      <div class="home-actions">
        <a class="primary-action" :href="withBase(categories[0]?.links[0] ?? '/')">开始阅读 <span>→</span></a>
        <a class="secondary-action" href="https://github.com/karry06/tech-docs">GitHub</a>
      </div>
    </section>

    <section class="library-section">
      <div class="section-heading">
        <div>
          <span class="section-label">BLOG</span>
          <h2>文章分类</h2>
        </div>
        <span>{{ categories.length }} 个分类</span>
      </div>

      <div class="library-list">
        <a v-for="category in categories" :key="category.key" class="library-row" :href="withBase(category.links[0])">
          <span class="library-icon">{{ category.icon }}</span>
          <span class="library-copy">
            <strong>{{ category.title }}</strong>
            <small>{{ category.description }}</small>
          </span>
          <span class="library-count">{{ category.links.length }} 篇</span>
          <span class="library-arrow">→</span>
        </a>
      </div>

      <p class="library-tip">在 <code>docs/分类目录/</code> 中新建 Markdown，首页分类与侧栏会自动更新。</p>
    </section>
  </main>
</template>
