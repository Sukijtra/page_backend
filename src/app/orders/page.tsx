'use client'
import React, { useState, useEffect } from 'react';
import '@/app/css/orders.css';
import { 
  Gem, ShoppingCart, Users, DollarSign, Search, Eye, 
  Trash2, Edit3, Package, CheckCircle, Truck, Clock, X,
  CreditCard, MapPin, Phone, Layers, PackageCheck, Receipt
} from 'lucide-react';
import {Sidebar} from "@/components/sidebar"

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

// --- Internal Mock Data ---
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
    items: [{ name: "แหวนเพชรเม็ดเดี่ยว 1 กะรัต", quantity: 1, price: 150000, customSize: "56", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400" }],
    paymentMethod: "โอนเงิน",
    paymentSlip: "https://images.unsplash.com/photo-1554224311-94dc27c383f4?w=600",
  },
  {
    id: "10233",
    customerName: "คุณมานี ใจดี",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    customerPhone: "082-345-6789",
    customerAddress: "456 ถนนพระราม 4 กรุงเทพฯ",
    date: "2025-10-01",
    deliveryDate: "2025-10-10",
    status: "ready_to_ship", // ปรับเป็นตัวอย่างรอส่ง
    total: 80000,
    items: [{ name: "สร้อยคอทองคำ 18k", quantity: 1, price: 80000, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400" }],
    paymentMethod: "โอนเงิน",
  }
];

const statusConfig: Record<OrderStatus, { label: string; colorClass: string; icon: any }> = {
  pending_payment: { label: "รอชำระเงิน", colorClass: "status-orange", icon: Clock },
  pending_production: { label: "รอจัดทำ", colorClass: "status-gray", icon: Package },
  in_production: { label: "กำลังจัดทำ", colorClass: "status-blue", icon: Gem },
  ready_to_ship: { label: "รอจัดส่ง", colorClass: "status-purple", icon: Package },
  shipped: { label: "จัดส่งแล้ว", colorClass: "status-emerald", icon: Truck },
  cancelled: { label: "ยกเลิก", colorClass: "status-red", icon: X },
};

export default function OrderManagement() {

useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("pageRefreshed");
    if (!hasRefreshed) {
      sessionStorage.setItem("pageRefreshed", "true");
      window.location.reload();
    }
    return () => {
      sessionStorage.removeItem("pageRefreshed");
    };
  }, []);

  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  
  // Tracking Form State
  const [trackingNo, setTrackingNo] = useState("");
  const [courier, setCourier] = useState("");

  const filteredOrders = orders.filter(o => 
    (o.id.includes(searchTerm) || o.customerName.includes(searchTerm)) && 
    (activeTab === "all" || o.status === activeTab)
  );

  // --- Handlers (Logic กลับมาครบถ้วน) ---
  const handleUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    const updatedOrders = orders.map(o => o.id === selectedOrder.id ? { ...o, status } : o);
    setOrders(updatedOrders);
    setSelectedOrder({ ...selectedOrder, status });
  };

  const handleSaveTracking = () => {
    if (!selectedOrder) return;
    const updatedOrders = orders.map(o => 
      o.id === selectedOrder.id 
        ? { ...o, status: 'shipped' as OrderStatus, trackingNumber: trackingNo, shippingMethod: courier } 
        : o
    );
    setOrders(updatedOrders);
    setIsTrackingOpen(false);
    setIsDetailOpen(false);
    setTrackingNo("");
    setCourier("");
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900 flex">
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '16rem' }}>
        <div className="order-container">
          
          <div className="order-header">
            <div className="header-title">
              <h2>จัดการคำสั่งซื้อ</h2>
              <p>ติดตามและจัดการสถานะคำสั่งซื้อทั้งหมด</p>
            </div>
            <div className="header-stats-badges">
              <div className="mini-stat-badge">
                <Clock size={16} color="#f97316" /> 
                <span>รอชำระ: {orders.filter(o => o.status === 'pending_payment').length}</span>
              </div>
              <div className="mini-stat-badge">
                <Package size={16} color="#3b82f6" />
                <span>รอจัดส่ง: {orders.filter(o => o.status === 'ready_to_ship').length}</span>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <StatCard title="ลูกค้าทั้งหมด (คน)" value={orders.length.toString()} icon={Layers} colorClass="bg-blue-50" />
            <StatCard title="ยอดสั่งซื้อทั้งหมด" value={`฿${orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}`} icon={ShoppingCart} colorClass="bg-indigo-50" />
            <StatCard title="รายได้จริง" value="฿1,850,000" icon={DollarSign} colorClass="bg-indigo-50" />
            <StatCard title="จัดส่งแล้ว" value="12" icon={PackageCheck} colorClass="bg-indigo-50" />
          </div>

          <div className="order-toolbar">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input 
                type="text" 
                className="search-field"
                placeholder="ค้นหาเลขคำสั่งซื้อ, ชื่อลูกค้า..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="tabs-wrapper">
              {["all", "pending_payment", "ready_to_ship", "shipped"].map((tab) => (
                <button 
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all' ? 'ทั้งหมด' : statusConfig[tab as OrderStatus]?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>คำสั่งซื้อ</th>
                  <th>ลูกค้า</th>
                  <th>รายการ</th>
                  <th>วันที่สั่ง</th>
                  <th>สถานะ</th>
                  <th style={{ textAlign: 'right' }}>ยอดรวม</th>
                  <th style={{ textAlign: 'center' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status];
                  const Icon = config.icon;
                  return (
                    <tr key={order.id} onClick={() => { setSelectedOrder(order); setIsDetailOpen(true); }}>
                      <td><span style={{ fontWeight: 500, fontFamily: 'monospace' }}>#{order.id}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img src={order.customerAvatar} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
                          <div>
                            <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{order.customerPhone}</div>
                          </div>
                        </div>
                      </td>
                      <td>{order.items.length} รายการ</td>
                      <td>{new Date(order.date).toLocaleDateString('th-TH')}</td>
                      <td>
                        <span className={`status-badge ${config.colorClass}`}>
                          <Icon size={12} /> {config.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 500 }}>฿{order.total.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button className="action-btn" onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); setIsDetailOpen(true); }}><Eye size={16} /></button>
                          <button className="action-btn"><Edit3 size={16} /></button>
                          <button className="action-btn action-btn-red"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1. Detail Modal (เชื่อม Logic ยืนยันชำระเงิน/แจ้งพัสดุ) */}
        {isDetailOpen && selectedOrder && (
          <div className="modal-overlay" onClick={() => setIsDetailOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 style={{ fontWeight: 700 }}>รายละเอียดคำสั่งซื้อ #{selectedOrder.id}</h3>
                <button onClick={() => setIsDetailOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X /></button>
              </div>
              <div className="modal-body">
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem', display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <img src={selectedOrder.customerAvatar} style={{ width: '48px', height: '48px', borderRadius: '50%' }} alt="" />
                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div><p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>ชื่อลูกค้า</p><p style={{ fontWeight: 500, margin: 0 }}>{selectedOrder.customerName}</p></div>
                    <div><p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>เบอร์โทร</p><p style={{ fontWeight: 500, margin: 0 }}>{selectedOrder.customerPhone}</p></div>
                    <div style={{ gridColumn: 'span 2' }}><p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>ที่อยู่</p><p style={{ fontSize: '14px', margin: 0 }}>{selectedOrder.customerAddress}</p></div>
                  </div>
                </div>

                <div className="items-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="item-card">
                      <img src={item.image} className="item-img" alt="" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500 }}>{item.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>x{item.quantity}</span>
                          <span style={{ fontWeight: 600 }}>฿{item.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#4b5563' }}>ยอดรวมทั้งสิ้น</span>
                  <span style={{ fontSize: '24px', fontWeight: 700 }}>฿{selectedOrder.total.toLocaleString()}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                        <h5 style={{ margin: '0 0 8px 0', fontSize: '13px' }}><CreditCard size={14}/> ชำระเงิน</h5>
                        <p style={{ fontSize: '13px', margin: 0 }}>{selectedOrder.paymentMethod}</p>
                        {selectedOrder.paymentSlip && <button onClick={() => setIsSlipOpen(true)} style={{ fontSize: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>ดูสลิป</button>}
                    </div>
                    {selectedOrder.trackingNumber && (
                        <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.75rem' }}>
                            <h5 style={{ margin: '0 0 8px 0', fontSize: '13px' }}><Truck size={14}/> จัดส่ง</h5>
                            <p style={{ fontSize: '13px', margin: 0 }}>{selectedOrder.shippingMethod}</p>
                            <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{selectedOrder.trackingNumber}</p>
                        </div>
                    )}
                </div>
              </div>

              <div className="modal-footer">
                {selectedOrder.status === 'pending_payment' && (
                    <button className="btn-primary" onClick={() => handleUpdateStatus('pending_production')}>
                      <CheckCircle size={16} /> ยืนยันการชำระเงิน
                    </button>
                )}
                {selectedOrder.status === 'ready_to_ship' && (
                    <button className="btn-primary" style={{ backgroundColor: '#7e22ce' }} onClick={() => setIsTrackingOpen(true)}>
                      <Truck size={16} /> แจ้งเลขพัสดุ
                    </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. Slip Modal */}
        {isSlipOpen && (
          <div className="modal-overlay" style={{ zIndex: 110 }} onClick={() => setIsSlipOpen(false)}>
            <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
               <div className="modal-header"><h3>หลักฐานการชำระเงิน</h3><button onClick={() => setIsSlipOpen(false)}><X/></button></div>
               <div className="modal-body"><img src={selectedOrder?.paymentSlip} style={{ width: '100%', borderRadius: '8px' }} /></div>
            </div>
          </div>
        )}

        {/* 3. Tracking Modal */}
        {isTrackingOpen && (
          <div className="modal-overlay" style={{ zIndex: 110 }} onClick={() => setIsTrackingOpen(false)}>
            <div className="modal-content" style={{ maxWidth: '450px' }} onClick={e => e.stopPropagation()}>
               <div className="modal-header"><h3>แจ้งเลขพัสดุ</h3><button onClick={() => setIsTrackingOpen(false)}><X/></button></div>
               <div className="modal-body">
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>บริษัทขนส่ง</label>
                    <select className="search-field" value={courier} onChange={e => setCourier(e.target.value)}>
                        <option value="">เลือกขนส่ง</option>
                        <option value="Kerry Express">Kerry Express</option>
                        <option value="Flash Express">Flash Express</option>
                        <option value="Thailand Post">Thailand Post</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>เลขพัสดุ</label>
                    <input type="text" className="search-field" value={trackingNo} onChange={e => setTrackingNo(e.target.value)} />
                  </div>
               </div>
               <div className="modal-footer">
                  <button onClick={handleSaveTracking} className="btn-primary">บันทึกข้อมูล</button>
               </div>
            </div>
          </div>
        )}

      </main>

      
    </div>
  );
}

function StatCard({ title, value, icon: Icon, colorClass }: any) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div>
          <div className="stat-label">{title}</div>
          <div className="stat-value">{value}</div>
        </div>
        <div className={`stat-icon-box ${colorClass}`}><Icon size={20} /></div>
      </div>
    </div>
  );
}