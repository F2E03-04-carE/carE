import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { useUserStore } from './user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  // 同步更新 userStore
  function syncUserStore() {
    const userStore = useUserStore();

    if (user.value) {
      // 登入時更新 userStore
      userStore.login({
        id: user.value.id,
        name: user.value.user_metadata?.name || user.value.email?.split('@')[0] || 'User',
        email: user.value.email || '',
        role: user.value.user_metadata?.role || 'member',
      });
    } else {
      // 登出時清空 userStore
      userStore.logout();
    }
  }

  // 初始化認證狀態
  async function initialize() {
    loading.value = true;
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      session.value = currentSession;
      user.value = currentSession?.user ?? null;

      // 同步 userStore
      syncUserStore();

      // 監聽認證狀態變化
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;

        // 每次認證狀態變化時同步 userStore
        syncUserStore();
      });
    } catch (error) {
      console.error('初始化認證狀態失敗:', error);
    } finally {
      loading.value = false;
    }
  }

  // 使用 Magic Link 登入/註冊（自動處理新舊用戶）
  async function signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  }

  // 登出
  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    user.value = null;
    session.value = null;
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    initialize,
    signInWithMagicLink,
    signOut,
  };
});
