<script setup lang="ts">
import { computed, reactive } from "vue";

type Step = 1 | 2 | 3;
type Method = "email" | "phone";

const state = reactive({
  step: 1 as Step,
  method: "email" as Method,
  identifier: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
});

const identifierLabel = computed(() =>
  state.method === "email" ? "Email" : "手機號碼"
);

const identifierPlaceholder = computed(() =>
  state.method === "email" ? "例如：name@example.com" : "例如：0912345678"
);

// 純切版：先不串 API，按鈕只切步驟方便往後合併
function goStep2() {
  state.step = 2;
}
function goStep3() {
  state.step = 3;
}
function backToStep1() {
  state.step = 1;
}
</script>

<template>
  <main class="page">
    <section class="hero">
      <div class="hero__overlay"></div>

      <div class="hero__content">
        <header class="hero__header">
          <h1 class="hero__title">carE 汽車維修預約平台</h1>
          <p class="hero__subtitle">忘記密碼</p>
          <p class="hero__desc">依序完成驗證後即可重新設定密碼</p>
        </header>

        <div class="card">
          <!-- steps -->
          <ol class="steps">
            <li :class="['steps__item', state.step === 1 && 'is-active']">1</li>
            <li class="steps__line"></li>
            <li :class="['steps__item', state.step === 2 && 'is-active']">2</li>
            <li class="steps__line"></li>
            <li :class="['steps__item', state.step === 3 && 'is-active']">3</li>
          </ol>

          <p class="steps__label">
            <span :class="['steps__text', state.step === 1 && 'is-active']">輸入帳號</span>
            <span :class="['steps__text', state.step === 2 && 'is-active']">輸入驗證碼</span>
            <span :class="['steps__text', state.step === 3 && 'is-active']">重設密碼</span>
          </p>

          <!-- Step 1 -->
          <form v-if="state.step === 1" class="form" @submit.prevent="goStep2">
            <div class="form__row">
              <label class="form__label">驗證方式</label>
              <div class="seg">
                <label class="seg__item" :class="state.method === 'email' && 'is-active'">
                  <input class="seg__radio" type="radio" value="email" v-model="state.method" />
                  <span class="seg__text">Email</span>
                </label>
                <label class="seg__item" :class="state.method === 'phone' && 'is-active'">
                  <input class="seg__radio" type="radio" value="phone" v-model="state.method" />
                  <span class="seg__text">手機</span>
                </label>
              </div>
            </div>

            <div class="form__row">
              <label class="form__label" for="identifier">{{ identifierLabel }}</label>
              <input
                id="identifier"
                class="form__input"
                v-model="state.identifier"
                :placeholder="identifierPlaceholder"
              />
              <p class="form__hint">請輸入註冊時使用的 {{ identifierLabel }}</p>
            </div>

            <div class="form__actions">
              <button class="btn btn--primary" type="submit">發送驗證碼</button>
            </div>

            <div class="form__footer">
              <router-link class="link" to="/">返回首頁</router-link>
            </div>
          </form>

          <!-- Step 2 -->
          <form v-else-if="state.step === 2" class="form" @submit.prevent="goStep3">
            <p class="form__info">
              已發送驗證碼至：<strong>{{ state.identifier || "（尚未填寫）" }}</strong>
            </p>

            <div class="form__row">
              <label class="form__label" for="otp">驗證碼</label>
              <input id="otp" class="form__input" v-model="state.otp" placeholder="輸入 4-8 位數驗證碼" />
              <p class="form__hint">若未收到，請確認垃圾郵件或簡訊攔截設定</p>
            </div>

            <div class="form__actions form__actions--between">
              <button class="btn btn--ghost" type="button" @click="backToStep1">返回</button>
              <div class="form__actionsRight">
                <button class="btn btn--ghost" type="button">重新發送</button>
                <button class="btn btn--primary" type="submit">確認</button>
              </div>
            </div>

            <div class="form__footer">
              <router-link class="link" to="/">返回首頁</router-link>
            </div>
          </form>

          <!-- Step 3 -->
          <form v-else class="form" @submit.prevent="backToStep1">
            <p class="form__info">驗證完成，請設定新密碼。</p>

            <div class="form__row">
              <label class="form__label" for="newPassword">新密碼</label>
              <input
                id="newPassword"
                class="form__input"
                v-model="state.newPassword"
                type="password"
                placeholder="至少 8 碼（建議含英數）"
              />
            </div>

            <div class="form__row">
              <label class="form__label" for="confirmPassword">再次確認新密碼</label>
              <input
                id="confirmPassword"
                class="form__input"
                v-model="state.confirmPassword"
                type="password"
                placeholder="再次輸入新密碼"
              />
            </div>

            <div class="form__actions form__actions--between">
              <button class="btn btn--ghost" type="button" @click="backToStep1">重新開始</button>
              <button class="btn btn--primary" type="submit">更新密碼</button>
            </div>

            <div class="form__footer">
              <router-link class="link" to="/">返回首頁</router-link>
            </div>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

