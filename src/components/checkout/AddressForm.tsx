import { useState, type FormEvent, type InputHTMLAttributes } from 'react';
import { THAI_PROVINCES } from '@/lib/checkout';
import type { AddressInput } from '@/types/order';

interface AddressFormProps {
  initial?: AddressInput;
  submitLabel?: string;
  onSubmit: (input: AddressInput) => void;
  onCancel?: () => void;
}

type Errors = Partial<Record<keyof AddressInput, string>>;

const EMPTY: AddressInput = {
  label: 'บ้าน',
  recipientName: '',
  phone: '',
  line1: '',
  subdistrict: '',
  district: '',
  province: '',
  postalCode: '',
};

const LABEL_PRESETS = ['บ้าน', 'ที่ทำงาน', 'หอพัก'];

function validate(values: AddressInput): Errors {
  const errors: Errors = {};
  if (!values.label.trim()) errors.label = 'กรุณาตั้งชื่อที่อยู่';
  if (!values.recipientName.trim()) errors.recipientName = 'กรุณากรอกชื่อผู้รับ';
  if (!/^0\d{8,9}$/.test(values.phone.replace(/[\s-]/g, '')))
    errors.phone = 'เบอร์โทรต้องขึ้นต้นด้วย 0 และมี 9–10 หลัก';
  if (!values.line1.trim()) errors.line1 = 'กรุณากรอกบ้านเลขที่ / ถนน';
  if (!values.subdistrict.trim()) errors.subdistrict = 'กรุณากรอกแขวง/ตำบล';
  if (!values.district.trim()) errors.district = 'กรุณากรอกเขต/อำเภอ';
  if (!values.province) errors.province = 'กรุณาเลือกจังหวัด';
  if (!/^\d{5}$/.test(values.postalCode)) errors.postalCode = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก';
  return errors;
}

export default function AddressForm({ initial, submitLabel = 'บันทึกที่อยู่', onSubmit, onCancel }: AddressFormProps) {
  const [values, setValues] = useState<AddressInput>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof AddressInput>(key: K, value: AddressInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // ไม่ใช้ <form> เพื่อให้วางในฟอร์มอื่นได้ จึงจัดการ submit (ปุ่ม/Enter) เอง
  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit({
      ...values,
      label: values.label.trim(),
      recipientName: values.recipientName.trim(),
      phone: values.phone.replace(/[\s-]/g, ''),
      line1: values.line1.trim(),
      subdistrict: values.subdistrict.trim(),
      district: values.district.trim(),
    });
  };

  const field = (
    key: keyof AddressInput,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <label className="form-control w-full">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        className={`input w-full ${errors[key] ? 'input-error' : ''}`}
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit(e);
        }}
        {...props}
      />
      {errors[key] && <span className="mt-1 block text-xs text-error">{errors[key]}</span>}
    </label>
  );

  return (
    <div className="flex flex-col gap-3">
      <div>
        <span className="mb-1 block text-sm font-medium">ชื่อที่อยู่</span>
        <div className="flex flex-wrap gap-2">
          {LABEL_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={`btn btn-sm ${values.label === preset ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => set('label', preset)}
            >
              {preset}
            </button>
          ))}
          <input
            className={`input input-sm w-32 ${errors.label ? 'input-error' : ''}`}
            placeholder="อื่น ๆ"
            value={LABEL_PRESETS.includes(values.label) ? '' : values.label}
            onChange={(e) => set('label', e.target.value)}
            aria-label="ชื่อที่อยู่อื่น ๆ"
          />
        </div>
        {errors.label && <span className="mt-1 block text-xs text-error">{errors.label}</span>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {field('recipientName', 'ชื่อ-นามสกุลผู้รับ', { autoComplete: 'name' })}
        {field('phone', 'เบอร์โทรศัพท์', { inputMode: 'tel', autoComplete: 'tel', placeholder: '0812345678' })}
      </div>
      {field('line1', 'บ้านเลขที่ / หมู่บ้าน / ถนน', { autoComplete: 'address-line1' })}
      <div className="grid gap-3 sm:grid-cols-2">
        {field('subdistrict', 'แขวง / ตำบล')}
        {field('district', 'เขต / อำเภอ')}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="w-full">
          <span className="mb-1 block text-sm font-medium">จังหวัด</span>
          <select
            className={`select w-full ${errors.province ? 'select-error' : ''}`}
            value={values.province}
            onChange={(e) => set('province', e.target.value)}
          >
            <option value="" disabled>
              เลือกจังหวัด
            </option>
            {THAI_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.province && <span className="mt-1 block text-xs text-error">{errors.province}</span>}
        </label>
        {field('postalCode', 'รหัสไปรษณีย์', {
          inputMode: 'numeric',
          maxLength: 5,
          autoComplete: 'postal-code',
        })}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            ยกเลิก
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={() => handleSubmit()}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
