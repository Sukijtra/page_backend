'use client'
import React, { useState } from 'react';
import { Eye, Plus, Edit3, Trash2 } from 'lucide-react';
import { 
  LayoutDashboard, 
  Gem, 
  ShoppingCart, 
  FileText, 
  Box,
  User,
  Users, 
  Star, 
  Settings, 
  LogOut, 
  Search,  
  Ban, 
  CheckCircle,
  Layers,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  X,
  History,
  FileSearch, // For Appraisal icon
} from 'lucide-react';
import { Sidebar } from '../../../components/sidebar';

// --- Types ---
type OrderHistory = {
  orderId: string;
  date: string;
  total: number;
  status: string;
  productImage: string;
};

type AppraisalHistory = {
  id: string;
  date: string;
  productImage: string;
  jewelryType: string;
  diamondShape: string;
  caratWeight: number;
  estimatedPrice: number;
};

type Customer = {
  id: number;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "banned";
  orderHistory: OrderHistory[];
  appraisalHistory: AppraisalHistory[];
};

// --- Mock Data ---
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "คุณสมหญิง จันทร์เจ้า",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    email: "somying.j@example.com",
    phone: "081-234-5678",
    address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    joinDate: "2023-01-15",
    totalOrders: 5,
    totalSpent: 450000,
    status: "active",
    orderHistory: [
      { orderId: "10234", date: "2025-10-01", total: 150000, status: "pending_payment", productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150" },
      { orderId: "10112", date: "2025-08-15", total: 85000, status: "shipped", productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150" },
    ],
    appraisalHistory: [
        { id: "APP-001", date: "2024-12-10", productImage: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=150", jewelryType: "แหวน", diamondShape: "Round", caratWeight: 1.2, estimatedPrice: 120000 }
    ]
  },
  {
    id: 2,
    name: "คุณมานี ใจดี",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    email: "manee.j@example.com",
    phone: "082-345-6789",
    address: "456 ถนนพระราม 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330",
    joinDate: "2023-03-10",
    totalOrders: 3,
    totalSpent: 120000,
    status: "active",
    orderHistory: [
      { orderId: "10233", date: "2025-10-01", total: 80000, status: "in_production", productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150" },
    ],
    appraisalHistory: []
  },
  {
    id: 3,
    name: "คุณสมชาย รักดี",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    email: "somchai.r@example.com",
    phone: "083-456-7890",
    address: "789 หมู่บ้านเสรีภาพ ถ.พหลโยธิน กรุงเทพฯ",
    joinDate: "2024-05-20",
    totalOrders: 0,
    totalSpent: 0,
    status: "banned",
    orderHistory: [],
    appraisalHistory: []
  }
];

// --- Shared Components ---


const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto bg-[#FAFAFA]">
          {children}
        </div>
      </div>
    </div>
  );
};

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
    </div>
  </div>
);
// --- Customer Management Component ---

