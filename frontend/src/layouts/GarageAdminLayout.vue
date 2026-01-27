<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';

const route = useRoute();

// Sidebar 狀態
const sidebarOpen = ref(false);

// 車廠資料
const garageId = ref<number | null>(null);
const garageName = ref<string>('維修廠後台');
const isLoadingGarage = ref(true);

// 導航項目定義
type NavKey = 'dashboard' | 'appointments' | 'records' | 'settings';

interface NavItem {
  key: NavKey;
  path: string;
  label: string;
  icon: string; // SVG path
}

const navItems: NavItem[] = [
  {
    key: 'dashboard',
    path: '/garage/admin/dashboard',
    label: '總覽',
    icon: 'dashboard'
  },
  {
    key: 'appointments',
    path: '/garage/admin/appointments',
    label: '預約排程',
    icon: 'appointments'
  },
  {
    key: 'records',
    path: '/garage/admin/records',
    label: '完工維修記錄',
    icon: 'records'
  },
  {
    key: 'settings',
    path: '/garage/admin/settings',
    label: '編輯維修廠',
    icon: 'settings'
  }
];

// 當前頁面標題（根據路由）
const pageHeader = computed(() => {
  const path = route.path;
  if (path.includes('dashboard')) return { title: '總覽', sub: '今日維修廠營運概況' };
  if (path.includes('appointments')) return { title: '預約排程', sub: '管理客戶預約與維修進度' };
  if (path.includes('records')) return { title: '完工維修記錄', sub: '查詢過往維修履歷與工單細節' };
  if (path.includes('settings')) return { title: '編輯維修廠', sub: '維護維修廠的基本資料與簡介' };
  return { title: '', sub: '' };
});

// Sidebar 控制
function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}

function closeSidebar() {
  sidebarOpen.value = false;
}

// 初始化車廠資料
async function initGarageData() {
  try {
    isLoadingGarage.value = true;

    const { data: garages, error } = await supabase
      .from('garages')
      .select('id, name')
      .limit(1)
      .single();

    if (!error && garages) {
      garageId.value = garages.id;
      garageName.value = garages.name || '維修廠後台';
    }
  } catch (e) {
    console.error('初始化車廠資料失敗:', e);
  } finally {
    isLoadingGarage.value = false;
  }
}

onMounted(() => {
  initGarageData();
});
</script>

<template>
  <div class="min-h-screen bg-[#EBE8E3] font-sans text-stone-600">
    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar Overlay (Mobile) -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        @click="closeSidebar"
      ></div>

      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col border-r border-[#DCD9D3] bg-[#EBE8E3] transition-transform duration-300 lg:static lg:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Sidebar Header -->
        <div class="p-8">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-[#6B6B5C] text-[#EBE8E3] shadow-sm">
                <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h1 class="text-xl font-bold tracking-wider text-[#4A4A45]">{{ garageName }}</h1>
            </div>
            <button
              @click="closeSidebar"
              class="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition hover:bg-[#DEDbd6] hover:text-stone-600 lg:hidden"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-2 overflow-y-auto">
          <router-link
            v-for="item in navItems"
            :key="item.key"
            :to="item.path"
            class="flex w-full items-center gap-3 rounded-lg px-4 py-3.5 text-left text-stone-500 transition-all duration-300 hover:bg-[#DEDbd6] hover:text-[#4A4A45]"
            active-class="!bg-[#6B6B5C] !text-[#EBE8E3] shadow-md shadow-[#6B6B5C]/20"
            @click="closeSidebar"
          >
            <!-- Dashboard Icon -->
            <svg v-if="item.icon === 'dashboard'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <!-- Appointments Icon -->
            <svg v-if="item.icon === 'appointments'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 2v4"/>
              <path d="M16 2v4"/>
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M3 10h18"/>
              <path d="M10 14h4"/>
            </svg>
            <!-- Records Icon -->
            <svg v-if="item.icon === 'records'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6"/>
              <path d="M16 13H8"/>
              <path d="M16 17H8"/>
              <path d="M10 9H8"/>
            </svg>
            <!-- Settings Icon -->
            <svg v-if="item.icon === 'settings'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span class="font-medium tracking-wide">{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Footer Info -->
        <div class="p-6">
          <div class="rounded-lg bg-[#DEDbd6]/50 p-4 border border-[#DCD9D3]">
            <div class="text-xs text-stone-500">目前模式</div>
            <div class="font-bold text-[#4A4A45] tracking-wide">開發預覽 (Admin)</div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto">
        <div class="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
          <!-- Header with Mobile Menu Button -->
          <header class="mb-10">
            <div class="flex items-center gap-4">
              <button
                @click="toggleSidebar"
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-[#DCD9D3] bg-white text-stone-600 shadow-sm transition hover:bg-[#F8F7F5] lg:hidden"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </button>
              <div>
                <h2 class="text-2xl font-bold text-[#4A4A45] tracking-wide sm:text-3xl">{{ pageHeader.title }}</h2>
                <p class="mt-1 text-sm text-stone-500 font-medium sm:mt-2 sm:text-base">{{ pageHeader.sub }}</p>
              </div>
            </div>
          </header>

          <!-- Router View (子頁面內容) -->
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
