import { ref } from 'vue';
import type { Member, Vehicle } from '../types/member';
import { mockCarOwners, mockShops } from '../data/mockMembers';

export type { Member, Vehicle };

export function useMemberData() {
  const carOwners = ref<Member[]>(mockCarOwners);
  const shops = ref<Member[]>(mockShops);

  return { carOwners, shops };
}
