<template>
  <div class="garage-settings">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">編輯維修廠</h1>
    <p class="text-gray-600">Step 5 會在這裡實作編輯維修廠頁面內容</p>
    
    <!-- 暫時的表單框架 -->
    <div class="mt-8 bg-white p-6 rounded-lg shadow">
      <form @submit.prevent="saveSettings">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">維修廠名稱</label>
            <input type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="請輸入維修廠名稱" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">聯絡電話</label>
            <input type="tel" class="w-full px-4 py-2 border rounded-lg" placeholder="請輸入聯絡電話" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">地址</label>
            <input type="text" class="w-full px-4 py-2 border rounded-lg" placeholder="請輸入地址" />
          </div>
        </div>
        
        <div class="mt-6">
          <button type="submit" class="px-6 py-2 bg-[#6b6b5a] text-white rounded-lg hover:bg-[#5a5a4a]">
            儲存變更
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
function saveSettings() {
  alert('Step 5 會實作完整的儲存邏輯');
}
</script>
