<script setup lang="ts">
import { ref } from 'vue'

const showToast = ref(false)

const form = ref({
  name: '專業汽車維修中心',
  phone: '02-1234-5678',
  address: '台北市中山區建國北路123號',
  description: '本廠擁有20年以上維修經驗，專業技師團隊提供各式車輛維修保養服務。',
})

const onSave = () => {
  // mock api
  setTimeout(() => {
    showToast.value = true
  }, 300)
}
</script>

<template>
  <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
    <div>
      <label class="block text-sm mb-1">廠房名稱</label>
      <input v-model="form.name" class="input" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm mb-1">聯絡電話</label>
        <input v-model="form.phone" class="input" />
      </div>
      <div>
        <label class="block text-sm mb-1">廠房地址</label>
        <input v-model="form.address" class="input" />
      </div>
    </div>

    <div>
      <label class="block text-sm mb-1">廠房簡介</label>
      <textarea v-model="form.description" rows="4" class="input" />
      <p class="text-xs text-gray-400 mt-1">建議輸入您的專業特色、服務項目、經驗年資等資訊</p>
    </div>

    <div class="flex justify-end gap-3">
      <button class="btn-secondary">取消</button>
      <button class="btn-primary" @click="onSave">儲存變更</button>
    </div>
  </div>

  <SaveToast v-if="showToast" :seconds="5" @close="showToast = false" />
</template>
