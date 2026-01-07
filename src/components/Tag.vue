<script setup lang="ts">
import { computed } from 'vue'
interface CategoryTagProps {
  variant?: 'filled' | 'outlined';
  label: string;
}

const props = withDefaults(defineProps<CategoryTagProps>(),{
  variant: 'outlined',
});

const tagClass = computed(() => {
  const baseClass = 'inline-block px-3 py-1 text-[14px] rounded-full';

  if (props.variant === 'filled') {
    return `${baseClass} bg-[#8b7d6b] text-white`;
  } else {
    return `${baseClass} bg-[#f5f1ed] text-[#8b7d6b] border border-[#8b7d6b]`;
  }
});

</script>
<template>

</template>
