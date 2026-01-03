import { Request, Bid } from '../types';

// Mock Requests
export const mockRequests: Request[] = [
  {
    id: 1,
    title: 'طلب مواد بناء لمشروع سكني',
    description: 'نحتاج إلى توريد مواد بناء متنوعة لمشروع سكني في حي النرجس',
    items: [
      { id: 1, name: 'أسمنت', quantity: 100, unit: 'كيس' },
      { id: 2, name: 'حديد تسليح', quantity: 5, unit: 'طن' },
      { id: 3, name: 'رمل', quantity: 20, unit: 'متر مكعب' },
    ],
    deadline: '2024-02-15',
    createdAt: '2024-01-20',
    status: 'open',
    bidsCount: 3,
    contractorId: 1,
    contractorName: 'أحمد محمد',
    contractorCompany: 'شركة البناء المتقدم',
  },
  {
    id: 2,
    title: 'توريد مواد كهربائية',
    description: 'مطلوب توريد مواد كهربائية لمشروع تجاري',
    items: [
      { id: 1, name: 'كابلات كهربائية', quantity: 500, unit: 'متر' },
      { id: 2, name: 'لوحات كهربائية', quantity: 10, unit: 'قطعة' },
      { id: 3, name: 'مفاتيح كهربائية', quantity: 50, unit: 'قطعة' },
    ],
    deadline: '2024-02-20',
    createdAt: '2024-01-22',
    status: 'open',
    bidsCount: 5,
    contractorId: 1,
    contractorName: 'أحمد محمد',
    contractorCompany: 'شركة البناء المتقدم',
  },
  {
    id: 3,
    title: 'مواد سباكة وصحية',
    description: 'توريد مواد سباكة لمجمع سكني',
    items: [
      { id: 1, name: 'مواسير PVC', quantity: 200, unit: 'متر' },
      { id: 2, name: 'أحواض حمامات', quantity: 15, unit: 'قطعة' },
      { id: 3, name: 'صنابير مياه', quantity: 30, unit: 'قطعة' },
    ],
    deadline: '2024-02-10',
    createdAt: '2024-01-18',
    status: 'closed',
    bidsCount: 2,
    contractorId: 1,
    contractorName: 'أحمد محمد',
    contractorCompany: 'شركة البناء المتقدم',
  },
];

// Mock Bids
export const mockBids: Bid[] = [
  {
    id: 1,
    requestId: 1,
    supplierId: 1,
    supplierName: 'فاطمة علي',
    supplierCompany: 'شركة مواد البناء الذهبية',
    totalPrice: 50000,
    status: 'pending',
    createdAt: '2024-01-21',
  },
  {
    id: 2,
    requestId: 1,
    supplierId: 2,
    supplierName: 'محمد عبدالله',
    supplierCompany: 'شركة التوريدات الحديثة',
    totalPrice: 48000,
    status: 'pending',
    createdAt: '2024-01-22',
  },
  {
    id: 3,
    requestId: 2,
    supplierId: 1,
    supplierName: 'فاطمة علي',
    supplierCompany: 'شركة مواد البناء الذهبية',
    totalPrice: 35000,
    status: 'accepted',
    createdAt: '2024-01-23',
  },
];
