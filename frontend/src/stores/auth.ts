import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  // 初始化認證狀態
  async function initialize() {
    loading.value = true;
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      session.value = currentSession;
      user.value = currentSession?.user ?? null;

      // 監聽認證狀態變化
      supabase.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;
      });
    } catch (error) {
      console.error('初始化認證狀態失敗:', error);
    } finally {
      loading.value = false;
    }
  }

  // 使用 Magic Link 登入
  async function signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  }

  // 註冊（同時也會發送 Magic Link）
  async function signUp(email: string, phone?: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          phone,
        },
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
    signUp,
    signOut,
  };
});
