import { ref } from 'vue';
import { mockCarOwners, mockShops } from './memberCore';
import type { Member, Vehicle } from './memberCore';

export type { Member, Vehicle };

export function useMemberData() {
  const carOwners = ref<Member[]>(mockCarOwners);
  const shops = ref<Member[]>(mockShops);

  return { carOwners, shops };
}
