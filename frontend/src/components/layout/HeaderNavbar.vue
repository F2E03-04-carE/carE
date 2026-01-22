<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import LoginMode from '@/views/Auth/LoginMode.vue';

export interface HeaderNavbarProps {
  userRole?: 'guest' | 'member' | 'garage' | 'admin';
}

const props = withDefaults(defineProps<HeaderNavbarProps>(), {
  userRole: 'guest',
});

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const uiStore = useUiStore();

const currentUserRole = computed(() => {
  // 優先使用 userStore 的角色狀態，因為在 Onboarding 流程中我們可能會手動切換角色
  if (userStore.isLoggedIn) {
    return userStore.userRole;
  }
  if (authStore.isAuthenticated) {
    return userStore.userRole || 'member';
  }
  return props.userRole;
});

// 取得用戶顯示名稱（優先顯示 nickname，否則顯示 "用戶"）
const userDisplayName = computed(() => {
  if (authStore.user) {
    const nickname = authStore.user.user_metadata?.nickname;
    // 檢查 nickname 是否存在且不是空字串
    if (nickname && nickname.trim() !== '') {
      return nickname;
    }
    return '用戶';
  }
  // 對於 userStore.currentUser 也使用相同邏輯
  const currentNickname = userStore.currentUser?.nickname;
  if (currentNickname && currentNickname.trim() !== '') {
    return currentNickname;
  }
  return '用戶';
});

const baseButtonClass =
  'px-3 py-3 sm:px-4 sm:py-2 lg:px-5 lg:py-2 text-[14px] sm:text-[16px] lg:text-[18px] rounded-lg sm:rounded-xl transition-colors duration-200 cursor-pointer';
const textOnlyButtonClass =
  'px-2 py-2 sm:px-4 sm:py-2 lg:px-3 lg:py-2 text-[14px] sm:text-[15px] lg:text-[16px] cursor-pointer';

const isMobileMenuOpen = ref(false);
const isDropdownOpen = ref(false);
const isMobileAccordionOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (!isMobileMenuOpen.value) {
    isMobileAccordionOpen.value = false;
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  isMobileAccordionOpen.value = false;
};

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const openLoginModal = () => {
  uiStore.openLoginModal();
  closeMobileMenu();
};

const closeLoginModal = () => {
  uiStore.closeLoginModal();
};

const handleLogout = async () => {
  try {
    // 嘗試呼叫 Supabase 登出
    await authStore.signOut();
  } catch (error) {
    // 即使 Supabase 登出失敗，也只在 console 警告，不中斷後續流程
    console.warn('Supabase sign out warning:', error);
  } finally {
    // 無論如何都要清除前端狀態並導航
    userStore.logout();
    closeMobileMenu();
    closeDropdown();
    router.push('/');
  }
};

// 導航到「加入維修廠」頁面
const handleGoToJoinGarage = () => {
  closeMobileMenu();
  router.push('/join-garage');
};

// 導航到指定頁面
const handleNavigate = (path: string) => {
  closeDropdown();
  closeMobileMenu();
  router.push(path);
};

interface MenuItem {
  label: string;
  href: string;
}

const menuConfig = {
  member: {
    title: '會員管理',
    items: [
      { label: '會員基本資料', href: '/member' },
      { label: '愛車管理', href: '/member/vehicles' },
      { label: '預約紀錄', href: '/member/bookings' },
      { label: '歷史保養', href: '/member/history' },
      { label: '刊登維修廠', href: '/join-garage' },
    ],
  },
  garage: {
    title: '商家管理',
    items: [
      { label: '商家總覽', href: '/garage-admin/overview' },
      { label: '訂單管理', href: '/garage-admin/orders' },
      { label: '排程管理', href: '/garage-admin/schedule' },
      { label: '商家資訊', href: '/garage-admin/edit' },
    ],
  },
  admin: {
    title: '平台管理',
    items: [
      { label: '會員管理', href: '/admin/members' },
      { label: '評價管理', href: '/admin/reviews' },
    ],
  },
};

const currentMenu = computed(() => {
  const role = currentUserRole.value;
  if (role === 'member' || role === 'garage' || role === 'admin') {
    return menuConfig[role];
  }
  return null;
});
</script>