.page {
  min-height: 100vh;
}

.hero {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding: 56px 16px 72px;
  background:
    url("/images/hero-car.jpg") center/cover no-repeat;
}


.hero__overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.72);
}

.hero__content {
  position: relative;
  width: min(980px, 100%);
}

.hero__header {
  text-align: center;
  margin-bottom: 22px;
}

.hero__title {
  margin: 0;
  font-size: clamp(26px, 3.2vw, 44px);
  font-weight: 800;
  letter-spacing: 0.5px;
  color: rgba(0, 0, 0, 0.72);
}

.hero__subtitle {
  margin: 10px 0 4px;
  font-size: clamp(16px, 1.6vw, 22px);
  font-weight: 700;
  color: rgba(0, 0, 0, 0.64);
}

.hero__desc {
  margin: 0;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.55);
}


.card {
  margin: 0 auto;
  width: min(720px, 100%);
  background: rgba(255, 255, 255, 0.94);
  border-radius: 14px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.10);
  padding: 22px 18px 18px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}


.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 6px 0 10px;
}
.steps__item {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.steps__item.is-active {
  background: rgba(108, 107, 92, 0.18);
  border-color: rgba(108, 107, 92, 0.35);
  color: rgba(0, 0, 0, 0.72);
}
.steps__line {
  width: 56px;
  height: 2px;
  background: rgba(0, 0, 0, 0.10);
  border-radius: 999px;
}
.steps__label {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin: 0 0 18px;
  font-size: 13px;
}
.steps__text {
  color: rgba(0, 0, 0, 0.45);
}
.steps__text.is-active {
  color: rgba(0, 0, 0, 0.72);
  font-weight: 700;
}

/* form */
.form {
  display: grid;
  gap: 14px;
}
.form__row {
  display: grid;
  gap: 8px;
}
.form__label {
  font-size: 13px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.62);
}
.form__input {
  height: 46px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: #fff;
  outline: none;
}
.form__input:focus {
  border-color: rgba(108, 107, 92, 0.55);
  box-shadow: 0 0 0 4px rgba(108, 107, 92, 0.14);
}
.form__hint {
  margin: 0;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}
.form__info {
  margin: 0;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.55);
}

/* segmented selector */
.seg {
  display: flex;
  gap: 10px;
}
.seg__item {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: rgba(255, 255, 255, 0.70);
  cursor: pointer;
}
.seg__item.is-active {
  border-color: rgba(108, 107, 92, 0.45);
  background: rgba(108, 107, 92, 0.12);
}
.seg__radio {
  margin: 0;
}
.seg__text {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.70);
}

/* buttons */
.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}
.form__actions--between {
  justify-content: space-between;
  align-items: center;
}
.form__actionsRight {
  display: flex;
  gap: 10px;
}

.btn {
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
}

.btn--primary {
  background: #6b6a5c; 
  color: #fff;
  border-color: rgba(0, 0, 0, 0.08);
}
.btn--primary:hover {
  filter: brightness(0.95);
}

.btn--ghost {
  background: transparent;
  border-color: rgba(0, 0, 0, 0.14);
  color: rgba(0, 0, 0, 0.62);
}

.form__footer {
  display: flex;
  justify-content: center;
  margin-top: 6px;
}

.link {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.55);
  text-decoration: none;
}
.link:hover {
  text-decoration: underline;
}
</style>
