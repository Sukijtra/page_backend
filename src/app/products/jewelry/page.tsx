'use client'

import React, { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Search, Plus, Edit3, Trash2, LayoutGrid, X, AlertCircle, Filter, ChevronDown, Database, Layers } from "lucide-react"
import "@/app/css/jewelry-category.css"

const API = "http://localhost:8080";

interface JewelryCategory {
  id: number;
  name: string;
  group: string;
  status: number;
}

export default function JewelryCategoryPage() {
  const initialCategories: JewelryCategory[] = [
    // กลุ่มต่างหูเพชร (id: 2 ใน DB)
    { id: 1, name: "ต่างหูเม็ดเดี่ยว", group: "ต่างหูเพชร", status: 1 },
    { id: 2, name: "ต่างหูห่วง", group: "ต่างหูเพชร", status: 1 },
    { id: 3, name: "ต่างหูห้อยระย้า", group: "ต่างหูเพชร", status: 1 },
    { id: 4, name: "ดีไซน์ธรรมชาติ", group: "ต่างหูเพชร", status: 1 },

    // กลุ่มสร้อยคอเพชร (id: 3 ใน DB)
    { id: 5, name: "สร้อยคอพร้อมจี้", group: "สร้อยคอเพชร", status: 1 },

    // กลุ่มกำไลเพชร (id: 4 ใน DB)
    { id: 6, name: "กำไลเพชร", group: "กำไลเพชร", status: 1 },

    // กลุ่มแหวนเพชร (id: 1 ใน DB)
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
  const [newGroup, setNewGroup] = useState("ต่างหูเพชร");
  // แก้ไขบรรทัดนี้ในไฟล์ page.tsx
  const [productTypes, setProductTypes] = useState<{ id: number; type_name: string }[]>([]); useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API}/api/product-types`); // มั่นใจว่ายิงไปที่ตัว get_all_types()
        const data = await res.json();

        // ลอง Console.log ดูที่นี่ คุณจะเห็นว่า key มันคือ "id" และ "type_name"
        console.log("Real API Data:", data);

        setProductTypes(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const groups = ["ต่างหูเพชร", "สร้อยคอเพชร", "กำไลเพชร", "แหวนเพชร"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API}/product-styles`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();


        // ใน useEffect สำหรับ fetchCategories
        const categories = data.map((item: any) => ({
          id: item.id,
          name: item.style_name,
          group: item.type_name || "ไม่ระบุ", // เก็บเป็นชื่อ String
          status: item.status
        }));

        setCategories(categories);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);
  const filteredCategories = categories.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGroup =
      groupFilter === "all" || cat.group === groupFilter;
    const matchStatus = statusFilter === "all"
      ? true
      : statusFilter === "open" ? cat.status === 1 : cat.status === 0;

    return matchSearch && matchGroup && matchStatus;
  });

  const toggleStatus = async (item: JewelryCategory) => {
    const newStatus = item.status === 1 ? 0 : 1;

    // 1. ค้นหาโดยใช้ชื่อฟิลด์ใหม่ (type_name)
    const selectedType = productTypes.find(
      pt => pt.type_name === item.group
    );

    if (!selectedType) {
      console.error("Type not found:", item.group);
      return;
    }

    // 2. ส่งข้อมูลไปยัง API โดยใช้ id จริงจาก Database
    await fetch(`${API}/product-styles/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        style_name: item.name,
        type_id: selectedType.id, // แก้เป็น .id ตาม SQL: SELECT id, type_name
        status: newStatus
      }),
    });

    // 3. อัปเดต State หน้าจอ
    setCategories(prev => prev.map(t => t.id === item.id ? { ...t, status: newStatus } : t));
  };
  const handleEdit = (item: JewelryCategory) => {
    setEditName(item.name);

    // ตรวจสอบว่า item.group ที่ได้มาจาก API เป็น "ชื่อ" หรือ "ID"
    // ถ้า item.group เป็น ID คุณต้องหาชื่อมาใส่ใน State editGroup ก่อน
    setEditGroup(String(item.group));
    setAlert({ type: 'edit', item });
  };

  const handleDelete = (item: JewelryCategory) => {
    setAlert({ type: 'delete', item });
  };

  const handleAdd = () => {
    setNewName("");
    setNewGroup("ต่างหูเพชร"); // ✅ ใส่ชื่อให้ตรงกับ DB
    setAlert({ type: 'add', item: null });
  };

  // แก้ใน closeAlert (บรรทัด 218)
  const closeAlert = () => {
    setAlert({ type: null, item: null });
    setEditName("");
    setEditGroup("");
    setNewName("");
    setNewGroup("ต่างหูเพชร"); // ✅ ใส่ชื่อให้ตรงกับ DB
  };

  const confirmDelete = async () => {
    if (alert.item) {
      try {
        const res = await fetch(`${API}/product-styles/${alert.item.id}`, { method: "DELETE" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to delete");

        setCategories(prev => prev.filter(t => t.id !== alert.item!.id));
        setAlert({ type: "success", item: null });
        setTimeout(closeAlert, 1500);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (alert.item && editName.trim() && editGroup) {
      try {
        const selectedType = productTypes.find(
          pt => (pt.type_name || "").trim() === editGroup.trim()
        );

        if (!selectedType) {
          window.alert(`ไม่พบหมวดหมู่: ${editGroup} ในระบบ`);
          return;
        }

        const res = await fetch(`${API}/product-styles/${alert.item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            style_name: editName.trim(),
            type_id: Number(selectedType.id), // ✅ มั่นใจว่าเป็นตัวเลข
            status: alert.item.status         // ✅ เพิ่มฟิลด์ status ตามที่ Python ต้องการ
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Update failed");
        }

        // อัปเดต State UI
        setCategories(prev =>
          prev.map(t =>
            t.id === alert.item!.id
              ? { ...t, name: editName.trim(), group: selectedType.type_name }
              : t
          )
        );

        setAlert({ type: "success", item: null });
        setTimeout(closeAlert, 1500);
      } catch (error) {
        console.error("Error details:", error);
      }
    }
  };
  const confirmAdd = async () => {
    if (newName.trim() && newGroup) {
      try {
        // ค้นหา ID จริงๆ จาก Database ผ่าน productTypes
        const selectedType = productTypes.find(pt => pt.type_name === newGroup);

        if (!selectedType) {
          window.alert("ไม่พบรหัสประเภทสินค้าในระบบ");
          return;
        }

        const res = await fetch(`${API}/product-styles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            style_name: newName.trim(),
            type_id: selectedType.id // ✅ ใช้ ID จริงจาก DB
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add");

        setCategories(prev => [
          ...prev,
          {
            id: data.id,
            name: newName.trim(),
            group: newGroup,
            status: 1
          }
        ]);
        setAlert({ type: "success", item: null });
        setTimeout(closeAlert, 1500);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getGroupBadgeClass = (group: string) => {
    switch (group) {
      case "ต่างหูเพชร": return "earrings";
      case "สร้อยคอเพชร": return "necklace";
      case "กำไลเพชร": return "bracelet";
      case "แหวนเพชร": return "ring";
      default: return "";
    }
  };

  return (
    <div className="jewelry-page-container">
      <Sidebar />

      <main className="jewelry-main-content">
        <div className="jewelry-content-wrapper">


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
                        <span className={`group-badge ${getGroupBadgeClass(String(item.group))}`}>
                          {item.group}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => toggleStatus(item)}
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
                          style={{ border: '1px solid #e5e7eb', padding: '0.75rem 1rem', borderRadius: '0.5rem', width: '100%', outline: 'none' }}
                          value={editGroup}
                          onChange={(e) => setEditGroup(e.target.value)}
                        >
                          {productTypes.map((pt) => (
                            <option
                              key={pt.id}
                              value={pt.type_name} // ✅ ใช้ชื่อที่ตรงกับ API (type_name)
                            >
                              {pt.type_name}
                            </option>
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