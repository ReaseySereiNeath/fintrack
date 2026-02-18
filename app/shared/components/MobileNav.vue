<script setup lang="ts">
import { Home, List, PieChart, Wallet } from 'lucide-vue-next'

const navItems = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Trans', icon: List, path: '/transactions' },
  { name: 'Budget', icon: Wallet, path: '/budget' },
  { name: 'Analytics', icon: PieChart, path: '/analytics' },
]
</script>

<template>
  <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
    <NuxtLink
      v-for="item in navItems"
      :key="item.name"
      :to="item.path"
      class="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-full text-gray-400 hover:text-gray-600"
      active-class="text-blue-600"
      :exact="item.path === '/'"
    >
      <component :is="item.icon" :size="24" />
      <span class="text-xs font-medium">{{ item.name }}</span>
    </NuxtLink>
  </div>
</template>
