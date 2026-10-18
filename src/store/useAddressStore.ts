import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Address, AddressInput } from '@/types/order';

interface AddressState {
  addresses: Address[];
  selectedId: Address['id'] | null;
}

interface AddressActions {
  addAddress: (input: AddressInput) => Address['id'];
  updateAddress: (id: Address['id'], input: AddressInput) => void;
  removeAddress: (id: Address['id']) => void;
  selectAddress: (id: Address['id']) => void;
}

export type AddressStore = AddressState & AddressActions;

const newId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/**
 * Address Store (Client State)
 * - สมุดที่อยู่ของผู้ใช้ เลือกได้ 1 ที่อยู่สำหรับจัดส่ง
 * - persist ลง localStorage เพื่อใช้ซ้ำในการสั่งซื้อครั้งถัดไป
 */
export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      addresses: [],
      selectedId: null,

      addAddress: (input) => {
        const id = newId();
        set((state) => ({
          addresses: [...state.addresses, { ...input, id }],
          selectedId: id,
        }));
        return id;
      },

      updateAddress: (id, input) =>
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...input, id } : a)),
        })),

      removeAddress: (id) =>
        set((state) => {
          const addresses = state.addresses.filter((a) => a.id !== id);
          const selectedId =
            state.selectedId === id ? (addresses[0]?.id ?? null) : state.selectedId;
          return { addresses, selectedId };
        }),

      selectAddress: (id) => set({ selectedId: id }),
    }),
    {
      name: 'booknest-addresses',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state): AddressState => ({
        addresses: state.addresses,
        selectedId: state.selectedId,
      }),
    },
  ),
);

export const selectSelectedAddress = (state: AddressStore): Address | undefined =>
  state.addresses.find((a) => a.id === state.selectedId);
