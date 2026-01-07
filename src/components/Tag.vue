<script setup lang="ts">
import { computed } from 'vue'
interface CategoryTagProps {
  variant?: 'filled' | 'outlined';
  label: string;
}

const props = withDefaults(defineProps<CategoryTagProps>(),{
  variant: 'outlined',
});


</script>
<template>

</template>
