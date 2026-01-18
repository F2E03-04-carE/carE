<script setup lang="ts">
import { ref, computed } from 'vue';

interface Review {
  id: string;
  author: string;
  targetShop: string;
  rating: number;
  content: string;
  date: string;
  status: 'Published' | 'Hidden';
}

// 假資料
const reviews = ref<Review[]>([
  {
    id: 'R001',
    author: '王小明',
    targetShop: '大安優質修車廠',
    rating: 5,
    content: '服務很好，老闆親切！',
    date: '2026-01-18',
    status: 'Published',
  },
  {
    id: 'R002',
    author: '李美玲',
    targetShop: '板橋快速保養中心',
    rating: 4,
    content: '速度很快，但休息區有點小。',
    date: '2026-01-17',
    status: 'Published',
  },
  {
    id: 'R003',
    author: '陳建國',
    targetShop: '中和輪胎行',
    rating: 1,
    content: '換完輪胎後定位還是不準，回去處理還要等很久。',
    date: '2026-01-15',
    status: 'Hidden',
  },
  {
    id: 'R004',
    author: '張大華',
    targetShop: '永和專業烤漆',
    rating: 5,
    content: '烤漆顏色完全沒有色差，像新的一樣！',
    date: '2026-01-14',
    status: 'Published',
  },
]);

const getStatusLabel = (status: string) => {
  return status === 'Published' ? '已發布' : '已隱藏';
};

const getStatusClass = (status: string) => {
  return status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
};

const toggleStatus = (review: Review) => {
  review.status = review.status === 'Published' ? 'Hidden' : 'Published';
};
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-xl font-bold text-gray-800">評論列表</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              ID
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              評論者
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              評論對象
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              評分
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              內容
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              日期
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              狀態
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="review in reviews" :key="review.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{{ review.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ review.author }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ review.targetShop }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <div class="flex items-center">
                <span class="text-yellow-400 mr-1">★</span>
                {{ review.rating }}
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="review.content">
              {{ review.content }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ review.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(review.status)"
              >
                {{ getStatusLabel(review.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="toggleStatus(review)" class="text-[#6b6b5a] hover:text-[#5a5a4a]">
                {{ review.status === 'Published' ? '隱藏' : '重新發布' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
