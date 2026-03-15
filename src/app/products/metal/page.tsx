'use client'

import React, { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Plus, Edit3, Trash2, LayoutGrid, X, AlertCircle, Palette } from "lucide-react"
import "@/app/css/metal-category.css"

interface MetalCategory {
  id: number;
  name: string;
  status: number; // 1 = open, 0 = closed
}

export default function MetalCategoryPage() {
  // กลุ่ม 1: สีทองขาว, สีทอง, สีทองชมพู 
  const [metalGroup1, setMetalGroup1] = useState<MetalCategory[]>([
    { id: 1, name: "สีทองขาว", status: 1 },
    { id: 2, name: "สีทอง", status: 1 },
    { id: 3, name: "สีทองชมพู", status: 1 }
  ]);

  // กลุ่ม 2: ความหนาแน่นโลหะ
  const [metalGroupDensity, setMetalGroupDensity] = useState<MetalCategory[]>([
    { id: 101, name: "18K", status: 1 },
    { id: 102, name: "10K", status: 1 },
    { id: 103, name: "9K", status: 1 }
  ]);

  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");

  const [alert, setAlert] = useState<{ 
    type: 'edit' | 'delete' | 'add' | 'success' | null, 
    item: MetalCategory | null,
    group: 1 | 2
  }>({ type: null, item: null, group: 1 });

  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const filtered1 = metalGroup1.filter(m => m.name.toLowerCase().includes(search1.toLowerCase()));
  const filteredDensity = metalGroupDensity.filter(m => m.name.toLowerCase().includes(search2.toLowerCase()));

  // Actions for Group 1
  const handleEdit1 = (item: MetalCategory) => {
    setEditName(item.name);
    setAlert({ type: 'edit', item, group: 1 });
  };
  const handleDelete1 = (item: MetalCategory) => setAlert({ type: 'delete', item, group: 1 });
  const handleAdd1 = () => {
    setNewName("");
    setAlert({ type: 'add', item: null, group: 1 });
  };

  // Actions for Group 2
  const handleEdit2 = (item: MetalCategory) => {
    setEditName(item.name);
    setAlert({ type: 'edit', item, group: 2 });
  };
  const handleDelete2 = (item: MetalCategory) => setAlert({ type: 'delete', item, group: 2 });
  const handleAdd2 = () => {
    setNewName("");
    setAlert({ type: 'add', item: null, group: 2 });
  };

  const handleToggleStatus = (item: MetalCategory, group: 1 | 2) => {
    if (group === 1) {
      setMetalGroup1(prev => prev.map(t => t.id === item.id ? { ...t, status: t.status === 1 ? 0 : 1 } : t));
    } else {
      setMetalGroupDensity(prev => prev.map(t => t.id === item.id ? { ...t, status: t.status === 1 ? 0 : 1 } : t));
    }
  };

  const confirmDelete = () => {
    if (alert.item) {
      if (alert.group === 1) {
        setMetalGroup1(prev => prev.filter(t => t.id !== alert.item!.id));
      } else {
        setMetalGroupDensity(prev => prev.filter(t => t.id !== alert.item!.id));
      }
      setAlert(prev => ({ ...prev, type: 'success' }));
      setTimeout(closeAlert, 1500);
    }
  };

  const handleSaveEdit = () => {
    if (alert.item && editName.trim()) {
      if (alert.group === 1) {
        setMetalGroup1(prev => prev.map(t => t.id === alert.item!.id ? { ...t, name: editName } : t));
      } else {
        setMetalGroupDensity(prev => prev.map(t => t.id === alert.item!.id ? { ...t, name: editName } : t));
      }
      setAlert(prev => ({ ...prev, type: 'success' }));
      setTimeout(closeAlert, 1500);
    }
  };

  const confirmAdd = () => {
    if (newName.trim()) {
      if (alert.group === 1) {
        const newId = metalGroup1.length > 0 ? Math.max(...metalGroup1.map(t => t.id)) + 1 : 1;
        setMetalGroup1(prev => [...prev, { id: newId, name: newName.trim(), status: 1 }]);
      } else {
        const newId = metalGroupDensity.length > 0 ? Math.max(...metalGroupDensity.map(t => t.id)) + 1 : 101;
        setMetalGroupDensity(prev => [...prev, { id: newId, name: newName.trim(), status: 1 }]);
      }
      setAlert(prev => ({ ...prev, type: 'success' }));
      setTimeout(closeAlert, 1500);
    }
  };

  const closeAlert = () => {
    setAlert({ type: null, item: null, group: 1 });
    setEditName("");
    setNewName("");
  };

  const renderTable = (items: MetalCategory[], onEdit: (i: MetalCategory) => void, onDelete: (i: MetalCategory) => void, group: 1 | 2) => (
    <div className="metal-table-container">
      <table className="metal-data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th>ชื่อ{group === 1 ? 'สีโลหะ' : 'ความหนาแน่น'}</th>
            <th style={{ width: '100px', textAlign: 'center' }}>สถานะ</th>
            <th style={{ width: '80px', textAlign: 'right' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="text-gray-400">#{item.id}</td>
              <td className="font-medium">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {item.name}
                  <span className={`metal-status-badge ${item.status === 1 ? 'open' : 'closed'}`}>
                    {item.status === 1 ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </span>
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <label className="metal-switch">
                  <input 
                    type="checkbox" 
                    checked={item.status === 1}
                    onChange={() => handleToggleStatus(item, group)}
                  />
                  <span className="metal-slider"></span>
                </label>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.25rem' }}>
                  <button className="metal-action-btn edit" onClick={() => onEdit(item)}><Edit3 size={16} /></button>
                  <button className="metal-action-btn delete" onClick={() => onDelete(item)}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF' }}>ไม่มีข้อมูล</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="metal-page-container">
      <Sidebar />

      <main className="metal-main-content">
        <div className="metal-content-wrapper">
          
          <div className="metal-header-section">
            <h1 className="metal-header-title">จัดการหมวดหมู่โลหะ</h1>
            <p className="metal-header-subtitle">จัดการสีและคุณลักษณะของโลหะในระบบแยกตามกลุ่ม</p>
          </div>

          <div className="metal-cards-grid">
            {/* Card 1 */}
            <div className="metal-card">
              <div className="metal-card-header">
                <h2 className="metal-card-title">
                  <Palette size={20} className="text-amber-500" />
                  จัดการสีโลหะ
                </h2>
                <button className="metal-btn-add-sm" onClick={handleAdd1}>
                  <Plus size={16} />
                  <span>เพิ่ม</span>
                </button>
              </div>

              <div className="metal-card-filter">
                <div className="metal-search-box text-gray-400">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="ค้นหา..." 
                    className="metal-search-input"
                    value={search1}
                    onChange={(e) => setSearch1(e.target.value)}
                  />
                </div>
              </div>

              {renderTable(filtered1, handleEdit1, handleDelete1, 1)}
            </div>

            {/* Card 2 */}
            <div className="metal-card">
              <div className="metal-card-header">
                <h2 className="metal-card-title">
                  <LayoutGrid size={20} className="text-blue-500" />
                  จัดการความหนาแน่นโลหะ
                </h2>
                <button className="metal-btn-add-sm" onClick={handleAdd2}>
                  <Plus size={16} />
                  <span>เพิ่ม</span>
                </button>
              </div>

              <div className="metal-card-filter">
                <div className="metal-search-box text-gray-400">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="ค้นหา..." 
                    className="metal-search-input"
                    value={search2}
                    onChange={(e) => setSearch2(e.target.value)}
                  />
                </div>
              </div>

              {renderTable(filteredDensity, handleEdit2, handleDelete2, 2)}
            </div>
          </div>

        </div>
      </main>

      {/* Alert Modals */}
      {alert.type && (
        <div className="metal-modal-overlay" onClick={closeAlert}>
          <div className="metal-alert-card" onClick={e => e.stopPropagation()}>
            {alert.type === 'success' ? (
              <>
                <div className="metal-alert-icon edit" style={{ background: '#ECFDF5', color: '#10B981' }}>
                  <LayoutGrid size={24} />
                </div>
                <h3 className="metal-alert-title">สำเร็จ!</h3>
                <p className="metal-alert-text">ดำเนินการเรียบร้อยแล้ว</p>
              </>
            ) : (
              <>
                <div className={`metal-alert-icon ${alert.type === 'add' ? 'edit' : alert.type}`}>
                  {alert.type === 'add' ? <Plus size={24} /> : alert.type === 'edit' ? <Edit3 size={24} /> : <Trash2 size={24} />}
                </div>
                <h3 className="metal-alert-title">
                  {alert.type === 'add' ? `เพิ่ม${alert.group === 1 ? 'สีโลหะ' : 'ความหนาแน่น'}` : alert.type === 'edit' ? `แก้ไข${alert.group === 1 ? 'สีโลหะ' : 'ความหนาแน่น'}` : 'ยืนยันการลบ'}
                </h3>
                
                <div className="metal-alert-text">
                  {alert.type === 'add' ? (
                    <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อสีโลหะ</label>
                      <input 
                        type="text" 
                        className="custom-input" 
                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%', outline: 'none' }}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="ระบุสีโลหะ..."
                        autoFocus
                      />
                    </div>
                  ) : alert.type === 'edit' ? (
                    <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อใหม่</label>
                      <input 
                        type="text" 
                        className="custom-input" 
                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%', outline: 'none' }}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    `คุณแน่ใจหรือไม่ว่าต้องการลบ "${alert.item?.name}"?`
                  )}
                </div>

                <button 
                  className="metal-alert-btn primary" 
                  onClick={alert.type === 'add' ? confirmAdd : alert.type === 'edit' ? handleSaveEdit : confirmDelete}
                >
                  {alert.type === 'add' ? 'ยืนยันการเพิ่ม' : alert.type === 'edit' ? 'บันทึกการแก้ไข' : 'ยืนยันการลบ'}
                </button>
                <button className="metal-alert-btn secondary" onClick={closeAlert}>
                  ยกเลิก
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}