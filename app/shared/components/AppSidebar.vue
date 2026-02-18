<script setup lang="ts">
import { Home, List, PieChart, Wallet, Settings, X } from 'lucide-vue-next'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()

watch(() => route.path, () => emit('close'))

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Transactions', icon: List, path: '/transactions' },
  { name: 'Budget', icon: Wallet, path: '/budget' },
  { name: 'Analytics', icon: PieChart, path: '/analytics' },
]
</script>

<template>
  <!-- Desktop sidebar (lg+) -->
  <div class="hidden lg:flex h-screen w-64 bg-gray-900 text-white flex-col fixed left-0 top-0 overflow-y-auto z-40">
    <div class="p-6 border-b border-gray-800">
      <h1 class="text-2xl font-bold flex items-center gap-2">
        <span class="bg-blue-500 p-1 rounded">
          <Wallet :size="24" class="text-white" />
        </span>
        FinTrack
      </h1>
    </div>
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li v-for="item in navItems" :key="item.name">
          <NuxtLink
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-800 hover:text-white"
            active-class="bg-blue-600 text-white hover:bg-blue-600"
            :exact="item.path === '/'"
          >
            <component :is="item.icon" :size="20" />
            <span class="font-medium">{{ item.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <div class="p-4 border-t border-gray-800">
      <div class="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white cursor-pointer rounded-lg hover:bg-gray-800 transition-colors">
        <Settings :size="20" />
        <span>Settings</span>
      </div>
    </div>
  </div>

  <!-- Mobile/tablet drawer overlay -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="lg:hidden fixed inset-0 bg-black/50 z-50"
        @click="emit('close')"
      />
    </Transition>
    <Transition name="slide">
      <div
        v-if="open"
        class="lg:hidden fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white flex flex-col z-50 overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-800 flex items-center justify-between">
          <h1 class="text-2xl font-bold flex items-center gap-2">
            <span class="bg-blue-500 p-1 rounded">
              <Wallet :size="24" class="text-white" />
            </span>
            FinTrack
          </h1>
          <button class="p-1 text-gray-400 hover:text-white transition-colors" @click="emit('close')">
            <X :size="24" />
          </button>
        </div>
        <nav class="flex-1 p-4">
          <ul class="space-y-2">
            <li v-for="item in navItems" :key="item.name">
              <NuxtLink
                :to="item.path"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-gray-800 hover:text-white"
                active-class="bg-blue-600 text-white hover:bg-blue-600"
                :exact="item.path === '/'"
              >
                <component :is="item.icon" :size="20" />
                <span class="font-medium">{{ item.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="p-4 border-t border-gray-800">
          <div class="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white cursor-pointer rounded-lg hover:bg-gray-800 transition-colors">
            <Settings :size="20" />
            <span>Settings</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
