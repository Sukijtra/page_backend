'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Search, Ruler } from 'lucide-react';
import { Sidebar } from "@/components/sidebar";
import '@/app/css/ring-category.css';

const API = "http://localhost:8080";

export default function RingSizePage() {
  const [sizes, setSizes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadSizes = async () => {
    try {
      const res = await fetch(`${API}/ring-sizes`);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      if (Array.isArray(data)) setSizes(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setSizes([]);
    }
  };

  useEffect(() => { loadSizes(); }, []);

  return (
    <div className="ring-page-container">
      <Sidebar /> 
      <main className="ring-main-content">
        <div className="ring-content-wrapper">
          
          {/* ส่วนหัวเว้นระยะตามรูปตัวอย่าง */}
          <div className="ring-header-section mb-10">
            <h1 className="ring-header-title text-3xl font-bold text-slate-800">จัดการไซส์แหวน</h1>
            <p className="ring-header-subtitle text-slate-500 mt-2">จัดการรายการไซส์และคุณลักษณะของแหวนในระบบแยกตามกลุ่ม</p>
          </div>

          <div className="ring-cards-grid">
            <div className="ring-card">
              
              {/* Card Header: ชื่อและปุ่มเพิ่มอยู่คนละฝั่ง */}
              <div className="ring-card-header flex justify-between items-center mb-8">
                <div className="ring-card-title flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Ruler size={24} className="text-amber-500" />
                  </div>
                  <span className="text-xl font-bold text-slate-800">จัดการไซส์แหวน</span>
                </div>
                <button className="ring-btn-add">
                  <Plus size={20} />
                  <span>เพิ่ม</span>
                </button>
              </div>

              {/* Search Box: กว้างเต็มพื้นที่และไอคอนอยู่ข้างใน */}
              <div className="ring-search-wrapper mb-8">
                <Search size={20} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="ค้นหา..." 
                  className="ring-search-input"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Table: จัดระเบียบใหม่ทั้งหมด */}
              <table className="ring-data-table w-full">
                <thead>
                  <tr className="text-slate-400 text-sm uppercase tracking-wider">
                    <th className="text-left pb-4 font-semibold w-24">ID</th>
                    <th className="text-left pb-4 font-semibold">ไซส์แหวน</th>
                    <th className="text-center pb-4 font-semibold">สถานะ</th>
                    <th className="text-right pb-4 font-semibold">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sizes.length > 0 ? (
                    sizes.filter(s => s.size_name?.toString().includes(searchTerm)).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-5 text-slate-400 font-medium">#{item.id}</td>
                        <td className="py-5">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-slate-700 text-lg">{item.size_name}</span>
                            <span className="status-badge-active">เปิดใช้งาน</span>
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="flex justify-center">
                            <button className="ring-status-toggle">
                              <div className="ring-toggle-dot"></div>
                            </button>
                          </div>
                        </td>
                        <td className="py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="ring-action-btn edit">
                              <Edit3 size={18} />
                            </button>
                            <button className="ring-action-btn delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-24 text-center text-slate-400 italic bg-slate-50/30 rounded-xl">
                        ไม่พบข้อมูลไซส์แหวนในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}