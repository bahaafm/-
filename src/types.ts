export interface Market {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Category {
  id: string;
  marketId: string;
  name: string;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface SizeStock {
  size: string;
  quantity: number;
}

export interface DiscountOffer {
  type: 'single' | 'quantity';
  amount: number; // percentage (e.g., 20 for 20% off) or absolute discount
  minQuantity?: number; // for quantity discount
  durationDays: number;
  startDate: string;
  expiryDate: string;
  description: string;
}

export interface Product {
  id: string;
  merchantId: string;
  marketId: string;
  categoryId: string;
  subcategoryId: string;
  name: string;
  type: string; // e.g., "أحذية رجالية", "هواتف ذكية"
  description: string;
  sizes: SizeStock[];
  price: number;
  discount: DiscountOffer | null;
  imageUrl?: string;
}

export interface Merchant {
  id: string;
  fullName: string;
  storeName: string;
  phone: string;
  password: string;
  status: 'pending' | 'approved' | 'banned';
  subscriptionStatus: 'active' | 'suspended' | 'expired';
  subscriptionExpiry: string; // ISO date string
  documents: string[]; // Mock document file names or data-urls
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  password: string;
  createdAt: string;
}
