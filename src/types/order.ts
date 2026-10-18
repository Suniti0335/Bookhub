import type { Book } from './book';

/** ที่อยู่จัดส่งที่ผู้ใช้บันทึกไว้ (Client State — เก็บใน Zustand) */
export interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export type AddressInput = Omit<Address, 'id'>;

export type ShippingMethodId = 'standard' | 'express';
export type PaymentMethodId = 'card' | 'promptpay' | 'cod';

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  description: string;
  fee: number;
}

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  description: string;
}

/** รายการในคำสั่งซื้อ: เก็บ snapshot ชื่อ/ราคา ณ เวลาสั่งซื้อ */
export interface OrderItem {
  bookId: Book['id'];
  title: string;
  coverUrl: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  address: AddressInput;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethodId;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'paid' | 'pending_payment';
}

export type NewOrder = Omit<Order, 'id'>;
