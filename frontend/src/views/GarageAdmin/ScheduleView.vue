<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import zhTw from '@fullcalendar/core/locales/zh-tw';
import type { CalendarOptions, DayCellMountArg } from '@fullcalendar/core';

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

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
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
  initialView: window.innerWidth < 768 ? 'listWeek' : 'dayGridMonth', // 初始化判斷
  locale: zhTw,
  // 響應式高度：維持比例或固定高度
  height: 'auto',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: window.innerWidth < 768 ? 'listWeek,timeGridDay' : 'dayGridMonth,timeGridWeek',
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
  // 手機端點擊事件優化
  displayEventTime: true,
  dayMaxEvents: true, // 更多事件時顯示 +N
});

// 監聽視窗大小變化切換 View
const handleResize = () => {
  const calendarApi = calendarRef.value?.getApi();
  if (!calendarApi) return;

  if (window.innerWidth < 768) {
    calendarApi.changeView('listWeek');
    calendarApi.setOption('headerToolbar', {
      left: 'prev,next',
      center: 'title',
      right: 'today,listWeek',
    });
  } else {
    calendarApi.changeView('dayGridMonth');
    calendarApi.setOption('headerToolbar', {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    });
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="calendar-container">
    <FullCalendar :options="calendarOptions" ref="calendarRef" />
  </div>
</template>

<style scoped>
.calendar-container {
  padding: 10px;
  max-width: 100%;
  overflow-x: hidden;
}

/* 按鈕樣式自訂 */
:deep(.fc .fc-button) {
  background-color: #6b6b5a;
  border-color: #6b6b5a;
  color: #ffffff;
  font-size: 0.9em; /* 稍微縮小字體以適應手機 */
}

:deep(.fc .fc-button:hover) {
  background-color: #5f5f4f;
  border-color: #5f5f4f;
}

:deep(.fc .fc-button.fc-button-active) {
  background-color: #4f4f40;
  border-color: #4f4f40;
}

/* 針對小螢幕優化標題欄佈局 */
@media (max-width: 768px) {
  :deep(.fc .fc-toolbar) {
    flex-direction: column;
    gap: 10px;
  }

  :deep(.fc .fc-toolbar-title) {
    font-size: 1.2em;
  }

  /* 讓手機上的事件文字不要太擠 */
  :deep(.fc-event-title) {
    font-size: 0.85em;
    white-space: normal;
  }
}

:deep(.fc .fc-today-button:disabled) {
  opacity: 0.6;
}
</style>
