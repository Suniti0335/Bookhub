export interface CardValues {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export type CardErrors = Partial<Record<keyof CardValues, string>>;

export const EMPTY_CARD: CardValues = { number: '', name: '', expiry: '', cvv: '' };

/** ตรวจเลขบัตรด้วย Luhn algorithm */
function passesLuhn(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

export function validateCard(card: CardValues, now = new Date()): CardErrors {
  const errors: CardErrors = {};
  const digits = card.number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19 || !passesLuhn(digits)) errors.number = 'เลขบัตรไม่ถูกต้อง';
  if (!card.name.trim()) errors.name = 'กรุณากรอกชื่อบนบัตร';

  const match = /^(\d{2})\/(\d{2})$/.exec(card.expiry);
  if (!match) {
    errors.expiry = 'รูปแบบ MM/YY';
  } else {
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    // บัตรใช้ได้ถึงสิ้นเดือนที่ระบุ
    const endOfExpiryMonth = new Date(year, month, 1);
    if (month < 1 || month > 12) errors.expiry = 'เดือนไม่ถูกต้อง';
    else if (endOfExpiryMonth <= now) errors.expiry = 'บัตรหมดอายุแล้ว';
  }

  if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = 'CVV 3–4 หลัก';
  return errors;
}

const formatCardNumber = (raw: string): string =>
  raw.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');

const formatExpiry = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

interface CardFormProps {
  values: CardValues;
  errors: CardErrors;
  onChange: (values: CardValues) => void;
}

export default function CardForm({ values, errors, onChange }: CardFormProps) {
  const set = (key: keyof CardValues, value: string) => onChange({ ...values, [key]: value });

  const errorText = (key: keyof CardValues) =>
    errors[key] && <span className="mt-1 block text-xs text-error">{errors[key]}</span>;

  return (
    <div className="flex flex-col gap-3">
      <label>
        <span className="mb-1 block text-sm font-medium">หมายเลขบัตร</span>
        <input
          className={`input w-full font-mono ${errors.number ? 'input-error' : ''}`}
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          value={values.number}
          onChange={(e) => set('number', formatCardNumber(e.target.value))}
        />
        {errorText('number')}
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium">ชื่อบนบัตร</span>
        <input
          className={`input w-full ${errors.name ? 'input-error' : ''}`}
          autoComplete="cc-name"
          value={values.name}
          onChange={(e) => set('name', e.target.value.toUpperCase())}
        />
        {errorText('name')}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1 block text-sm font-medium">วันหมดอายุ</span>
          <input
            className={`input w-full font-mono ${errors.expiry ? 'input-error' : ''}`}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={values.expiry}
            onChange={(e) => set('expiry', formatExpiry(e.target.value))}
          />
          {errorText('expiry')}
        </label>
        <label>
          <span className="mb-1 block text-sm font-medium">CVV</span>
          <input
            className={`input w-full font-mono ${errors.cvv ? 'input-error' : ''}`}
            inputMode="numeric"
            autoComplete="cc-csc"
            type="password"
            maxLength={4}
            value={values.cvv}
            onChange={(e) => set('cvv', e.target.value.replace(/\D/g, ''))}
          />
          {errorText('cvv')}
        </label>
      </div>
      <p className="text-xs opacity-60">
        * ระบบจำลองการชำระเงิน ไม่มีการตัดเงินจริงและไม่บันทึกข้อมูลบัตร ทดสอบด้วยเลข 4242 4242 4242 4242
      </p>
    </div>
  );
}
