<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useToast } from '~/shared/composables/useToast'

const { toasts } = useToast()
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium"
        :class="{
          'bg-green-50 border-green-200 text-green-800': toast.type === 'success',
          'bg-red-50 border-red-200 text-red-800': toast.type === 'error',
          'bg-blue-50 border-blue-200 text-blue-800': toast.type === 'info',
        }"
      >
        <span class="flex-1">{{ toast.message }}</span>
        <button
          class="opacity-60 hover:opacity-100 transition-opacity"
          @click="toasts.splice(toasts.indexOf(toast), 1)"
        >
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
