'use client'

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Gem, 
  ShoppingCart, 
  FileText, 
  Layers,
  Users, 
  Star, 
  Settings, 
  LogOut, 
  PackageCheck,
  DollarSign,
  Search, 
  Filter, 
  Eye, 
  Plus, 
  Trash2, 
  Edit3, 
  MoreHorizontal, 
  Calendar, 
  Package, 
  Receipt, 
  CheckCircle, 
  Truck, 
  Clock, 
  X,
  ChevronDown,
  CreditCard,
  MapPin,
  Phone
} from 'lucide-react';
import { Sidebar } from '../../../components/sidebar';

// --- Types ---
type OrderStatus = "pending_payment" | "pending_production" | "in_production" | "ready_to_ship" | "shipped" | "cancelled";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  customSize?: string;
  image: string;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerAvatar: string;
  date: string;
  deliveryDate?: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  paymentMethod: string;
  paymentSlip?: string;
  trackingNumber?: string;
  shippingMethod?: string;
};

// --- Mock Data ---
const mockOrders: Order[] = [
  {
    id: "10234",
    customerName: "คุณสมหญิง จันทร์เจ้า",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    customerPhone: "081-234-5678",
    customerAddress: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
    date: "2025-10-01",
    deliveryDate: "2025-10-08",
    status: "pending_payment",
    total: 150000,
    items: [{ 
      name: "แหวนเพชรเม็ดเดี่ยว 1 กะรัต", 
      quantity: 1, 
      price: 150000, 
      customSize: "56",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop"
    }],
    paymentMethod: "โอนเงิน",
    paymentSlip: "https://images.unsplash.com/photo-1554224311-94dc27c383f4?w=600&h=800&fit=crop",
  },
  {
    id: "10233",
    customerName: "คุณมานี ใจดี",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    customerPhone: "082-345-6789",
    customerAddress: "456 ถนนพระราม 4 แขวงปทุมวัน เขตปทุมวัน กรุงเทพฯ 10330",
    date: "2025-10-01",
    deliveryDate: "2025-10-10",
    status: "in_production",
    total: 80000,
    items: [
      { 
        name: "สร้อยคอทองคำ 18k", 
        quantity: 1, 
        price: 50000,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
      },
      {
        name: "ต่างหูเพชร",
        quantity: 1,
        price: 30000,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop"
      }
    ],
    paymentMethod: "โอนเงิน",
    paymentSlip: "https://images.unsplash.com/photo-1554224311-94dc27c383f4?w=600&h=800&fit=crop",
  },
  {
    id: "10232",
    customerName: "คุณสมชาย รักดี",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    customerPhone: "083-456-7890",
    customerAddress: "มารับเองที่ร้าน",
    date: "2025-09-30",
    deliveryDate: "2025-10-05",
    status: "ready_to_ship",
    total: 95000,
    items: [{ 
      name: "ต่างหูเพชรล้อม", 
      quantity: 1, 
      price: 95000,
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop"
    }],
    paymentMethod: "เงินสด",
  },
  {
    id: "10231",
    customerName: "คุณวิไล สวยงาม",
    customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    customerPhone: "084-567-8901",
    customerAddress: "789 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพฯ 10400",
    date: "2025-09-29",
    deliveryDate: "2025-10-02",
    status: "shipped",
    total: 65000,
    items: [{ 
      name: "สร้อยข้อมือทองชมพู", 
      quantity: 1, 
      price: 65000,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&fit=crop"
    }],
    paymentMethod: "โอนเงิน",
    trackingNumber: "TH1234567890",
    shippingMethod: "Kerry Express",
    paymentSlip: "https://images.unsplash.com/photo-1554224311-94dc27c383f4?w=600&h=800&fit=crop",
  },
];

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

// --- Config ---
const statusConfig: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  pending_payment: { label: "รอชำระเงิน", color: "bg-orange-50 text-orange-700 border-orange-200", icon: Clock },
  pending_production: { label: "รอจัดทำ", color: "bg-gray-100 text-gray-700 border-gray-200", icon: Package },
  in_production: { label: "กำลังจัดทำ", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Gem },
  ready_to_ship: { label: "รอจัดส่ง", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Box },
  shipped: { label: "จัดส่งแล้ว", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Truck },
  cancelled: { label: "ยกเลิก", color: "bg-red-50 text-red-700 border-red-200", icon: X },
};

function Box(props: any) { return <Package {...props} />; } // Alias for cleaner code

// --- Shared Components ---

// --- Custom Modal Component (Replaces Dialog from UI lib) ---
const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
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

// --- Main Content Component ---