const CustomerManagement = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState<'orders' | 'appraisal'>('orders');

  const filteredCustomers = customers.filter(c => 
    c.name.includes(searchTerm) || 
    c.phone.includes(searchTerm) ||
    c.email.includes(searchTerm)
  );

  const handleToggleStatus = (id: number) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'banned' : 'active' } : c
    ));
    if (selectedCustomer?.id === id) {
        setSelectedCustomer(prev => prev ? { ...prev, status: prev.status === 'active' ? 'banned' : 'active' } : null);
    }
  };
  const deleteCustomer = (id: number) => {
  if (!window.confirm('คุณต้องการลบลูกค้ารายนี้ใช่หรือไม่?')) return;

  setCustomers(prev => prev.filter(c => c.id !== id));

  // ถ้าลูกค้าที่ถูกลบกำลังถูกเปิดดูอยู่ → ปิด modal
  if (selectedCustomer?.id === id) {
    setSelectedCustomer(null);
  }
};

  

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">จัดการลูกค้า</h2>
          <p className="text-gray-500 text-sm mt-1">รายชื่อและประวัติการซื้อขายของลูกค้าทั้งหมด</p>
        </div>
      </div>

    {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard 
          title="ยอดซื้อสะสมทั้งหมด (บาท)" 
          value="฿2,850" 
          growth="+15%" 
          trend="up" 
          icon={DollarSign}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="สมาชิกทั้งหมด (คน)" 
          value="3" 
          growth="+15%" 
          trend="up" 
          icon={Users}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="บัญชีถูกระงับ (คน)" 
          value="1" 
          growth="+15%" 
          trend="up" 
          icon={User}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="คำสั่งซื้อทั้งหมด (ชิ้น)" 
          value="1" 
          growth="+15%" 
          trend="up" 
          icon={Box}
          colorClass="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อ, เบอร์โทร, หรืออีเมล..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 text-sm"
            />
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">ลูกค้า</th>
              <th className="px-6 py-4">ติดต่อ</th>
              <th className="px-6 py-4 text-center">ยอดซื้อสะสม</th>
              <th className="px-6 py-4 text-center">เป็นสมาชิกเมื่อ</th>
              <th className="px-6 py-4 text-center">สถานะ</th>
              <th className="px-6 py-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-400">ID: #{customer.id.toString().padStart(4, '0')}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone className="w-3 h-3" /> {customer.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail className="w-3 h-3" /> {customer.email}
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <div className="inline-block text-left">
                        <p className="font-medium text-gray-900">฿{customer.totalSpent.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{customer.totalOrders} คำสั่งซื้อ</p>
                    </div>
                </td>
                <td className="px-6 py-4 text-center text-gray-500">
                    {new Date(customer.joinDate).toLocaleDateString('th-TH')}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                    ${customer.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {customer.status === 'active' ? 'ปกติ' : 'ถูกระงับ'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all" title="ดูรายละเอียด">
                        <Eye className="w-4 h-4" />
                        </button>

                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="แก้ไข">
                        <Edit3 className="w-4 h-4" />
                        </button>

                         <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"title="ลบ">
                        <Trash2 className="w-4 h-4" />
                      </button>



                    <button 
                        onClick={() => handleToggleStatus(customer.id)}
                        className={`p-2 rounded-lg transition-all ${customer.status === 'active' ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`} 
                        title={customer.status === 'active' ? "ระงับบัญชี" : "ปลดระงับ"}
                    >
                        {customer.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Detail Modal */}
      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        title="โปรไฟล์ลูกค้า"
      >
        {selectedCustomer && (
            <div className="space-y-6">
                
                {/* 1. Top Section: Profile & Stats */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
                    {/* Profile Info */}
                    <div className="flex-1 flex gap-5">
                        <img src={selectedCustomer.avatar} className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-sm" />
                        <div className="space-y-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    {selectedCustomer.name}
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${selectedCustomer.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        {selectedCustomer.status === 'active' ? 'Active' : 'Banned'}
                                    </span>
                                </h3>
                                <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
                                    <Calendar className="w-3.5 h-3.5" /> สมาชิกตั้งแต่: {new Date(selectedCustomer.joinDate).toLocaleDateString('th-TH')}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><Phone className="w-3.5 h-3.5" /> {selectedCustomer.phone}</span>
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded"><Mail className="w-3.5 h-3.5" /> {selectedCustomer.email}</span>
                            </div>
                            <div className="text-sm text-gray-600 flex items-start gap-1.5">
                                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                {selectedCustomer.address}
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="flex gap-4">
                        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex-1 min-w-[140px] text-center">
                             <div className="w-8 h-8 mx-auto bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-2">
                                <ShoppingBag className="w-4 h-4" />
                             </div>
                             <p className="text-xs text-gray-500 mb-1">คำสั่งซื้อทั้งหมด</p>
                             <p className="text-xl font-bold text-gray-900">{selectedCustomer.totalOrders}</p>
                        </div>
                        <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex-1 min-w-[140px] text-center">
                             <div className="w-8 h-8 mx-auto bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-2">
                                <DollarSign className="w-4 h-4" />
                             </div>
                             <p className="text-xs text-gray-500 mb-1">ยอดซื้อรวม</p>
                             <p className="text-xl font-bold text-gray-900">฿{selectedCustomer.totalSpent.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* 2. History Section (Tabs) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[300px]">
                    <div className="flex border-b border-gray-100">
                        <button 
                            onClick={() => setActiveHistoryTab('orders')}
                            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
                                ${activeHistoryTab === 'orders' ? 'border-gray-900 text-gray-900 bg-gray-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                        >
                            <History className="w-4 h-4" /> ประวัติการสั่งซื้อ
                        </button>
                        <button 
                             onClick={() => setActiveHistoryTab('appraisal')}
                             className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors
                                ${activeHistoryTab === 'appraisal' ? 'border-gray-900 text-gray-900 bg-gray-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
                        >
                            <FileSearch className="w-4 h-4" /> ประวัติการประเมินราคา
                        </button>
                    </div>

                    <div className="p-6">
                        {activeHistoryTab === 'orders' && (
                            selectedCustomer.orderHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedCustomer.orderHistory.map((order) => (
                                        <div key={order.orderId} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all bg-white">
                                            <img src={order.productImage} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className="font-medium text-gray-900">คำสั่งซื้อ #{order.orderId}</h4>
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">{order.status}</span>
                                                </div>
                                                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('th-TH', { dateStyle: 'long' })}</p>
                                            </div>
                                            <div className="text-right pl-4 border-l border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1">ยอดรวม</p>
                                                <p className="font-bold text-gray-900">฿{order.total.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p>ยังไม่มีประวัติการสั่งซื้อ</p>
                                </div>
                            )
                        )}

                        {activeHistoryTab === 'appraisal' && (
                            selectedCustomer.appraisalHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedCustomer.appraisalHistory.map((appraisal) => (
                                        <div key={appraisal.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm hover:border-gray-200 transition-all bg-white">
                                            <img src={appraisal.productImage} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <h4 className="font-medium text-gray-900">{appraisal.jewelryType} ({appraisal.diamondShape})</h4>
                                                    <span className="text-xs text-gray-500">ID: {appraisal.id}</span>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    น้ำหนัก: {appraisal.caratWeight} กะรัต • วันที่: {new Date(appraisal.date).toLocaleDateString('th-TH')}
                                                </p>
                                            </div>
                                            <div className="text-right pl-4 border-l border-gray-100">
                                                <p className="text-xs text-gray-400 mb-1">ราคาประเมิน</p>
                                                <p className="font-bold text-blue-600">฿{appraisal.estimatedPrice.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400">
                                    <FileSearch className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    <p>ยังไม่มีประวัติการประเมินราคา</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

            </div>
        )}
      </Modal>

    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900 flex">
      <Sidebar/>
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <CustomerManagement />
      </main>
    </div>
  );
}