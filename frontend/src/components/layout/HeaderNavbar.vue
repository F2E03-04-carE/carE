<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import LoginMode from '@/views/Auth/LoginMode.vue';
import RegisterPage from '@/views/Auth/RegisterPage.vue';

export interface HeaderNavbarProps {
  userRole?: 'guest' | 'member' | 'garage';
}

const props = withDefaults(defineProps<HeaderNavbarProps>(), {
  userRole: 'guest',
});

const userStore = useUserStore();

const currentUserRole = computed(() => {
  return userStore.userRole || props.userRole;
});

const baseButtonClass =
  'px-3 py-3 sm:px-4 sm:py-2 lg:px-5 lg:py-2 text-[14px] sm:text-[16px] lg:text-[18px] rounded-lg sm:rounded-xl transition-colors duration-200 cursor-pointer';
const textOnlyButtonClass =
  'px-2 py-2 sm:px-4 sm:py-2 lg:px-3 lg:py-2 text-[14px] sm:text-[15px] lg:text-[16px] cursor-pointer';

const isMobileMenuOpen = ref(false);
const isShowLoginModal = ref(false);
const isShowRegister = ref(false);
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

const toggleMobileAccordion = () => {
  isMobileAccordionOpen.value = !isMobileAccordionOpen.value;
};

const openDropdown = () => {
  isDropdownOpen.value = true;
};

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

const openLoginModal = () => {
  isShowLoginModal.value = true;
  isShowRegister.value = false;
  closeMobileMenu();
};

const closeLoginModal = () => {
  isShowLoginModal.value = false;
};

const handleGoToRegister = () => {
  closeLoginModal();
  isShowRegister.value = true;
  closeMobileMenu();
  window.scrollTo(0, 0);
};

const handleBackToLogin = () => {
  isShowRegister.value = false;
  isShowLoginModal.value = true;
};

const closeRegister = () => {
  isShowRegister.value = false;
};

