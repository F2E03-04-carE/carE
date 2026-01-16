<script setup lang="ts">
import type { WorkshopStatus } from '@/mocks/workshop.mock';

defineProps<{
  title: string;
  icon: string;
  isEditing: boolean;
  status: Exclude<WorkshopStatus, 'rejected'>;
  isSaveDisabled?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:isEditing', value: boolean): void;
  (event: 'save'): void;
  (event: 'cancel'): void;
}>();

const startEditing = () => {
  emit('update:isEditing', true);
};
</script>

<template>
  <section class="bg-[#f5f4f0] p-8 rounded-2xl shadow-sm">
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-medium text-[#4a4a43] flex items-center gap-2">
          <span class="material-symbols-outlined">{{ icon }}</span> {{ title }}
        </h2>
        <div v-if="status === 'active'" class="flex justify-end gap-3">
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="px-6 py-2 rounded-2xl bg-[#6b6b5a] text-white font-medium cursor-pointer hover:bg-[#57574a] transition"
          >
            編輯
          </button>
          <template v-else>
            <button
              @click="$emit('cancel')"
              class="px-6 py-2 rounded-2xl border border-[#6b6b5a] text-[#4a4a43] cursor-pointer hover:bg-[#e6e5df] transition"
            >
              取消
            </button>
            <button
              @click="$emit('save')"
              :disabled="isSaveDisabled"
              class="px-6 py-2 rounded-2xl text-white transition"
              :class="[
                isSaveDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#6b6b5a] hover:bg-[#57574a] cursor-pointer',
              ]"
            >
              儲存變更
            </button>
          </template>
        </div>
      </div>
      <slot></slot>
    </div>
  </section>
</template>
