'use client'
import React, { useState, useEffect } from 'react';
import '@/app/css/customers.css';
import { 
  Box, User, Users, Search, Ban, CheckCircle, Phone, 
  Mail, MapPin, Calendar, ShoppingBag, DollarSign, X, 
  History, FileSearch, Eye, Edit3, Trash2 
} from 'lucide-react';
import {Sidebar} from "@/components/sidebar"

// --- ข้อมูลจำลอง (Mock Data) ---
const mockCustomers = [
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
      { orderId: "10234", date: "2025-10-01", total: 150000, status: "รอดำเนินการ", productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150" },
      { orderId: "10112", date: "2025-08-15", total: 85000, status: "จัดส่งแล้ว", productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150" },
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
      { orderId: "10233", date: "2025-10-01", total: 80000, status: "กำลังผลิต", productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150" },
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

export default function CustomerManagement() {

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

  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'appraisal'>('orders');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const toggleStatus = (id: number) => {
    setCustomers(customers.map(c => 
      c.id === id ? { ...c, status: c.status === 'active' ? 'banned' : 'active' } : c
    ));
  };

  const removeCustomer = (id: number) => {
    if (confirm("คุณต้องการลบลูกค้ารายนี้ใช่หรือไม่?")) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="customer-main-layout">
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '16rem' }}>
        <div className="customer-container">
          
          <div className="customer-header">
            <div>
              <h2>จัดการลูกค้า</h2>
              <p>รายชื่อและประวัติการซื้อขายของลูกค้าทั้งหมด</p>
            </div>
          </div>

          <div className="stats-grid">
            <StatItem title="ยอดซื้อสะสมทั้งหมด" value="฿2,850,000" Icon={DollarSign} />
            <StatItem title="สมาชิกทั้งหมด" value={customers.length.toString()} Icon={Users} />
            <StatItem title="บัญชีถูกระงับ" value={customers.filter(c => c.status === 'banned').length.toString()} Icon={User} />
            <StatItem title="คำสั่งซื้อทั้งหมด" value="9" Icon={Box} />
          </div>

          <div className="customer-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ หรือเบอร์โทร..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="customer-table">
              <thead>
                <tr>
                  <th>ลูกค้า</th>
                  <th>ติดต่อ</th>
                  <th style={{ textAlign: 'center' }}>ยอดซื้อสะสม</th>
                  <th style={{ textAlign: 'center' }}>วันที่เข้าเป็นสมาชิก</th>
                  <th style={{ textAlign: 'center' }}>สถานะ</th>
                  <th style={{ textAlign: 'center' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-info-cell">
                        <img src={customer.avatar} className="avatar-small" alt="" />
                        <div>
                          <div style={{ fontWeight: 600 }}>{customer.name}</div>
                          <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>ID: #{customer.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12}/> {customer.phone}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12}/> {customer.email}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 600 }}>฿{customer.totalSpent.toLocaleString()}</div>
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{customer.totalOrders} รายการ</div>
                    </td>
                    <td style={{ textAlign: 'center', color: '#6b7280' }}>
                      {new Date(customer.joinDate).toLocaleDateString('th-TH')}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-badge ${customer.status === 'active' ? 'status-active' : 'status-banned'}`}>
                        {customer.status === 'active' ? 'ปกติ' : 'ถูกระงับ'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon btn-view" onClick={() => setSelectedCustomer(customer)}><Eye size={16}/></button>
                        <button className="btn-icon btn-edit"><Edit3 size={16}/></button>
                        <button className="btn-icon btn-delete" onClick={() => removeCustomer(customer.id)}><Trash2 size={16}/></button>
                        <button className={`btn-icon btn-ban ${customer.status !== 'active' ? 'btn-unban' : ''}`} onClick={() => toggleStatus(customer.id)}>
                          {customer.status === 'active' ? <Ban size={16}/> : <CheckCircle size={16}/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal รายละเอียดลูกค้า */}
      {selectedCustomer && (
        <div className="modal-overlay" onClick={() => setSelectedCustomer(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700 }}>โปรไฟล์ลูกค้า</h3>
              <button className="btn-icon" onClick={() => setSelectedCustomer(null)}><X size={20}/></button>
            </div>
            <div className="modal-body">
              <div className="detail-profile-card">
                <img src={selectedCustomer.avatar} className="avatar-large" alt="" />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{selectedCustomer.name}</h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="contact-info" style={{ fontSize: '0.875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14}/> {selectedCustomer.phone}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14}/> {selectedCustomer.email}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14}/> {selectedCustomer.address}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-wrapper">
                <nav className="tab-nav">
                  <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                    <History size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }}/> ประวัติการซื้อ
                  </button>
                  <button className={`tab-btn ${activeTab === 'appraisal' ? 'active' : ''}`} onClick={() => setActiveTab('appraisal')}>
                    <FileSearch size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }}/> ประวัติประเมินราคา
                  </button>
                </nav>

                <div className="history-list">
                  {activeTab === 'orders' ? (
                    selectedCustomer.orderHistory.length > 0 ? (
                      selectedCustomer.orderHistory.map((order: any) => (
                        <div className="history-item" key={order.orderId}>
                          <img src={order.productImage} style={{ width: '4rem', height: '4rem', borderRadius: '0.5rem', objectFit: 'cover' }} alt="" />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>ออเดอร์ #{order.orderId}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{order.date}</div>
                          </div>
                          <div style={{ fontWeight: 700 }}>฿{order.total.toLocaleString()}</div>
                        </div>
                      ))
                    ) : <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>ไม่มีประวัติการสั่งซื้อ</div>
                  ) : (
                    selectedCustomer.appraisalHistory.length > 0 ? (
                      selectedCustomer.appraisalHistory.map((item: any) => (
                        <div className="history-item" key={item.id}>
                          <img src={item.productImage} style={{ width: '4rem', height: '4rem', borderRadius: '0.5rem', objectFit: 'cover' }} alt="" />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{item.jewelryType} ({item.diamondShape})</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>ID: {item.id} • {item.date}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: '#2563eb' }}>฿{item.estimatedPrice.toLocaleString()}</div>
                        </div>
                      ))
                    ) : <div style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>ไม่มีประวัติการประเมิน</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component สำหรับ Stat Card
function StatItem({ title, value, Icon }: any) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="value">{value}</div>
      </div>
      <div className="stat-icon">
        <Icon size={20} />
      </div>
    </div>
  );
}