'use client'

import React, { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Plus, Edit3, Trash2, LayoutGrid, Palette, Gem, Box } from "lucide-react"
import "@/app/css/diamond-category.css"
const API = "http://localhost:8080";
interface DiamondCategory {
  id: number;
  name: string;
  status: number; 
}

type GroupType = 'shape' | 'clarity' | 'color';

export default function DiamondCategoryPage() {
  
  const [shapes, setShapes] = useState<DiamondCategory[]>([]);
  useEffect(() => {
    const fetchShapes = async () => {
      try {
        const res = await fetch(`${API}/diamond-shapes`)
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: item.diamond_shape_id,
          name: item.diamond_shape_name,
          status: Number(item.status)
        }));

        setShapes(formatted);
      } catch (error) {
        console.error("โหลด shapes ไม่สำเร็จ", error);
      }
    };

    fetchShapes();
  }, []);
  
  const [clarity, setClarity] = useState<DiamondCategory[]>([]);
  useEffect(() => {
    const fetchClarity = async () => {
      try {

        const res = await fetch(`${API}/diamond-clarity`);
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.clarity_grade,
          status: Number(item.status)
        }));

        setClarity(formatted);

      } catch (error) {
        console.error("โหลด clarity ไม่สำเร็จ", error);
      }
    };

    fetchClarity();

  }, []);

  
  const [colors, setColors] = useState<DiamondCategory[]>([]);
  useEffect(() => {

    const fetchColors = async () => {

      try {

        const res = await fetch(`${API}/diamond-colors`)
        const data = await res.json();

        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.color_grade,
          status: Number(item.status)
        }));

        setColors(formatted);

      } catch (error) {

        console.error("โหลด colors ไม่สำเร็จ", error);

      }
    };

    fetchColors();

  }, []);

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

     await fetch(`${API}/diamond-shapes/${id}/status`, {
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

      await fetch(`${API}/diamond-clarity/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      setClarity(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    }

    else if (group === "color") {

      await fetch(`${API}/diamond-colors/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

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

  const confirmDelete = async () => {

  if (!alert.item) return;

  try {

    if (alert.group === "shape") {

      await fetch(`${API}/diamond-shapes/${alert.item.id}`, {
        method: "DELETE"
      });

    }

    else if (alert.group === "clarity") {

      await fetch(`${API}/diamond-clarity/${alert.item.id}`, {
        method: "DELETE"
      });

    }

    else if (alert.group === "color") {

      await fetch(`${API}/diamond-colors/${alert.item.id}`, {
        method: "DELETE"
      });

    }

    location.reload();

  } catch (error) {
    console.error("ลบไม่สำเร็จ", error);
  }

};

  const handleSaveEdit = async () => {

  if (!alert.item || !editName.trim()) return;

  try {

    if (alert.group === "shape") {

      await fetch(`${API}/diamond-shapes/${alert.item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diamond_shape_name: editName
        })
      });

    }

    else if (alert.group === "clarity") {

      await fetch(`${API}/diamond-clarity/${alert.item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clarity_grade: editName,
          clarity_score: 0
        })
      });

    }

    else if (alert.group === "color") {

      await fetch(`${API}/diamond-colors/${alert.item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          color_grade: editName,
          color_score: 0
        })
      });

    }

    location.reload();

  } catch (error) {
    console.error("แก้ไขไม่สำเร็จ", error);
  }

};

  const confirmAdd = async () => {

  if (!newName.trim()) return;

  try {

    if (alert.group === "shape") {

      await fetch(`${API}/diamond-shapes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diamond_shape_name: newName
        })
      });

    }

    else if (alert.group === "clarity") {

      await fetch(`${API}/diamond-clarity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clarity_grade: newName,
          clarity_score: 0
        })
      });

    }

    else if (alert.group === "color") {

      await fetch(`${API}/diamond-colors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          color_grade: newName,
          color_score: 0
        })
      });

    }

    location.reload();

  } catch (error) {
    console.error("เพิ่มข้อมูลไม่สำเร็จ", error);
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
              <p className="diamond-header-subtitle">จัดการคุณลักษณะของเพชร (ทรง, ความสะอาด, สี) </p>
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
