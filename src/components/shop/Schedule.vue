<script setup lang="ts">
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  //   events array 要撈資料庫，目前寫死以預覽
  events: [
    { title: 'Event 1', date: '2026-01-05' },
    { title: 'Event 2', date: '2026-01-12' },
  ],
})
</script>
<template>
  <FullCalendar :options="calendarOptions" />
</template>
