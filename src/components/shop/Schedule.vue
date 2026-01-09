<script setup lang="ts">
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import zhTw from '@fullcalendar/core/locales/zh-tw'
import type { CalendarOptions, DayCellMountArg, EventMountArg } from '@fullcalendar/core'

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: zhTw,

  // 今日格子底色
  dayCellDidMount(arg: DayCellMountArg) {
    const today = new Date()

    const isToday =
      arg.date.getFullYear() === today.getFullYear() &&
      arg.date.getMonth() === today.getMonth() &&
      arg.date.getDate() === today.getDate()

    if (isToday) {
      arg.el.style.backgroundColor = '#f5f4f0'
    }
  },

  // 事件顏色
  eventDidMount(arg: EventMountArg) {
    arg.el.style.backgroundColor = '#6b6b5a'
    arg.el.style.borderColor = '#6b6b5a'
    arg.el.style.color = '#ffffff'
  },

  // events array 要撈資料庫，目前寫死以預覽
  events: [
    { title: 'Event 1', date: '2026-01-05' },
    { title: 'Event 2', date: '2026-01-12' },
  ],
})
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<style scoped>
::v-deep(.fc .fc-button) {
  background-color: #6b6b5a;
  border-color: #6b6b5a;
  color: #ffffff;
}

::v-deep(.fc .fc-button:hover) {
  background-color: #5f5f4f;
  border-color: #5f5f4f;
}

::v-deep(.fc .fc-button.fc-button-active) {
  background-color: #4f4f40;
  border-color: #4f4f40;
}

::v-deep(.fc .fc-today-button:disabled) {
  opacity: 0.6;
}
</style>
