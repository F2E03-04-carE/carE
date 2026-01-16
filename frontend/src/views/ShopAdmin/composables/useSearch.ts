import { ref, computed } from 'vue';
import type { Ref } from 'vue';

type FilterFn<Item> = (item: Item, keyword: string) => boolean;

export function useSearch<Item>(data: Ref<Item[]>, filterFn: FilterFn<Item>) {
  const keyword = ref('');

  const filteredResults = computed(() => {
    // 如果沒有輸入關鍵字，直接回傳全部資料
    if (!keyword.value.trim()) {
      return data.value;
    }

    const key = keyword.value.toLowerCase();
    return data.value.filter((item) => filterFn(item, key));
  });

  return {
    keyword,
    filteredResults,
  };
}
