export type Role = 'ADMIN' | 'CASHIER' | 'KITCHEN_STAFF' | 'CUSTOMER';

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  email?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  displayOrder: number;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  categoryName: string;
  name: string;
  description?: string;
  price: number;
  isVeg: boolean;
  veg?: boolean;
  imageUrl?: string;
  isAvailable: boolean;
  available?: boolean;
}

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'OUT_OF_SERVICE';

export interface RestaurantTable {
  id: number;
  tableNumber: string;
  seatingCapacity: number;
  section: string;
  status: TableStatus;
}

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
}

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
export type OrderStatus = 'CREATED' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id?: number;
  menuItemId: number;
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  notes?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderType: OrderType;
  tableId?: number;
  tableNumber?: string;
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  notes?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  createdBy?: string;
  createdAt: string;
  items: OrderItem[];
}

export type DiscountType = 'NONE' | 'PERCENTAGE' | 'FIXED';
export type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'OTHER';

export interface BillItem {
  id: number;
  menuItemId: number;
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  taxRate: number;
}

export interface Bill {
  id: number;
  billNumber: string;
  orderId: number;
  orderNumber: string;
  orderType: string;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  cashierName?: string;
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  taxableAmount: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  totalTax: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  items: BillItem[];
}

export interface Payment {
  id: number;
  billId: number;
  paymentNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: string;
  processedBy?: string;
  createdAt: string;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
  currentStock: number;
  minThreshold: number;
  unitCost: number;
  supplier?: string;
  lowStock: boolean;
}

export interface InventoryMovement {
  id: number;
  ingredientId: number;
  ingredientName: string;
  movementType: 'INWARD_PURCHASE' | 'OUTWARD_CONSUMPTION' | 'ADJUSTMENT_WASTAGE' | 'ADJUSTMENT_RETURN';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string;
  createdAt: string;
}

export interface TopSellingItem {
  itemName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface PaymentMethodReport {
  method: PaymentMethod;
  count: number;
  totalAmount: number;
}

export interface DashboardSummary {
  todaySales: number;
  todayOrderCount: number;
  totalBillsGenerated: number;
  averageOrderValue: number;
  pendingOrders: number;
  lowStockCount: number;
  topSellingItems: TopSellingItem[];
  recentOrders: Order[];
  paymentMethods: PaymentMethodReport[];
}

export interface SalesReportItem {
  dateLabel: string;
  grossSales: number;
  discountAmount: number;
  taxAmount: number;
  netSales: number;
  orderCount: number;
}

export interface RestaurantSetting {
  key: string;
  value: string;
  description?: string;
}
