<script setup lang="ts">
const sidebarOpen = ref(false)

provide('sidebarOpen', sidebarOpen)
</script>

<template>
  <div class="flex h-screen bg-gray-50 text-gray-900 font-sans">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <MobileNav />
    <main class="flex-1 lg:ml-64 overflow-y-auto w-full">
      <!-- Mobile/tablet header with hamburger -->
      <div class="lg:hidden flex items-center gap-3 p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
        <button class="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors" @click="sidebarOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span class="text-lg font-bold text-gray-900">FinTrack</span>
      </div>
      <div class="p-4 lg:p-8 pb-24 lg:pb-8">
        <slot />
      </div>
    </main>
  </div>
</template>