const handleLogout = () => {
  closeMobileMenu();
  closeDropdown();
};
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
            :class="[textOnlyButtonClass, 'text-[#6b6b5a] hover:scale-110 transition-transform']"
          >
            尋找維修廠
          </button>

          <template v-if="currentUserRole === 'guest'">
            <button
              :class="[textOnlyButtonClass, 'text-[#6b6b5a] hover:scale-110 transition-transform']"
            >
              刊登維修廠
            </button>
            <button
              @click="openLoginModal"
              :class="[
                baseButtonClass,
                'border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white',
              ]"
            >
              登入
            </button>
            <button
              @click="handleGoToRegister"
              :class="[
                baseButtonClass,
                'bg-[#6b6b5a] text-white hover:bg-[#5a5a4a] px-4 sm:px-6 lg:px-6 border border-transparent',
              ]"
            >
              加入會員
            </button>
          </template>

          <template v-else-if="currentUserRole === 'member'">
            <div
              class="relative group"
              @mouseenter="openDropdown"
              @mouseleave="closeDropdown"
            >
              <button
                :class="[textOnlyButtonClass, 'text-[#6b6b5a] hover:scale-110 transition-transform']"
              >
                會員管理
              </button>
              <div
                v-if="isDropdownOpen"
                class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e0e0db] pt-2 pb-2 z-50 before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-full before:h-2 before:bg-transparent"
              >
                <a
                  href="/member/profile"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  會員基本資料
                </a>
                <a
                  href="/member/bookings"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  預約紀錄
                </a>
                <a
                  href="/member/history"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  維修歷史
                </a>
                <a
                  href="/member/post-garage"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  刊登維修廠
                </a>
              </div>
            </div>
            <button
              @click="handleLogout"
              :class="[
                baseButtonClass,
                'border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white',
              ]"
            >
              登出
            </button>
          </template>

          <template v-else-if="currentUserRole === 'garage'">
            <div
              class="relative group"
              @mouseenter="openDropdown"
              @mouseleave="closeDropdown"
            >
              <button
                :class="[textOnlyButtonClass, 'text-[#6b6b5a] hover:scale-110 transition-transform']"
              >
                商家管理
              </button>
              <div
                v-if="isDropdownOpen"
                class="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e0e0db] pt-2 pb-2 z-50 before:content-[''] before:absolute before:left-0 before:right-0 before:bottom-full before:h-2 before:bg-transparent"
              >
                <a
                  href="/garage/dashboard"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  今日總覽
                </a>
                <a
                  href="/garage/profile"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  商家基本資料
                </a>
                <a
                  href="/garage/schedule"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  預約排程
                </a>
                <a
                  href="/garage/orders"
                  class="block px-4 py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] transition-colors text-center"
                >
                  歷史訂單
                </a>
              </div>
            </div>
            <button
              @click="handleLogout"
              :class="[
                baseButtonClass,
                'border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white',
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
          @click="closeMobileMenu"
          class="w-full py-3 text-[16px] text-[#6b6b5a] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
        >
          尋找維修廠
        </button>

        <template v-if="currentUserRole === 'guest'">
          <button
            @click="closeMobileMenu"
            class="w-full py-3 text-[16px] text-[#6b6b5a] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
          >
            刊登維修廠
          </button>
          <button
            @click="openLoginModal"
            class="w-full py-3 text-[16px] border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white rounded-lg transition-colors text-center"
          >
            登入
          </button>
          <button
            @click="handleGoToRegister"
            class="w-full py-3 text-[16px] bg-[#6b6b5a] text-white hover:bg-[#5a5a4a] rounded-lg transition-colors text-center"
          >
            加入會員
          </button>
        </template>

        <template v-else-if="currentUserRole === 'member'">
          <div class="flex flex-col gap-2">
            <button
              @click="toggleMobileAccordion"
              class="w-full py-3 text-[16px] text-[#6b6b5a] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
            >
              會員管理
            </button>
            <div
              v-if="isMobileAccordionOpen"
              class="flex flex-col gap-2 pl-4"
            >
              <a
                href="/member/profile"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                會員基本資料
              </a>
              <a
                href="/member/bookings"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                預約紀錄
              </a>
              <a
                href="/member/history"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                維修歷史
              </a>
              <a
                href="/member/post-garage"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                刊登維修廠
              </a>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="w-full py-3 text-[16px] border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white rounded-lg transition-colors text-center"
          >
            登出
          </button>
        </template>

        <template v-else-if="currentUserRole === 'garage'">
          <div class="flex flex-col gap-2">
            <button
              @click="toggleMobileAccordion"
              class="w-full py-3 text-[16px] text-[#6b6b5a] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
            >
              商家管理
            </button>
            <div
              v-if="isMobileAccordionOpen"
              class="flex flex-col gap-2 pl-4"
            >
              <a
                href="/garage/dashboard"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                今日總覽
              </a>
              <a
                href="/garage/profile"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                商家基本資料
              </a>
              <a
                href="/garage/schedule"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                預約排程
              </a>
              <a
                href="/garage/orders"
                class="w-full py-2 text-[14px] text-[#4a4a43] hover:bg-[#f5f4f0] rounded-lg transition-colors text-center"
                @click="closeMobileMenu"
              >
                歷史訂單
              </a>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="w-full py-3 text-[16px] border border-[#6b6b5a] text-[#6b6b5a] hover:bg-[#6b6b5a] hover:text-white rounded-lg transition-colors text-center"
          >
            登出
          </button>
        </template>
      </div>
    </nav>

    <LoginMode
      v-if="isShowLoginModal"
      @close="closeLoginModal"
      @switch-to-signup="handleGoToRegister"
    />

    <RegisterPage
      v-if="isShowRegister"
      @close="closeRegister"
      @switch-to-login="handleBackToLogin"
    />
  </header>
</template>