<template>
  <header class="fixed top-0 left-0 w-full right-0 z-50 bg-white shadow-md">
    <nav class="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-[60px] sm:h-[70px]">
        <a href="/" class="flex items-center gap-2 shrink-0">
          <img
            src="@/assets/icons/carE_logo_green.png"
            alt="carE logo"
            class="h-10 sm:h-12 w-auto object-contain"
          />
        </a>

        <div class="hidden md:flex items-center gap-2 lg:gap-3 font-extrabold">
          <button
            @click="handleNavigate('/')"
            :class="[textOnlyButtonClass, 'text-[#6b6b5a] hover:scale-110 transition-transform']"
          >
            尋找維修廠
          </button>

          <template v-if="currentUserRole === 'guest'">
            <button
              @click="handleGoToJoinGarage"
              :class="[textOnlyButtonClass, 'text-[#6b6b5a] hover:scale-110 transition-transform']"
            >
              刊登維修廠
            </button>
            <button
              @click="openLoginModal"
              :class="[
                baseButtonClass,
                'bg-[#6b6b5a] text-white hover:bg-[#5a5a4a] px-4 sm:px-6 lg:px-6 border border-transparent',
              ]"
            >
              登入/註冊
            </button>
          </template>

          <template v-else-if="currentMenu">
            <div class="relative group" @mouseenter="openDropdown" @mouseleave="closeDropdown">
              <button
                :class="[
                  textOnlyButtonClass,
                  'text-[#6b6b5a] hover:scale-110 transition-transform flex items-center gap-2',
                ]"
              >
                 <img
                  v-if="userStore.currentUser?.avatar"
                   :src="userStore.currentUser.avatar"
                  class="w-8 h-8 rounded-full border border-gray-200"
                  referrerpolicy="no-referrer"
                />
                <i  v-else class="fa-solid fa-user text-[14px]"></i>
                <span class="max-w-[150px] truncate">{{ userDisplayName }}</span>
                <i class="fa-solid fa-chevron-down text-[10px]"></i>
              </button>
              <div
                v-if="isDropdownOpen"
                class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e0e0db] pt-2 pb-2 z-50 before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-full before:h-2 before:bg-transparent"
              >
                <button
                  v-for="item in currentMenu.items"
                  :key="item.href"
                  @click="handleNavigate(item.href)"
                  class="block w-full px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center cursor-pointer"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>
            <button
              @click="handleLogout"
              :class="[
                baseButtonClass,
                'border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white px-4 py-1 sm:py-1.5 transition-all',
              ]"
            >
              登出
            </button>
          </template>
        </div>

        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 text-[#6b6b5a] hover:bg-[#f5f4f0] rounded-lg transition-colors"
          aria-label="開啟選單"
        >
          <span class="material-symbols-outlined text-[32px]">
            {{ isMobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>

      <div
        v-if="isMobileMenuOpen"
        class="md:hidden pb-4 flex flex-col gap-3 font-extrabold border-t border-[#e0e0db] pt-4"
      >
        <button
          @click="handleNavigate('/')"
          class="w-full py-3 text-[16px] text-[#6b6b5a] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
        >
          尋找維修廠
        </button>

        <template v-if="currentUserRole === 'guest'">
          <button
            @click="handleGoToJoinGarage"
            class="w-full py-3 text-[16px] text-[#6b6b5a] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
          >
            刊登維修廠
          </button>
          <button
            @click="openLoginModal"
            class="w-full py-3 text-[16px] bg-[#6b6b5a] text-white hover:bg-[#5a5a4a] rounded-lg transition-colors text-center"
          >
            登入/註冊
          </button>
        </template>

        <template v-else-if="currentMenu">
          <div class="flex flex-col gap-2">
            <!-- User Name Header (Static) -->
            <div
              class="w-full py-3 text-[16px] text-[#6b6b5a] border-b border-[#e0e0db] mb-2 font-bold flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-user text-[14px]"></i>
              <span class="max-w-[200px] truncate">{{ userDisplayName }}</span>
            </div>

            <!-- Menu Items -->
            <button
              v-for="item in currentMenu.items"
              :key="item.href"
              @click="handleNavigate(item.href)"
              class="w-full py-3 text-[16px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center cursor-pointer"
            >
              {{ item.label }}
            </button>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="w-full py-3 text-[16px] text-red-600 hover:bg-red-50 rounded-lg transition-colors text-center cursor-pointer mt-2"
            >
              登出
            </button>
          </div>
        </template>
      </div>
    </nav>

    <LoginMode v-if="uiStore.isLoginModalOpen" @close="closeLoginModal" />
  </header>
</template>
