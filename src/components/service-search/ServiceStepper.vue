<script setup lang="ts">
import { computed } from "vue";

type StepKey = "service" | "vehicle" | "datetime" | "contact" | "confirm";

const props = defineProps<{
  step: number;
  steps: Array<{ key: StepKey; label: string }>;
}>();

defineEmits<{ (e: "go", n: number): void }>();

const progressWidth = computed(() => {
  const segments = props.steps.length - 1;
  const done = Math.max(0, props.step - 1);
  return `${(done / segments) * 100}%`;
});

const circleClass = (n: number) => {
  if (n <= props.step) return "bg-[#6E6E6A] text-white";
  return "bg-white text-[#7A7A7A] border border-[#E6E6DF]";
};

const labelClass = (n: number) => {
  if (n === props.step) return "text-[#2B2B2B] font-semibold";
  return "text-[#7A7A7A]";
};
</script>

<template>
  <div class="relative">
    <div class="absolute left-0 right-0 top-[18px] h-px bg-[#E6E6DF]" />
    <div
      v-if="step > 1"
      class="absolute left-0 top-[18px] h-px bg-[#6E6E6A]"
      :style="{ width: progressWidth }"
    />
    <div class="grid grid-cols-5 items-start gap-0">
      <button
        v-for="(s, idx) in steps"
        :key="s.key"
        type="button"
        class="group relative flex flex-col items-center gap-3"
        @click="$emit('go', idx + 1)"
      >
        <span class="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold transition" :class="circleClass(idx + 1)">
          <template v-if="idx + 1 < step">
            <i class="fa-solid fa-check text-[14px]" aria-hidden="true"></i>
          </template>
          <template v-else>
            {{ idx + 1 }}
          </template>
        </span>

        <span class="text-sm transition" :class="labelClass(idx + 1)">
          {{ s.label }}
        </span>
      </button>
    </div>
  </div>
</template>
