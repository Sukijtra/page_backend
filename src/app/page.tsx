'use client'

import { DollarSign } from "lucide-react";
import { PackageCheck, TrendingUp, Layers, X } from "lucide-react";
import { useState } from "react";

import {
  LayoutDashboard,
  Gem,
  ShoppingCart,
  FileText,
  Users,
  Star,
  Settings,
  LogOut,
  User,
  Bell,
  Plus,
  ArrowUpRight,
  Eye
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { Sidebar } from '../../components/sidebar';


// --- Types (Adapted from your ProductManagement.tsx) ---
type Product = {
  id: number;
  name: string;
  category: string;
  material: string;
  karat: string;
  price: number;
  stock: number;
  status: boolean;
  image: string;
};


// --- Types & Interfaces ---
// ใน Next.js จริง ส่วนนี้อาจจะแยกเป็น file types.ts
interface MenuItem {
  label: string;
  icon: any;
  href: string;
}

const toggleProductStatus = (id: number) => {
  console.log('toggle', id);
};

const deleteProduct = (id: number) => {
  console.log('delete', id);
};

const StatusSwitch = ({ status, onToggle }: any) => (
  <button
    onClick={onToggle}
    className={`px-3 py-1 text-xs rounded-full ${status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      }`}
  >
    {status ? 'เปิดขาย' : 'ปิดขาย'}
  </button>
);


const trendTableData = [
  { month: 'ม.ค.', sales: 400000, orders: 32 },
  { month: 'ก.พ.', sales: 300000, orders: 28 },
  { month: 'มี.ค.', sales: 500000, orders: 40 },
  { month: 'เม.ย.', sales: 450000, orders: 36 },
  { month: 'พ.ค.', sales: 700000, orders: 55 },
  { month: 'มิ.ย.', sales: 650000, orders: 48 },
];


// --- Mock Data ---
const salesData = [
  { name: 'ม.ค.', total: 400000 },
  { name: 'ก.พ.', total: 300000 },
  { name: 'มี.ค.', total: 500000 },
  { name: 'เม.ย.', total: 450000 },
  { name: 'พ.ค.', total: 700000 },
  { name: 'มิ.ย.', total: 650000 },
];

const categoryData = [
  { name: 'เพชร', value: 35, color: '#1f2937' },
  { name: 'แหวนเพชร', value: 25, color: '#4b5563' },
  { name: 'ต่างหู', value: 18, color: '#9ca3af' },
  { name: 'สร้อยคอ', value: 12, color: '#d1d5db' },
  { name: 'กำไล', value: 10, color: '#e5e7eb' },
];

const topProducts = [
  { rank: 1, name: 'แหวนเพชรเม็ดเดี่ยว 1 กะรัต', category: 'แหวน', sold: 25, image: '💍' },
  { rank: 2, name: 'สร้อยคอทองคำขาว 18k', category: 'สร้อยคอ', sold: 20, image: '📿' },
  { rank: 3, name: 'ต่างหูเพชรล้อม', category: 'ต่างหู', sold: 18, image: '💎' },
  { rank: 4, name: 'สร้อยข้อมือทองชมพู', category: 'สร้อยข้อมือ', sold: 15, image: '⛓️' },
  { rank: 5, name: 'จี้เพชรหยดน้ำ', category: 'จี้', sold: 12, image: '💧' },
];

const stockAlerts = [
  { id: 1, name: 'แหวนเพชรเม็ดเดี่ยว เหลือในสต็อก 2 ชิ้น', time: '1 ชั่วโมงที่แล้ว', image: '💍', urgent: true },
  { id: 2, name: 'สร้อยคอทองคำ 18k หมดสต็อก', time: '3 ชั่วโมงที่แล้ว', image: '📿', urgent: true },
  { id: 3, name: 'ต่างหูเพชรล้อม เหลือในสต็อก 3 ชิ้น', time: '5 ชั่วโมงที่แล้ว', image: '💎', urgent: true },
];

// --- Components ---

// 2. Stat Card Component
const StatCard = ({ title, value, growth, trend, icon: Icon, colorClass }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-xl font-bold text-gray-800">{value}</div>
      </div>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1
        ${trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : null}
        {growth}
      </span>
      <span className="text-xs text-gray-400">จากเดือนที่แล้ว</span>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors flex-1 sm:flex-none justify-center
        ${active
        ? 'border-gray-900 text-gray-900'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

// 3. Dashboard Page Content
// นี่คือโค้ดที่จะอยู่ใน app/dashboard/page.tsx
const DashboardContent = () => {

  type OrderForm = {
    customerName: string;
    totalPrice: number;
    note: string;
  };

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null);

  const [orderForm, setOrderForm] = useState<OrderForm>({
    customerName: '',
    totalPrice: 0,
    note: '',
  });

  const handleOpenAddOrder = () => {
    // เพิ่มคำสั่งซื้อ = ไม่ได้แก้ของเดิม
    setEditingOrderId(null);

    // reset form
    setOrderForm({
      customerName: '',
      totalPrice: 0,
      note: '',
    });

    // เปิด modal
    setIsOrderModalOpen(true);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">แดชบอร์ด</h2>
          <p className="text-gray-500 text-sm mt-1">ภาพรวมข้อมูลสำคัญของร้าน</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button
            onClick={handleOpenAddOrder}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
          >
            <Plus className="w-4 h-4" />
            เพิ่มคำสั่งซื้อ

          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard
          title="ยอดขายรวม (ชิ้น)"
          value="245"
          growth="+20%"
          trend="up"
          icon={DollarSign}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="ลูกค้า (คน)"
          value="฿2,850,000"
          growth="+15%"
          trend="up"
          icon={User}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title="คำสั่งซื้อ (ชิ้น)"
          value="48"
          growth="+8%"
          trend="up"
          icon={ShoppingCart}
          colorClass="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="จัดส่ง (ชิ้น)"
          value="1,220"
          growth="+10%"
          trend="up"
          icon={PackageCheck}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gray-100 rounded-md"><TrendingUp className="w-4 h-4 text-gray-600" /></div>
              <h3 className="font-semibold text-gray-800">ยอดขายรายเดือน</h3>
            </div>
            <div className="flex gap-1 bg-gray-50 p-1 rounded-lg">
              {['รายวัน', 'รายสัปดาห์', 'รายเดือน', '5 เดือน'].map((filter, idx) => (
                <button key={idx} className={`text-xs px-3 py-1.5 rounded-md transition-all ${filter === 'รายเดือน' ? 'bg-white shadow-sm text-gray-800 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="total" fill="#374151" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-gray-100 rounded-md"><Layers className="w-4 h-4 text-gray-600" /></div>
            <h3 className="font-semibold text-gray-800">สัดส่วนสินค้าแต่ละหมวด</h3>
          </div>
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>


            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-gray-800">35% </span>
              <span className="text-xs text-gray-500">เพชร</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Table Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4"> จำนวนคำสั่งซื้อ</h3>
        {/* Line Chart */}
        <div className="h-[350px] mb-4">
          <ResponsiveContainer width="60%" height="60%">
            <LineChart data={trendTableData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#111827"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Top Products Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-5">
          <div className="p-1.5 bg-orange-100 rounded-md">
            <Star className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-800">
            สินค้าขายดี Top 5
          </h3>
        </div>

        <table className="w-full table-fixed">
          <thead>
            <tr className="text-sm text-gray-600">
              <th className="w-[80px] px-4 py-2 text-center">อันดับ</th>
              <th className="px-4 py-2 text-left">สินค้า</th>
              <th className="w-[160px] px-4 py-2 text-center">หมวดหมู่</th>
            </tr>
          </thead>

          <tbody>
            {topProducts.map((product) => (
              <tr key={product.rank} className="hover:bg-gray-50 transition-colors">

                {/* Rank */}
                <td className="w-[70px] px-4 py-2">
                  <div className="mx-auto w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white text-[11px] font-bold">
                    {product.rank}
                  </div>
                </td>

                {/* Product */}
                <td className="px-6 py-3 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-base border shrink-0">
                      {product.image}
                    </div>
                    <span className="font-medium text-gray-800 text-sm truncate max-w-[220px]">
                      {product.name}
                    </span>
                  </div>
                </td>


                {/* Category */}
                <td className="w-[140px] px-4 py-2 text-gray-700 text-sm">
                  {product.category}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          title={editingOrderId ? 'แก้ไขคำสั่งซื้อ' : 'เพิ่มคำสั่งซื้อ'}
          footer={
            <>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                onClick={() => {
                  console.log('SAVE ORDER', orderForm);
                  setIsOrderModalOpen(false);
                }}
              >
                บันทึก
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">ชื่อลูกค้า</label>
              <input
                value={orderForm.customerName}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, customerName: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="ชื่อลูกค้า"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">ราคารวม</label>
              <input
                type="number"
                value={orderForm.totalPrice}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, totalPrice: Number(e.target.value) })
                }
                className="w-full border rounded-lg px-3 py-2 mt-1"
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">หมายเหตุ</label>
              <textarea
                value={orderForm.note}
                onChange={(e) =>
                  setOrderForm({ ...orderForm, note: e.target.value })
                }
                rows={3}
                className="w-full border rounded-lg px-3 py-2 mt-1"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

// 4. Main Layout (Simulating app/layout.tsx + app/dashboard/page.tsx)
export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900 flex">
      {/* Fixed Sidebar with Real Links */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        {/* Render only Dashboard content directly */}
        <DashboardContent />
      </main>
    </div>
  );
}