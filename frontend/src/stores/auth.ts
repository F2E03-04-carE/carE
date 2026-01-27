import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import { useUserStore } from './user';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const session = ref<Session | null>(null);
  const loading = ref(true);
  const isSigningOut = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  // 同步更新 userStore
  async function syncUserStore() {
    const userStore = useUserStore();

    // 先捕獲當前的 user 狀態，避免競態條件
    const currentUser = user.value;

    if (currentUser) {
      const currentUserId = currentUser.id;

      // 從 profiles table 獲取用戶資料
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUserId)
        .single();

      // 非同步操作後再次檢查：如果使用者已登出或已切換，則不更新 userStore
      if (!user.value || user.value.id !== currentUserId) {
        return;
      }

      if (error) {
        console.error('獲取用戶資料失敗:', error);
        // 如果 profiles table 查詢失敗，fallback 到 user_metadata
        const { full_name, name, avatar_url, role } = currentUser.user_metadata;
        userStore.login({
          id: currentUser.id,
          name: full_name || name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
          email: currentUser.email || '',
          role: currentUser.user_metadata?.role || 'member',
          avatar: avatar_url,
          nickname: currentUser.user_metadata?.nickname,
        });
      } else if (profile) {
        // 使用 profiles table 的資料，但頭像從 user_metadata 讀取（OAuth provider 提供）
        userStore.login({
          id: profile.id,
          name: profile.name || currentUser.email?.split('@')[0] || 'User',
          email: profile.email,
          role: profile.role || 'member',
          avatar: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture,
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
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        // 登出期間忽略非 SIGNED_OUT 事件（防止延遲的 updateUser 等操作觸發重新登入）
        if (isSigningOut.value && event !== 'SIGNED_OUT') {
          console.log('忽略登出期間的 auth 事件:', event);
          return;
        }

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
    isSigningOut.value = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      user.value = null;
      session.value = null;
    } finally {
      // 保持標記一段時間，忽略可能延遲到達的舊 auth 事件（如超時的 updateUser）
      setTimeout(() => {
        isSigningOut.value = false;
      }, 3000);
    }
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


