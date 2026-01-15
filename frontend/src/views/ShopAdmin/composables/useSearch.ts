import { ref, computed } from 'vue';
import type { Ref } from 'vue';

type FilterFn<T> = (item: T, keyword: string) => boolean;

export function useSearch<T>(data: Ref<T[]>, filterFn: FilterFn<T>) {
  const keyword = ref('');

  const filteredResults = computed(() => {
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
