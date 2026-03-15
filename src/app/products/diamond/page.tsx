'use client'

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Plus, Edit3, Trash2, LayoutGrid, Palette, Gem, Box } from "lucide-react"
import "@/app/css/diamond-category.css"

interface DiamondCategory {
  id: number;
  name: string;
  status: number; // 1 = open, 0 = closed
}

type GroupType = 'shape' | 'clarity' | 'color';

export default function DiamondCategoryPage() {
  // 1. Shapes
  const [shapes, setShapes] = useState<DiamondCategory[]>([]);
  useEffect(() => {
    const fetchShapes = async () => {
      try {
        const res = await fetch("http://localhost:8080/diamond-shapes");
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: item.diamond_shape_id,
          name: item.diamond_shape_name,
          status: item.status ?? 1
        }));

        setShapes(formatted);
      } catch (error) {
        console.error("โหลด shapes ไม่สำเร็จ", error);
      }
    };

    fetchShapes();
  }, []);
  // 2. Clarity (ความสะอาด)
  const [clarity, setClarity] = useState<DiamondCategory[]>([
    { id: 101, name: "I1", status: 1 },
    { id: 102, name: "SI2", status: 1 },
    { id: 103, name: "SI1", status: 1 },
    { id: 104, name: "VS2", status: 1 },
    { id: 105, name: "VS1", status: 1 },
    { id: 106, name: "VVS2", status: 1 },
    { id: 107, name: "VVS1", status: 1 },
    { id: 108, name: "IF", status: 1 },
    { id: 109, name: "FL", status: 1 }
  ]);

  // 3. Color (น้ำ/สี)
  const [colors, setColors] = useState<DiamondCategory[]>([
    { id: 201, name: "K(93)", status: 1 },
    { id: 202, name: "J(94)", status: 1 },
    { id: 203, name: "I(95)", status: 1 },
    { id: 204, name: "H(96)", status: 1 },
    { id: 205, name: "G(97)", status: 1 },
    { id: 206, name: "F(98)", status: 1 },
    { id: 207, name: "E(99)", status: 1 },
    { id: 208, name: "D(100)", status: 1 }
  ]);

  const [searchShapes, setSearchShapes] = useState("");
  const [searchClarity, setSearchClarity] = useState("");
  const [searchColors, setSearchColors] = useState("");


  const [alert, setAlert] = useState<{
    type: 'edit' | 'delete' | 'add' | 'success' | null,
    item: DiamondCategory | null,
    group: GroupType
  }>({ type: null, item: null, group: 'shape' });

  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  const filteredShapes = shapes.filter(s => s.name.toLowerCase().includes(searchShapes.toLowerCase()));
  const filteredClarity = clarity.filter(c => c.name.toLowerCase().includes(searchClarity.toLowerCase()));
  const filteredColors = colors.filter(c => c.name.toLowerCase().includes(searchColors.toLowerCase()));

  const handleToggleStatus = async (id: number, group: GroupType, currentStatus: number) => {

    const newStatus = currentStatus === 1 ? 0 : 1;

    if (group === "shape") {
      await fetch(`http://localhost:8080/diamond-shapes/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      setShapes(prev =>
        prev.map(shape =>
          shape.id === id ? { ...shape, status: newStatus } : shape
        )
      );
    }

    else if (group === "clarity") {
      setClarity(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }

    else if (group === "color") {
      setColors(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }
  };

  const handleEdit = (item: DiamondCategory, group: GroupType) => {
    setEditName(item.name);
    setAlert({ type: 'edit', item, group });
  };

  const handleDelete = (item: DiamondCategory, group: GroupType) => {
    setAlert({ type: 'delete', item, group });
  };

  const handleAdd = (group: GroupType) => {
    setNewName("");
    setAlert({ type: 'add', item: null, group });
  };

  const confirmDelete = () => {
    if (alert.item) {
      const filter = (prev: DiamondCategory[]) => prev.filter(t => t.id !== alert.item!.id);
      if (alert.group === 'shape') setShapes(filter);
      else if (alert.group === 'clarity') setClarity(filter);
      else if (alert.group === 'color') setColors(filter);

      setAlert(prev => ({ ...prev, type: 'success' }));
      setTimeout(closeAlert, 1500);
    }
  };

  const handleSaveEdit = () => {
    if (alert.item && editName.trim()) {
      const update = (prev: DiamondCategory[]) => prev.map(t => t.id === alert.item!.id ? { ...t, name: editName } : t);
      if (alert.group === 'shape') setShapes(update);
      else if (alert.group === 'clarity') setClarity(update);
      else if (alert.group === 'color') setColors(update);

      setAlert(prev => ({ ...prev, type: 'success' }));
      setTimeout(closeAlert, 1500);
    }
  };

  const confirmAdd = () => {
    if (newName.trim()) {
      const getNextId = (list: DiamondCategory[], start: number) => list.length > 0 ? Math.max(...list.map(t => t.id)) + 1 : start;
      const newItem = (id: number) => ({ id, name: newName.trim(), status: 1 });

      if (alert.group === 'shape') setShapes(prev => [...prev, newItem(getNextId(shapes, 1))]);
      else if (alert.group === 'clarity') setClarity(prev => [...prev, newItem(getNextId(clarity, 101))]);
      else if (alert.group === 'color') setColors(prev => [...prev, newItem(getNextId(colors, 201))]);

      setAlert(prev => ({ ...prev, type: 'success' }));
      setTimeout(closeAlert, 1500);
    }
  };

  const closeAlert = () => {
    setAlert({ type: null, item: null, group: 'shape' });
    setEditName("");
    setNewName("");
  };

  const getGroupNameTH = (group: GroupType) => {
    if (group === 'shape') return 'รูปทรงเพชร';
    if (group === 'clarity') return 'ความสะอาด';
    return 'น้ำ/สี';
  };

  const renderCard = (
    title: string,
    items: DiamondCategory[],
    searchValue: string,
    onSearch: (v: string) => void,
    group: GroupType,
    icon: React.ReactNode
  ) => (
    <div className="diamond-card">
      <div className="diamond-card-header">
        <h2 className="diamond-card-title">{icon}{title}</h2>
        <button className="diamond-btn-add-sm" onClick={() => handleAdd(group)}>
          <Plus size={16} />
          <span>เพิ่ม</span>
        </button>
      </div>

      <div className="diamond-card-filter">
        <div className="diamond-card-search text-gray-400">
          <Search size={16} />
          <input
            type="text"
            placeholder={`ค้นหา${title}...`}
            className="diamond-card-search-input"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="diamond-card-table-container">
        <table className="diamond-card-data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>ID</th>
              <th>ชื่อ</th>
              <th style={{ width: '60px', textAlign: 'center' }}>สถานะ</th>
              <th style={{ width: '60px', textAlign: 'right' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="text-gray-400">#{item.id}</td>
                <td className="font-medium">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {item.name}
                    <span className={`diamond-status-indicator ${item.status === 1 ? 'open' : 'closed'}`}>
                      {item.status === 1 ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                  </div>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <label className="diamond-switch">
                    <input
                      type="checkbox"
                      checked={item.status === 1}
                      onChange={() => handleToggleStatus(item.id, group, item.status)} />
                    <span className="diamond-slider"></span>
                  </label>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                    <button className="diamond-action-btn edit" onClick={() => handleEdit(item, group)}><Edit3 size={14} /></button>
                    <button className="diamond-action-btn delete" onClick={() => handleDelete(item, group)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="diamond-page-container">
      <Sidebar />

      <main className="diamond-main-content">
        <div className="diamond-content-wrapper">
          <div className="diamond-header-section" style={{ marginBottom: '2.5rem' }}>
            <div>
              <h1 className="diamond-header-title">จัดการหมวดหมู่เพชร</h1>
              <p className="diamond-header-subtitle">จัดการคุณลักษณะของเพชร (ทรง, ความสะอาด, สี) แยกตามกลุ่ม</p>
            </div>
          </div>

          <div className="diamond-cards-grid">
            {renderCard("รูปทรงเพชร", filteredShapes, searchShapes, setSearchShapes, 'shape', <Gem size={20} className="text-blue-500" />)}
            {renderCard("ความสะอาด", filteredClarity, searchClarity, setSearchClarity, 'clarity', <Box size={20} className="text-emerald-500" />)}
            {renderCard("น้ำ/สี", filteredColors, searchColors, setSearchColors, 'color', <Palette size={20} className="text-amber-500" />)}
          </div>
        </div>
      </main>

      {alert.type && (
        <div className="diamond-modal-overlay" onClick={closeAlert}>
          <div className="diamond-alert-card" onClick={e => e.stopPropagation()}>
            {alert.type === 'success' ? (
              <>
                <div className="diamond-alert-icon edit" style={{ background: '#ECFDF5', color: '#10B981' }}>
                  <LayoutGrid size={24} />
                </div>
                <h3 className="diamond-alert-title">สำเร็จ!</h3>
                <p className="diamond-alert-text">ดำเนินการเรียบร้อยแล้ว</p>
              </>
            ) : (
              <>
                <div className={`diamond-alert-icon ${alert.type === 'add' ? 'edit' : alert.type}`}>
                  {alert.type === 'add' ? <Plus size={24} /> : alert.type === 'edit' ? <Edit3 size={24} /> : <Trash2 size={24} />}
                </div>
                <h3 className="diamond-alert-title">
                  {alert.type === 'add' ? `เพิ่ม${getGroupNameTH(alert.group)}` : alert.type === 'edit' ? `แก้ไข${getGroupNameTH(alert.group)}` : 'ยืนยันการลบ'}
                </h3>

                <div className="diamond-alert-text">
                  {alert.type === 'add' ? (
                    <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อรายการใหม่</label>
                      <input
                        type="text" className="custom-input"
                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%' }}
                        value={newName} onChange={(e) => setNewName(e.target.value)}
                        placeholder={`ระบุ${getGroupNameTH(alert.group)}...`} autoFocus
                      />
                    </div>
                  ) : alert.type === 'edit' ? (
                    <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">ชื่อใหม่</label>
                      <input
                        type="text" className="custom-input"
                        style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%' }}
                        value={editName} onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                    </div>
                  ) : (
                    `คุณแน่ใจหรือไม่ว่าต้องการลบ "${alert.item?.name}"?`
                  )}
                </div>

                <button className="diamond-alert-btn primary" onClick={alert.type === 'add' ? confirmAdd : alert.type === 'edit' ? handleSaveEdit : confirmDelete}>
                  {alert.type === 'add' ? 'ยืนยันการเพิ่ม' : alert.type === 'edit' ? 'บันทึกการแก้ไข' : 'ยืนยันการลบ'}
                </button>
                <button className="diamond-alert-btn secondary" onClick={closeAlert}>ยกเลิก</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