const OrderManagement = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  
  // Tracking Form State
  const [trackingNo, setTrackingNo] = useState("");
  const [courier, setCourier] = useState("");

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || order.customerName.includes(searchTerm);
    const matchesTab = activeTab === "all" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Handlers
  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status } : o));
    setSelectedOrder({ ...selectedOrder, status }); // Update local view
  };

  const handleSaveTracking = () => {
    if (!selectedOrder) return;
    setOrders(orders.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, status: 'shipped', trackingNumber: trackingNo, shippingMethod: courier } 
        : o
    ));
    setIsTrackingOpen(false);
    setIsDetailOpen(false); // Close detail too if wanted
    setTrackingNo("");
    setCourier("");
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">จัดการคำสั่งซื้อ</h2>
          <p className="text-gray-500 text-sm mt-1">ติดตามและจัดการสถานะคำสั่งซื้อทั้งหมด</p>
        </div>
        <div className="flex gap-3">
             <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-600 shadow-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>รอชำระ: {orders.filter(o => o.status === 'pending_payment').length}</span>
             </div>
             <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-3 text-sm font-medium text-gray-600 shadow-sm">
                <Package className="w-4 h-4 text-blue-500" />
                <span>รอจัดส่ง: {orders.filter(o => o.status === 'ready_to_ship').length}</span>
             </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard 
          title="ลูกค้าทั้งหมด (คน)" 
          value="3" 
          //growth="+20%" 
          //trend="up" 
          icon={Layers}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="ยอดคำสั่งซื้อทั้งหมด (ชิ้น)" 
          value="฿2,850" 
          growth="+15%" 
          trend="up" 
          icon={Box}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="รายได้ทั้งหมด (บาท)" 
          value="฿1,850,000" 
          growth="+15%" 
          trend="up" 
          icon={DollarSign}
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          title="จัดส่งแล้วทั้งหมด (ชิ้น)" 
          value="฿1,850,000" 
          growth="+15%" 
          trend="up" 
          icon={PackageCheck}
          colorClass="bg-indigo-50 text-indigo-600"
        />
      </div>


      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาเลขคำสั่งซื้อ, ชื่อลูกค้า..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 text-sm"
            />
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2.5 border border-gray-200 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
               <Calendar className="w-4 h-4" />
               วันที่
             </button>
             <button className="px-4 py-2.5 border border-gray-200 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
               <Filter className="w-4 h-4" />
               ตัวกรอง
             </button>
          </div>
        </div>

        {/* Custom Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-100 no-scrollbar">
          {["all", "pending_payment", "pending_production", "in_production", "ready_to_ship", "shipped"].map((tab) => {
            const labelMap: Record<string, string> = { 
                all: "ทั้งหมด", 
                pending_payment: "รอชำระเงิน", 
                pending_production: "รอจัดทำ",
                in_production: "กำลังผลิต",
                ready_to_ship: "รอจัดส่ง",
                shipped: "ส่งแล้ว"
            };
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                  ${isActive ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {labelMap[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">คำสั่งซื้อ</th>
              <th className="px-6 py-4">ลูกค้า</th>
              <th className="px-6 py-4">รายการสินค้า</th>
              <th className="px-6 py-4">วันที่สั่ง / รับ</th>
              <th className="px-6 py-4">สถานะ</th>
              <th className="px-6 py-4 text-right">ยอดรวม</th>
              <th className="px-6 py-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => handleOpenDetail(order)}>
                    <td className="px-6 py-4">
                        <span className="font-mono font-medium text-gray-900">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <img src={order.customerAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                        <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{order.customerName}</p>
                            <p className="text-xs text-gray-400">{order.customerPhone}</p>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            {order.items.length > 0 && <img src={order.items[0].image} className="w-8 h-8 rounded object-cover border border-gray-100" />}
                            <span className="text-gray-600">{order.items.length} รายการ</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-gray-900">{new Date(order.date).toLocaleDateString('th-TH')}</div>
                        {order.deliveryDate && <div className="text-xs text-gray-400 mt-0.5">รับ: {new Date(order.deliveryDate).toLocaleDateString('th-TH')}</div>}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[order.status].color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[order.status].label}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                        ฿{order.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>

                          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg">
                            <Plus className="w-4 h-4" />
                          </button>


                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                    </td>
                    </tr>
                );
                })
            ) : (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>ไม่พบคำสั่งซื้อที่ค้นหา</p>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Dialogs --- */}

      {/* 1. Order Detail Modal */}
      <Modal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title={`รายละเอียดคำสั่งซื้อ #${selectedOrder?.id}`}
        footer={
          <>
            <button onClick={() => setIsDetailOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">ปิดหน้าต่าง</button>
            {selectedOrder?.status === 'pending_payment' && (
                <button 
                    onClick={() => handleUpdateStatus('pending_production')}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg shadow-lg flex items-center gap-2"
                >
                    <CheckCircle className="w-4 h-4" /> ยืนยันการชำระเงิน
                </button>
            )}
            {selectedOrder?.status === 'ready_to_ship' && (
                <button 
                    onClick={() => setIsTrackingOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg flex items-center gap-2"
                >
                    <Truck className="w-4 h-4" /> แจ้งเลขพัสดุ
                </button>
            )}
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-4">
                <img src={selectedOrder.customerAvatar} className="w-12 h-12 rounded-full border border-white shadow-sm" />
                <div className="flex-1 grid grid-cols-2 gap-y-2">
                    <div>
                        <p className="text-xs text-gray-500">ชื่อลูกค้า</p>
                        <p className="font-medium text-gray-900">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">เบอร์โทรศัพท์</p>
                        <div className="flex items-center gap-1.5 text-gray-900">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {selectedOrder.customerPhone}
                        </div>
                    </div>
                    <div className="col-span-2">
                         <p className="text-xs text-gray-500">ที่อยู่จัดส่ง</p>
                         <div className="flex items-start gap-1.5 text-gray-900 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400 mt-1 shrink-0" />
                            <span className="text-sm">{selectedOrder.customerAddress}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline / Status */}
            <div className="flex items-center justify-between px-2">
                <div>
                     <p className="text-xs text-gray-500 mb-1">สถานะปัจจุบัน</p>
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border ${statusConfig[selectedOrder.status].color}`}>
                        {statusConfig[selectedOrder.status].label}
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">วันที่สั่งซื้อ</p>
                    <p className="font-medium text-gray-900">{new Date(selectedOrder.date).toLocaleDateString('th-TH')}</p>
                </div>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Items */}
            <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-gray-400" /> รายการสินค้า
                </h4>
                <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.name}</p>
                                {item.customSize && <p className="text-xs text-gray-500 mt-0.5">ไซส์: {item.customSize}</p>}
                                <div className="flex justify-between items-end mt-2">
                                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                                    <p className="font-medium text-gray-900">฿{item.price.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600">ยอดรวมทั้งสิ้น</p>
                    <p className="text-2xl font-bold text-gray-900">฿{selectedOrder.total.toLocaleString()}</p>
                </div>
            </div>

             {/* Payment & Shipping Info */}
             <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <CreditCard className="w-3 h-3" /> การชำระเงิน
                     </h5>
                     <p className="text-sm text-gray-600 mb-2">{selectedOrder.paymentMethod}</p>
                     {selectedOrder.paymentSlip && (
                         <button 
                            onClick={() => setIsSlipOpen(true)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                         >
                            <Receipt className="w-3 h-3" /> ดูสลิปการโอน
                         </button>
                     )}
                 </div>
                 {selectedOrder.trackingNumber && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                         <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Truck className="w-3 h-3" /> การจัดส่ง
                         </h5>
                         <p className="text-sm text-gray-600">{selectedOrder.shippingMethod}</p>
                         <p className="font-mono text-sm text-gray-900 font-medium mt-1">{selectedOrder.trackingNumber}</p>
                    </div>
                 )}
             </div>
          </div>
        )}
      </Modal>

      {/* 2. Slip Modal */}
      <Modal
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        title="หลักฐานการโอนเงิน"
      >
        <div className="flex justify-center bg-gray-900/5 rounded-xl p-4">
            <img src={selectedOrder?.paymentSlip} className="max-h-[60vh] rounded shadow-lg" />
        </div>
      </Modal>

      {/* 3. Tracking Modal */}
      <Modal
         isOpen={isTrackingOpen}
         onClose={() => setIsTrackingOpen(false)}
         title="แจ้งเลขพัสดุจัดส่ง"
         footer={
            <>
                <button onClick={() => setIsTrackingOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button>
                <button onClick={handleSaveTracking} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg">บันทึกข้อมูล</button>
            </>
         }
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">บริษัทขนส่ง</label>
                <select 
                    value={courier}
                    onChange={(e) => setCourier(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none"
                >
                    <option value="">เลือกขนส่ง</option>
                    <option value="Kerry Express">Kerry Express</option>
                    <option value="Flash Express">Flash Express</option>
                    <option value="Thailand Post">Thailand Post</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หมายเลขพัสดุ</label>
                <input 
                    type="text"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    placeholder="เช่น TH123456789" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none font-mono"
                />
            </div>
        </div>
      </Modal>



    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900 flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <OrderManagement />
      </main>
    </div>
  );
}