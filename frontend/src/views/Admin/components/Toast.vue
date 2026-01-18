<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  show: boolean;
  message: string;
  type?: 'success' | 'error';
}>();

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const toastTypeClass = computed(() => {
  return props.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white';
});
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="transform -translate-y-5 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-5 opacity-0"
  >
    <div
      v-if="show"
      class="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] justify-between"
      :class="toastTypeClass"
    >
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-2xl">
          {{ type === 'error' ? 'report' : 'check_circle' }}
        </span>
        <span class="font-medium">{{ message }}</span>
      </div>

      <button
        @click="emit('close')"
        class="text-white/80 hover:text-white transition-colors focus:outline-none flex items-center"
        aria-label="關閉"
      >
        <span class="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  </Transition>
</template>
