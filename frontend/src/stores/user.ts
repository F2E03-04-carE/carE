import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UserRole = 'guest' | 'member' | 'garage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  nickname?: string;
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);

  const isLoggedIn = computed(() => currentUser.value !== null);

  const userRole = computed(() => currentUser.value?.role || 'guest');

  const login = (user: User) => {
    currentUser.value = user;
  };

  const logout = () => {
    currentUser.value = null;
  };

  /** 只更新個人資料欄位（姓名、暱稱），讓 navbar 等即時反映 */
  const updateProfile = (partial: Pick<User, 'name' | 'nickname'>) => {
    if (!currentUser.value) return;
    currentUser.value = { ...currentUser.value, ...partial };
  };

  const switchRole = (role: UserRole) => {
    if (currentUser.value) {
      currentUser.value.role = role;
    }
  };

  return {
    currentUser,
    isLoggedIn,
    userRole,
    login,
    logout,
    updateProfile,
    switchRole,
  };
});
