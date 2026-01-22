import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type UserRole = 'guest' | 'member' | 'garage';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
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
    switchRole,
  };
});
