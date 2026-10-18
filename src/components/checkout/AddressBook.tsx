import { useState } from 'react';
import { useAddressStore } from '@/store/useAddressStore';
import { formatAddress } from '@/lib/checkout';
import AddressForm from './AddressForm';

type Mode = { type: 'list' } | { type: 'add' } | { type: 'edit'; id: string };

/** เลือกที่อยู่จัดส่งจากสมุดที่อยู่ เพิ่ม / แก้ไข / ลบได้ */
export default function AddressBook() {
  const addresses = useAddressStore((s) => s.addresses);
  const selectedId = useAddressStore((s) => s.selectedId);
  const { addAddress, updateAddress, removeAddress, selectAddress } = useAddressStore.getState();
  const [mode, setMode] = useState<Mode>({ type: 'list' });

  if (addresses.length === 0 || mode.type === 'add') {
    return (
      <AddressForm
        submitLabel="บันทึกและใช้ที่อยู่นี้"
        onSubmit={(input) => {
          addAddress(input);
          setMode({ type: 'list' });
        }}
        onCancel={addresses.length > 0 ? () => setMode({ type: 'list' }) : undefined}
      />
    );
  }

  if (mode.type === 'edit') {
    const editing = addresses.find((a) => a.id === mode.id);
    if (editing) {
      const { id, ...initial } = editing;
      return (
        <AddressForm
          initial={initial}
          onSubmit={(input) => {
            updateAddress(id, input);
            setMode({ type: 'list' });
          }}
          onCancel={() => setMode({ type: 'list' })}
        />
      );
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {addresses.map((address) => {
        const checked = address.id === selectedId;
        return (
          <div
            key={address.id}
            className={`rounded-box border-2 p-4 transition ${checked ? 'border-primary bg-primary/5' : 'border-base-300'}`}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="address"
                className="radio radio-primary mt-1"
                checked={checked}
                onChange={() => selectAddress(address.id)}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-outline badge-sm">{address.label}</span>
                  <span className="font-semibold">{address.recipientName}</span>
                  <span className="text-sm opacity-70">{address.phone}</span>
                </div>
                <p className="mt-1 text-sm">{formatAddress(address)}</p>
              </div>
            </label>
            <div className="mt-2 flex justify-end gap-1">
              <button type="button" className="btn btn-ghost btn-xs" onClick={() => setMode({ type: 'edit', id: address.id })}>
                แก้ไข
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={() => {
                  if (window.confirm(`ลบที่อยู่ "${address.label}" ?`)) removeAddress(address.id);
                }}
              >
                ลบ
              </button>
            </div>
          </div>
        );
      })}
      <button type="button" className="btn btn-outline btn-sm self-start" onClick={() => setMode({ type: 'add' })}>
        + เพิ่มที่อยู่ใหม่
      </button>
    </div>
  );
}
