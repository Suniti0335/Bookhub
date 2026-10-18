interface QuantityInputProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

export default function QuantityInput({ value, max, min = 1, onChange, size = 'md' }: QuantityInputProps) {
  const btn = size === 'sm' ? 'btn btn-sm btn-square' : 'btn btn-square';
  const input = size === 'sm' ? 'input input-sm' : 'input';

  const commit = (raw: number) => {
    if (Number.isNaN(raw)) return;
    onChange(Math.min(max, Math.max(min, Math.floor(raw))));
  };

  return (
    <div className="join">
      <button
        type="button"
        className={`${btn} join-item`}
        onClick={() => commit(value - 1)}
        disabled={value <= min}
        aria-label="ลดจำนวน"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        className={`${input} join-item w-14 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
        value={value}
        min={min}
        max={max}
        onChange={(e) => commit(e.target.valueAsNumber)}
        aria-label="จำนวน"
      />
      <button
        type="button"
        className={`${btn} join-item`}
        onClick={() => commit(value + 1)}
        disabled={value >= max}
        aria-label="เพิ่มจำนวน"
      >
        +
      </button>
    </div>
  );
}
