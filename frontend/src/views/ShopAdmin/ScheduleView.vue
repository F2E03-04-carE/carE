<script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhTw from '@fullcalendar/core/locales/zh-tw';
import type { CalendarOptions, DayCellMountArg, EventMountArg } from '@fullcalendar/core';

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: zhTw,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek',
  },

  // 今日格子底色
  dayCellDidMount(arg: DayCellMountArg) {
    const today = new Date();

    const isToday =
      arg.date.getFullYear() === today.getFullYear() &&
      arg.date.getMonth() === today.getMonth() &&
      arg.date.getDate() === today.getDate();

    if (isToday) {
      arg.el.style.backgroundColor = '#f5f4f0';
    }
  },

  eventColor: '#6b6b5a',

  // events array 要撈資料庫，目前寫死以預覽
  events: [
    { title: '換機油', start: '2026-01-05T10:00:00', end: '2026-01-05T11:00:00' },
    { title: '檢查煞車', start: '2026-01-05T14:00:00', end: '2026-01-05T15:30:00' },
    { title: '輪胎更換', start: '2026-01-12T09:30:00', end: '2026-01-12T11:30:00' },
    { title: '例行保養', start: '2026-01-19T13:00:00', end: '2026-01-19T16:00:00' },
    { title: '引擎維修', start: '2026-01-20T10:00:00', end: '2026-01-20T17:00:00' },
    { title: '車身鈑金', date: '2026-01-26', allDay: true },
    { title: '空調檢查', start: '2026-02-01T10:00:00', end: '2026-02-01T12:00:00' },
  ],
});
</script>

<template>
  <div>
    <FullCalendar :options="calendarOptions" ref="calendarRef" />
  </div>
</template>

<style scoped>
:deep(.fc .fc-button) {
  background-color: #6b6b5a;
  border-color: #6b6b5a;
  color: #ffffff;
}

:deep(.fc .fc-button:hover) {
  background-color: #5f5f4f;
  border-color: #5f5f4f;
}

:deep(.fc .fc-button.fc-button-active) {
  background-color: #4f4f40;
  border-color: #4f4f40;
}

:deep(.fc .fc-today-button:disabled) {
  opacity: 0.6;
}
</style>
