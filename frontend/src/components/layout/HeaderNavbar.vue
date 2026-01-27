<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import LoginMode from '@/views/Auth/LoginMode.vue';

// Props
export interface HeaderNavbarProps {
  userRole?: 'guest' | 'member' | 'garage';
}

const props = withDefaults(defineProps<HeaderNavbarProps>(), {
  userRole: 'guest',
});

// Stores & Router
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

// 選單配置
const menuConfig = {
  member: {
    title: '會員管理',
    items: [
      { label: '會員中心', href: '/member/profile' },
      { label: '預約紀錄', href: '/member/bookings' },
      { label: '維修歷史', href: '/member/history' },
      { label: '刊登維修廠', href: '/member/post-garage' },
    ],
  },
  garage: {
    title: '商家管理',
    items: [
      { label: '今日總覽', href: '/garage/dashboard' },
      { label: '商家基本資料', href: '/garage/profile' },
      { label: '預約排程', href: '/garage/schedule' },
      { label: '歷史訂單', href: '/garage/orders' },
    ],
  },
} as const;

// Computed
const currentUserRole = computed(() => {
  if (authStore.isAuthenticated) {
    return userStore.userRole || 'member';
  }
  if (userStore.isLoggedIn) {
    return userStore.userRole;
  }
  return props.userRole;
});

const currentMenu = computed(() => {
  const role = currentUserRole.value;
  if (role === 'member' || role === 'garage') {
    return menuConfig[role];
  }
  return null;
});

const userDisplayName = computed(() => {
  // 優先從 userStore 取得 nickname
  const nickname = userStore.currentUser?.nickname;
  if (nickname?.trim()) {
    return nickname;
  }
  // 其次從 authStore 的 user_metadata 取得
  const metaNickname = authStore.user?.user_metadata?.nickname;
  if (metaNickname?.trim()) {
    return metaNickname;
  }
  return '用戶';
});

const userAvatar = computed(() => userStore.currentUser?.avatar);

// State
const isMobileMenuOpen = ref(false);
const isShowLoginModal = ref(false);
const isDropdownOpen = ref(false);
const isLoggingOut = ref(false);

// Methods
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const openLoginModal = () => {
  isShowLoginModal.value = true;
  closeMobileMenu();
};

const closeLoginModal = () => {
  isShowLoginModal.value = false;
};

const handleNavigate = (path: string) => {
  closeDropdown();
  closeMobileMenu();
  router.push(path);
};

const handleGoToJoinGarage = () => {
  closeMobileMenu();
  router.push('/join-garage');
};

