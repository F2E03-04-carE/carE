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
  async function syncUserStore() {
    const userStore = useUserStore();

    if (user.value) {
      // 從 profiles table 獲取用戶資料
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single();

      if (error) {
        console.error('獲取用戶資料失敗:', error);
        // 如果 profiles table 查詢失敗，fallback 到 user_metadata
        const { full_name, name, avatar_url, role } = user.value.user_metadata;
        userStore.login({
          id: user.value.id,
          name: full_name || name || user.value.user_metadata?.name || user.value.email?.split('@')[0] || 'User',
          email: user.value.email || '',
          role: user.value.user_metadata?.role || 'member',
          avatar: avatar_url,
          nickname: user.value.user_metadata?.nickname,
        });
      } else if (profile) {
        // 使用 profiles table 的資料
        userStore.login({
          id: profile.id,
          name: profile.name || user.value.email?.split('@')[0] || 'User',
          email: profile.email,
          role: profile.role || 'member',
          avatar: profile.avatar_url,
          nickname: profile.nickname,
        });
      }
    } else {
      // 登出時清空 userStore
      userStore.logout();
    }
  }
  async function initialize() {
    loading.value = true;
    try {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      session.value = currentSession;
      user.value = currentSession?.user ?? null;

      // 同步 userStore
      await syncUserStore();

      // 監聽認證狀態變化
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        session.value = newSession;
        user.value = newSession?.user ?? null;

        // 每次認證狀態變化時同步 userStore
        await syncUserStore();
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

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
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
    signInWithGoogle,
    signOut,
  };
});


