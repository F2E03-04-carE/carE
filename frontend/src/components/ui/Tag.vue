<script setup lang="ts">
import { computed } from 'vue';
interface CategoryTagProps {
  variant?: 'filled' | 'outlined';
  label: string;
}

const props = withDefaults(defineProps<CategoryTagProps>(), {
  variant: 'outlined',
});

const tagClass = computed(() => {
  const baseClass = 'inline-block px-3 py-1 text-[14px] rounded-full';

  if (props.variant === 'filled') {
    return `${baseClass} bg-[#6B6B5C] text-white`;
  } else {
    return `${baseClass} bg-[#F5F2EE] text-[#6B6B5C] border border-[#6B6B5C]`;
  }
});
</script>

<template>
  <span :class="tagClass">
    {{ label }}
  </span>
</template>
