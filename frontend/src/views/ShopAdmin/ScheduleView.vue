<script setup lang="ts">
import { ref } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhTw from '@fullcalendar/core/locales/zh-tw';
import type { CalendarOptions, DayCellMountArg } from '@fullcalendar/core';

// 假資料
const mockEvents = [
  {
    title: '維修: Toyota Altis',
    start: new Date().toISOString().split('T')[0] + 'T10:00:00',
    end: new Date().toISOString().split('T')[0] + 'T12:00:00',
  },
  {
    title: '保養: Honda CRV',
    start: new Date().toISOString().split('T')[0] + 'T14:00:00',
    end: new Date().toISOString().split('T')[0] + 'T16:00:00',
  },
];

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
  events: mockEvents,
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
