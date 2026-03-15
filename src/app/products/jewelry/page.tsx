'use client'

import React, { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Plus, Edit3, Trash2, LayoutGrid, X, AlertCircle, Filter, ChevronDown, Database, Layers } from "lucide-react"
import "@/app/css/jewelry-category.css"

interface JewelryCategory {
  id: number;
  name: string;
  group: string; // "ต่างหู", "สร้อยคอ", "กำไล", "แหวนเพชร"
  status: number; // 1 = open, 0 = closed
}

export default function JewelryCategoryPage() {
  const initialCategories: JewelryCategory[] = [
    // ต่างหู
    { id: 1, name: "ต่างหูเม็ดเดี่ยว", group: "ต่างหู", status: 1 },
    { id: 2, name: "ต่างหูห่วง", group: "ต่างหู", status: 1 },
    { id: 3, name: "ต่างหูห้อยระย้า", group: "ต่างหู", status: 1 },
    { id: 4, name: "ดีไซน์ธรรมชาติ", group: "ต่างหู", status: 1 },
    // สร้อยคอ
    { id: 5, name: "สร้อยคอพร้อมจี้", group: "สร้อยคอ", status: 1 },
    // กำไล
    { id: 6, name: "กำไลเพชร", group: "กำไล", status: 1 },
    // แหวนเพชร
    { id: 7, name: "เม็ดเดี่ยว", group: "แหวนเพชร", status: 1 },
    { id: 8, name: "บ่าข้าง", group: "แหวนเพชร", status: 1 },
    { id: 9, name: "ล้อมเพชร", group: "แหวนเพชร", status: 1 },
    { id: 10, name: "ล้อมซ่อนฐาน", group: "แหวนเพชร", status: 1 },
    { id: 11, name: "เพชรข้าง", group: "แหวนเพชร", status: 1 },
    { id: 12, name: "ดีไซน์ธรรมชาติ", group: "แหวนเพชร", status: 1 }
  ];

  const [categories, setCategories] = useState<JewelryCategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [alert, setAlert] = useState<{ type: 'edit' | 'delete' | 'add' | 'success' | null, item: JewelryCategory | null }>({ type: null, item: null });
  const [editName, setEditName] = useState("");
  const [editGroup, setEditGroup] = useState("");
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState("ต่างหู");

  const groups = ["ต่างหู", "สร้อยคอ", "กำไล", "แหวนเพชร"];

  const filteredCategories = categories.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup = groupFilter === "all" || cat.group === groupFilter;
    const matchStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "open" ? cat.status === 1 : cat.status === 0;
      
    return matchSearch && matchGroup && matchStatus;
  });

  const handleToggleStatus = (id: number) => {
    setCategories(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 1 ? 0 : 1 } : t
    ));
  };

  const handleEdit = (item: JewelryCategory) => {
    setEditName(item.name);
    setEditGroup(item.group);
    setAlert({ type: 'edit', item });
  };

  const handleDelete = (item: JewelryCategory) => {
    setAlert({ type: 'delete', item });
  };

  const handleAdd = () => {
    setNewName("");
    setNewGroup("ต่างหู");
    setAlert({ type: 'add', item: null });
  };

  const confirmDelete = () => {
    if (alert.item) {
      setCategories(prev => prev.filter(t => t.id !== alert.item!.id));
      setAlert({ type: 'success', item: null });
      setTimeout(closeAlert, 1500);
    }
  };

  const handleSaveEdit = () => {
    if (alert.item && editName.trim() && editGroup) {
      setCategories(prev => prev.map(t => 
        t.id === alert.item!.id ? { ...t, name: editName, group: editGroup } : t
      ));
      setAlert({ type: 'success', item: null });
      setTimeout(closeAlert, 1500);
    }
  };

  const confirmAdd = () => {
    if (newName.trim() && newGroup) {
      const newId = categories.length > 0 ? Math.max(...categories.map(t => t.id)) + 1 : 1;
      const newItem: JewelryCategory = {
        id: newId,
        name: newName.trim(),
        group: newGroup,
        status: 1
      };
      setCategories(prev => [...prev, newItem]);
      setAlert({ type: 'success', item: null });
      setTimeout(closeAlert, 1500);
    }
  };

  const closeAlert = () => {
    setAlert({ type: null, item: null });
    setEditName("");
    setEditGroup("");
    setNewName("");
    setNewGroup("ต่างหู");
  };

  const getGroupBadgeClass = (group: string) => {
    switch(group) {
        case "ต่างหู": return "earrings";
        case "สร้อยคอ": return "necklace";
        case "กำไล": return "bracelet";
        case "แหวนเพชร": return "ring";
        default: return "";
    }
  };

  return (
    <div className="jewelry-page-container">
      <Sidebar />

      <main className="jewelry-main-content">
        <div className="jewelry-content-wrapper">
          
          {/* Header Section */}
          <div className="jewelry-header-section">
            <div>
              <h1 className="jewelry-header-title">จัดการหมวดหมู่เครื่องประดับ</h1>
              <p className="jewelry-header-subtitle">จัดการประเภทและกลุ่มของเครื่องประดับในระบบ</p>
            </div>
            <button className="jewelry-btn-add" onClick={handleAdd}>
              <Plus size={18} />
              <span>เพิ่มหมวดหมู่</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="jewelry-filter-bar">
            <div className="jewelry-filter-group">
                <div className="jewelry-search-box text-gray-400">
                    <Search size={20} />
                    <input 
                        type="text" 
                        placeholder="ค้นหาชื่อหมวดหมู่..." 
                        className="jewelry-search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="jewelry-filter-select-wrapper">
                    <Layers size={18} className="jewelry-select-icon-left text-gray-400" />
                    <select 
                        className="jewelry-filter-select"
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                    >
                        <option value="all">ทุกกลุ่มเครื่องประดับ</option>
                        {groups.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    <ChevronDown size={18} className="jewelry-select-icon-right text-gray-400" />
                </div>

                <div className="jewelry-filter-select-wrapper">
                    <Database size={18} className="jewelry-select-icon-left text-gray-400" />
                    <select 
                        className="jewelry-filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">สถานะทั้งหมด</option>
                        <option value="open">เปิดใช้งาน</option>
                        <option value="closed">ปิดใช้งาน</option>
                    </select>
                    <ChevronDown size={18} className="jewelry-select-icon-right text-gray-400" />
                </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="jewelry-table-container">
            <table className="jewelry-data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>ชื่อหมวดหมู่</th>
                  <th style={{ width: '150px' }}>กลุ่ม</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>สถานะ</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td className="font-medium">{item.name}</td>
                      <td>
                        <span className={`group-badge ${getGroupBadgeClass(item.group)}`}>
                            {item.group}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          className="jewelry-toggle-switch"
                          style={{ backgroundColor: item.status === 1 ? '#10B981' : '#D1D5DB' }}
                        >
                          <span
                            className="jewelry-toggle-dot"
                            style={{ transform: item.status === 1 ? 'translateX(1.25rem)' : 'translateX(0.25rem)' }}
                          />
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button 
                            className="jewelry-action-btn edit" 
                            title="แก้ไข"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            className="jewelry-action-btn delete" 
                            title="ลบ"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                      ไม่พบข้อมูลที่ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>

      {/* Alert Modals */}
      {alert.type && (
        <div className="jewelry-modal-overlay" onClick={closeAlert}>
          <div className="jewelry-alert-card" onClick={e => e.stopPropagation()}>
            {alert.type === 'success' ? (
                <>
                    <div className="jewelry-alert-icon edit" style={{ background: '#ECFDF5', color: '#10B981' }}>
                        <LayoutGrid size={24} />
                    </div>
                    <h3 className="jewelry-alert-title">สำเร็จ!</h3>
                    <p className="jewelry-alert-text">ดำเนินการเรียบร้อยแล้ว</p>
                </>
            ) : (
                <>
                    <div className={`jewelry-alert-icon ${alert.type === 'add' ? 'edit' : alert.type}`}>
                    {alert.type === 'add' ? <Plus size={24} /> : alert.type === 'edit' ? <Edit3 size={24} /> : <Trash2 size={24} />}
                    </div>
                    <h3 className="jewelry-alert-title">
                    {alert.type === 'add' ? 'เพิ่มหมวดหมู่ใหม่' : alert.type === 'edit' ? 'แก้ไขหมวดหมู่' : 'ยืนยันการลบ'}
                    </h3>
                    
                    <div className="jewelry-alert-text">
                        {alert.type === 'add' ? (
                            <div style={{ marginTop: '1rem', textAlign: 'left' }} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อหมวดหมู่</label>
                                    <input 
                                        type="text" 
                                        className="custom-input" 
                                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%', outline: 'none' }}
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="ระบุชื่อหมวดหมู่..."
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">กลุ่มเครื่องประดับ</label>
                                    <select 
                                        className="custom-input" 
                                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%', outline: 'none', appearance: 'none', background: 'white' }}
                                        value={newGroup}
                                        onChange={(e) => setNewGroup(e.target.value)}
                                    >
                                        {groups.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : alert.type === 'edit' ? (
                            <div style={{ marginTop: '1rem', textAlign: 'left' }} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อหมวดหมู่</label>
                                    <input 
                                        type="text" 
                                        className="custom-input" 
                                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%', outline: 'none' }}
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">กลุ่มเครื่องประดับ</label>
                                    <select 
                                        className="custom-input" 
                                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%', outline: 'none', appearance: 'none', background: 'white' }}
                                        value={editGroup}
                                        onChange={(e) => setEditGroup(e.target.value)}
                                    >
                                        {groups.map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            `คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่ "${alert.item?.name}" (${alert.item?.group}) ออกจากระบบ?`
                        )}
                    </div>

                    <button 
                        className="jewelry-alert-btn primary" 
                        onClick={alert.type === 'add' ? confirmAdd : alert.type === 'edit' ? handleSaveEdit : confirmDelete}
                    >
                        {alert.type === 'add' ? 'ยืนยันการเพิ่ม' : alert.type === 'edit' ? 'บันทึกการแก้ไข' : 'ยืนยันการลบ'}
                    </button>
                    <button className="jewelry-alert-btn secondary" onClick={closeAlert}>
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