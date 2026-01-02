<!-- 日期選擇器。
時段選擇器。
預約緩衝時間設定 (預設間隔1小時)
顯示剩餘可接單數
(預設2位、0位代表該時端不可預約) -->
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'

const selectedDate = ref<Date | null>(new Date())
const today = new Date()
</script>
<template>
  <DatePicker :min-date="today" />
</template>