const handleLogout = async () => {
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;
  try {
    // 使用 authStore.signOut() 以確保正確處理競態條件
    await authStore.signOut();
    userStore.logout();
    closeMobileMenu();
    closeDropdown();
    router.push('/');
  } catch (error) {
    console.error('登出失敗:', error);
  } finally {
    isLoggingOut.value = false;
  }
};
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-50 bg-white shadow-md">
    <nav class="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
      <div class="flex h-[60px] items-center justify-between sm:h-[70px]">
        <!-- Logo -->
        <a href="/" class="flex shrink-0 items-center gap-2">
          <img
            src="@/assets/icons/carE_logo_green.png"
            alt="carE logo"
            class="h-10 w-auto object-contain sm:h-12"
          />
        </a>

        <!-- Desktop Navigation -->
        <div class="hidden items-center gap-2 font-extrabold md:flex lg:gap-3">
          <button
            @click="handleNavigate('/')"
            class="cursor-pointer px-2 py-2 text-[14px] text-[#6b6b5a] transition-transform hover:scale-110 sm:px-4 sm:py-2 sm:text-[15px] lg:px-3 lg:py-2 lg:text-[16px]"
          >
            尋找維修廠
          </button>

          <!-- Guest Actions -->
          <template v-if="currentUserRole === 'guest'">
            <button
              @click="handleGoToJoinGarage"
              class="cursor-pointer px-2 py-2 text-[14px] text-[#6b6b5a] transition-transform hover:scale-110 sm:px-4 sm:py-2 sm:text-[15px] lg:px-3 lg:py-2 lg:text-[16px]"
            >
              刊登維修廠
            </button>
            <button
              @click="openLoginModal"
              class="cursor-pointer rounded-lg border border-transparent bg-[#6b6b5a] px-4 py-3 text-[14px] text-white transition-colors duration-200 hover:bg-[#5a5a4a] sm:rounded-xl sm:px-6 sm:py-2 sm:text-[16px] lg:px-6 lg:py-2 lg:text-[18px]"
            >
              登入/註冊
            </button>
          </template>

          <!-- Authenticated User Actions -->
          <template v-else-if="currentMenu">
            <!-- User Dropdown -->
            <div class="group relative" @mouseenter="openDropdown" @mouseleave="closeDropdown">
              <button
                class="flex cursor-pointer items-center gap-2 px-2 py-2 text-[14px] text-[#6b6b5a] transition-transform hover:scale-110 sm:px-4 sm:py-2 sm:text-[15px] lg:px-3 lg:py-2 lg:text-[16px]"
              >
                <img
                  v-if="userAvatar"
                  :src="userAvatar"
                  class="h-8 w-8 rounded-full border border-gray-200"
                  referrerpolicy="no-referrer"
                  alt="用戶頭像"
                />
                <i v-else class="fa-solid fa-user text-[14px]"></i>
                <span class="max-w-[150px] truncate">{{ userDisplayName }}</span>
                <i class="fa-solid fa-chevron-down text-[10px]"></i>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="isDropdownOpen"
                class="absolute left-1/2 top-full z-50 mt-2 w-48 -translate-x-1/2 rounded-lg border border-[#e0e0db] bg-white pb-2 pt-2 shadow-lg before:absolute before:bottom-full before:left-0 before:right-0 before:h-2 before:bg-transparent before:content-['']"
              >
                <button
                  v-for="item in currentMenu.items"
                  :key="item.href"
                  @click="handleNavigate(item.href)"
                  class="block w-full cursor-pointer px-4 py-2 text-center text-[14px] text-[#4a4a43] transition-colors hover:bg-[#f5f4f0]"
                >
                  {{ item.label }}
                </button>
              </div>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              :disabled="isLoggingOut"
              :class="[
                'cursor-pointer rounded-lg border border-[#6b6b5a] px-4 py-1 text-[14px] transition-all sm:rounded-xl sm:py-1.5 sm:text-[16px] lg:text-[18px]',
                isLoggingOut
                  ? 'cursor-not-allowed opacity-50'
                  : 'text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white',
              ]"
            >
              {{ isLoggingOut ? '登出中...' : '登出' }}
            </button>
          </template>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          @click="toggleMobileMenu"
          class="rounded-lg p-2 text-[#6b6b5a] transition-colors hover:bg-[#f5f4f0] md:hidden"
          aria-label="開啟選單"
        >
          <span class="material-symbols-outlined text-[32px]">
            {{ isMobileMenuOpen ? 'close' : 'menu' }}
          </span>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-if="isMobileMenuOpen"
        class="flex flex-col gap-3 border-t border-[#e0e0db] pb-4 pt-4 font-extrabold md:hidden"
      >
        <button
          @click="handleNavigate('/')"
          class="w-full rounded-lg py-3 text-center text-[16px] text-[#6b6b5a] transition-colors hover:bg-[#f5f4f0]"
        >
          尋找維修廠
        </button>

        <!-- Guest Mobile Actions -->
        <template v-if="currentUserRole === 'guest'">
          <button
            @click="handleGoToJoinGarage"
            class="w-full rounded-lg py-3 text-center text-[16px] text-[#6b6b5a] transition-colors hover:bg-[#f5f4f0]"
          >
            刊登維修廠
          </button>
          <button
            @click="openLoginModal"
            class="w-full rounded-lg bg-[#6b6b5a] py-3 text-center text-[16px] text-white transition-colors hover:bg-[#5a5a4a]"
          >
            登入/註冊
          </button>
        </template>

        <!-- Authenticated User Mobile Actions -->
        <template v-else-if="currentMenu">
          <div class="flex flex-col gap-2">
            <!-- User Header -->
            <div
              class="mb-2 flex w-full items-center justify-center gap-2 border-b border-[#e0e0db] py-3 text-[16px] font-bold text-[#6b6b5a]"
            >
              <img
                v-if="userAvatar"
                :src="userAvatar"
                class="h-8 w-8 rounded-full border border-gray-200"
                referrerpolicy="no-referrer"
                alt="用戶頭像"
              />
              <i v-else class="fa-solid fa-user text-[14px]"></i>
              <span class="max-w-[200px] truncate">{{ userDisplayName }}</span>
            </div>

            <!-- Menu Items -->
            <button
              v-for="item in currentMenu.items"
              :key="item.href"
              @click="handleNavigate(item.href)"
              class="w-full cursor-pointer rounded-lg py-3 text-center text-[16px] text-[#4a4a43] transition-colors hover:bg-[#f5f4f0]"
            >
              {{ item.label }}
            </button>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              :disabled="isLoggingOut"
              :class="[
                'mt-2 w-full cursor-pointer rounded-lg py-3 text-center text-[16px] transition-colors',
                isLoggingOut
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-red-600 hover:bg-red-50',
              ]"
            >
              {{ isLoggingOut ? '登出中...' : '登出' }}
            </button>
          </div>
        </template>
      </div>
    </nav>

    <!-- Login Modal -->
    <LoginMode v-if="isShowLoginModal" @close="closeLoginModal" />
  </header>
</template>
