import type { AddressInput, PaymentMethod, ShippingMethod, ShippingMethodId } from '@/types/order';

export const formatAddress = (a: AddressInput): string =>
  `${a.line1} ${a.subdistrict} ${a.district} ${a.province} ${a.postalCode}`;

/** ซื้อครบยอดนี้ ส่งแบบธรรมดาฟรี */
export const FREE_SHIPPING_THRESHOLD = 1000;

export const SHIPPING_METHODS: ShippingMethod[] = [
  { id: 'standard', label: 'ส่งแบบธรรมดา', description: '3–5 วันทำการ', fee: 50 },
  { id: 'express', label: 'ส่งด่วน', description: '1–2 วันทำการ', fee: 120 },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'บัตรเครดิต / เดบิต', description: 'Visa, Mastercard, JCB' },
  { id: 'promptpay', label: 'พร้อมเพย์', description: 'สแกน QR ผ่านแอปธนาคาร' },
  { id: 'cod', label: 'เก็บเงินปลายทาง', description: 'ชำระเงินสดเมื่อได้รับสินค้า' },
];

export function getShippingFee(methodId: ShippingMethodId, subtotal: number): number {
  if (subtotal <= 0) return 0;
  const method = SHIPPING_METHODS.find((m) => m.id === methodId);
  if (!method) return 0;
  if (method.id === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return method.fee;
}

export const THAI_PROVINCES = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 'ขอนแก่น', 'จันทบุรี',
  'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 'ตราด',
  'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี',
  'นราธิวาส', 'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 'ปราจีนบุรี', 'ปัตตานี',
  'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์',
  'แพร่', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง',
  'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล',
  'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 'สิงห์บุรี', 'สุโขทัย',
  'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ',
  'อุดรธานี', 'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี',
] as const;
