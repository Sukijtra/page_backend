'use client'

import React, { useState, useEffect } from 'react';
import {
  Gem, Layers, Plus, Search, Filter, Edit3, Trash2, X, ChevronDown,
  Package, Database, Sparkle
} from 'lucide-react';
import { Sidebar } from "@/components/sidebar"
import '@/app/css/products.css';
import { useSearchParams, useRouter } from 'next/navigation';

const API = "http://localhost:8080";



const Button = ({ children, className = "", variant = "primary", ...props }: any) => (
  <button className={`btn btn-${variant} ${className}`} {...props}>
    {children}
  </button>
);



const Input = ({ className = "", value, ...props }: any) => (
  <input
    className={`custom-input ${className}`}
    {...props}
    value={value ?? ''}
  />
);

export default function JewelryManagementPage() {


  const [activeTab, setActiveTab] = useState<'products'>('products');

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const DIAMOND_SHAPES = ["กลม", "ทรงไข่", "ทรงหยดน้ำ", "เอเมอรัลด์คัท", "พรินเซสคัท", "มาร์คีส์", "เรเดียนท์คัท", "คุชชั่นคัท"];
  const CLARITY_OPTIONS = ["I1", "SI2", "SI1", "VS2", "VS1", "VVS2", "VVS1", "IF", "FL"];
  const COLOR_OPTIONS = ["K(93)", "J(94)", "I(95)", "H(96)", "G(97)", "F(98)", "E(99)", "D(100)"];
  const RING_STYLES = ["เม็ดเดี่ยว", "บ่าข้าง", "ล้อมเพชร", "ล้อมซ่อนฐาน", "เพชรข้าง", "ดีไซน์ธรรมชาติ"];
  const EARRING_TYPES = ["ต่างหูเม็ดเดี่ยว", "ต่างหูห่วง", "ต่างหูห้อยระย้า"];
  const METAL_COLORS = ["ทองขาว", "ทองคำ", "ทองชมพู", "ทองวานิลลา"];
  const METAL_OPTIONS = ["18K", "10K", "9K"];

  const [metalColors, setMetalColors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ประเภทเครื่องประดับทั้งหมด');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [shapeFilter, setShapeFilter] = useState('รูปทรงเพชรทั้งหมด');

  useEffect(() => {
    fetch(`${API}/metal_categories`)
      .then(res => res.json())
      .then(data => {
        console.log("metal data:", data);
        // ตรวจสอบโครงสร้าง Response จาก Backend
        if (Array.isArray(data)) {
          setMetalColors(data);
        } else if (data && Array.isArray(data.data)) {
          setMetalColors(data.data);
        } else {
          setMetalColors([]);
        }
      })
      .catch(err => {
        console.error(err);
        setMetalColors([]);
      });
  }, []);

  interface ProductType {
    product_type_id: number;
    product_type_name: string;
  }

  const [categories, setCategories] = useState<ProductType[]>([]);
  useEffect(() => {
    fetch(`${API}/product-types`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [newProduct, setNewProduct] = useState({
    product_name: '',
    product_type: '',
    price: '',
    description: '',
    status: 1,

    diamond_shape: '',
    diamond_origin: '',
    clarity: '',
    color: '',
    carat: '',
    ring_style: '',
    earring_type: '',
    metal_color: '',
    metal_option: '',


    images: [] as string[]
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [popup, setPopup] = useState<{
    type: 'success' | 'error' | 'confirm' | null;
    message: string;
    onConfirm?: () => void;
  }>({
    type: null,
    message: ''
  });

  const showPopup = (
    type: 'success' | 'error' | 'confirm',
    message: string,
    onConfirm?: () => void
  ) => {
    setPopup({ type, message, onConfirm });
  };

  const closePopup = () => {
    setPopup({ type: null, message: '' });
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/products`)
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const result = (products || []).filter((p) => {
      const matchSearch = (p.product_name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = categoryFilter === 'ประเภทเครื่องประดับทั้งหมด' || p.category_name === categoryFilter;
      const matchStatus = statusFilter === 'all' ? true : statusFilter === 'open' ? p.status === 1 : p.status === 0;

      let matchShape = true;
      if (shapeFilter !== 'รูปทรงเพชรทั้งหมด') {
        try {
          const specs = typeof p.product_detail === 'string' ? JSON.parse(p.product_detail) : p.product_detail;
          matchShape = specs?.diamond_shape === shapeFilter;
        } catch (e) {
          matchShape = false;
        }
      }

      return matchSearch && matchCat && matchStatus && matchShape;
    });
    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, statusFilter, shapeFilter]);

  const handleEdit = (product: any) => {
    setEditingProduct(product);

    let specs = {
      diamond_shape: '',
      diamond_origin: '',
      clarity: '',
      color: '',
      carat: '',
      ring_style: '',
      earring_type: '',
      metal_color: '',
      metal_option: '',
    };

    if (product.product_detail) {
      try {
        const parsed = typeof product.product_detail === 'string' ? JSON.parse(product.product_detail) : product.product_detail;
        specs = { ...specs, ...parsed };
      } catch (e) {
        console.error("Error parsing specs", e);
      }
    }

    setNewProduct({
      product_name: product.product_name,
      product_type: product.category_name,
      price: product.price.toString(),
      description: product.description || '',
      status: product.status,

      diamond_shape: specs.diamond_shape || '',
      diamond_origin: specs.diamond_origin || '',
      clarity: specs.clarity || '',
      color: specs.color || '',
      carat: specs.carat || '',
      ring_style: specs.ring_style || '',
      earring_type: specs.earring_type || '',
      metal_color: specs.metal_color || '',
      metal_option: specs.metal_option || '',

      images: []
    });


    if (product.image_url) {
      const mainImg = product.image_url.startsWith('http')
        ? product.image_url
        : `${API}/static/uploads/${product.image_url}`;
    }

    setIsModalOpen(true);
  };

  const handleToggleStatus = async (id: number) => {
    const product = products.find(p => p.product_id === id);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/products/${id}/toggle-status`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          product_name: product.product_name,
          price: product.price,
          status: product.status === 1 ? 0 : 1
        })
      });

      if (res.ok) {
        setProducts(prev =>
          prev.map(p =>
            p.product_id === id ? { ...p, status: p.status === 1 ? 0 : 1 } : p
          )
        );
      }
    } catch (err) {
      showPopup('error', 'ไม่สามารถอัปเดตสถานะได้');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/products/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.product_id !== id));
        showPopup('success', 'ลบสินค้าสำเร็จ');
      } else {
        showPopup('error', 'ไม่สามารถลบสินค้าได้');
      }
    } catch (err) {
      showPopup('error', 'เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...files]);

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!newProduct.product_name || !newProduct.product_type || !newProduct.price) {
      showPopup('error', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    try {

      const imageNames = imageFiles.map(file => file.name);

      const productToSave = {
        product_name: newProduct.product_name,
        price: parseFloat(newProduct.price),


        product_detail: JSON.stringify({
          diamond_shape: newProduct.diamond_shape,
          diamond_origin: newProduct.diamond_origin,
          clarity: newProduct.clarity,
          color: newProduct.color,
          carat: newProduct.carat,
          ring_style: newProduct.ring_style,
          earring_type: newProduct.earring_type,
          metal_color: newProduct.metal_color,
          metal_option: newProduct.metal_option,
        }),


        product_type_id: categories.find(c => c.product_type_name === newProduct.product_type)?.product_type_id || 1,

        product_production_day: 1,
        quantity: 1,


        product_image: imageFiles.length > 0 ? imageFiles[0].name : ""
      };
      const url = editingProduct
        ? `${API}/products/${editingProduct.product_id}`
        : `${API}/products`;

      const method = editingProduct ? 'PUT' : 'POST';

      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productToSave)
      });

      if (!res.ok) throw new Error("Failed to save");

      showPopup('success', editingProduct ? 'อัปเดตข้อมูลสินค้าเรียบร้อยแล้ว' : 'บันทึกสินค้าเรียบร้อยแล้ว');
      setIsModalOpen(false);
      resetForm();
      loadData();
    } catch (err) {
      showPopup('error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setNewProduct({
      product_name: '',
      product_type: '',
      price: '',
      description: '',
      status: 1,
      diamond_shape: '',
      diamond_origin: '',
      clarity: '',
      color: '',
      carat: '',
      ring_style: '',
      earring_type: '',
      metal_color: '',
      metal_option: '',
      images: []
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const renderTypeSpecificFields = () => {
    const type = newProduct.product_type;

    return (
      <div className="animate-fade-in space-y-4 mt-6 border-t pt-6">

        {(type === 'เพชร' || type === 'แหวนเพชร' || type === 'ต่างหู' || type === 'สร้อยคอพร้อมจี้' || type === 'กำไลเพชร') && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">ประเภทเพชร</label>
              <select
                className="custom-select"
                value={newProduct.diamond_origin}
                onChange={e => setNewProduct({ ...newProduct, diamond_origin: e.target.value })}
              >
                <option value="">เลือกประเภท...</option>
                <option value="เพชรธรรมชาติ">เพชรธรรมชาติ</option>
                <option value="เพชรแล็บ">เพชรแล็บ</option>
              </select>
            </div>
            {(type === 'เพชร' || type === 'แหวนเพชร') && (
              <div className="form-group">
                <label className="form-label">กะรัต</label>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="เช่น 1.05"
                  value={newProduct.carat}
                  onChange={e => setNewProduct({ ...newProduct, carat: e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        {(type === 'เพชร' || type === 'แหวนเพชร' || type === 'ต่างหู' || type === 'สร้อยคอพร้อมจี้' || type === 'กำไลเพชร') && (
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">ความสะอาด (Clarity)</label>
              <div className="flex flex-wrap gap-2">
                {CLARITY_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, clarity: opt })}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${newProduct.clarity === opt ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">สี/น้ำ (Color)</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, color: opt })}
                    className={`px-3 py-1.5 text-xs rounded-md border transition-all ${newProduct.color === opt ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}


        {(type === 'แหวนเพชร' || type === 'ต่างหู' || type === 'เพชร' || type === 'สร้อยคอพร้อมจี้' || type === 'กำไลเพชร') && (
          <div className="form-group">
            <label className="form-label">รูปทรงเพชร</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DIAMOND_SHAPES.map(shape => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => setNewProduct({ ...newProduct, diamond_shape: shape })}
                  className={`p-2 text-xs rounded-lg border transition-all ${newProduct.diamond_shape === shape ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
        )}


        {type === 'แหวนเพชร' && (
          <div className="form-group">
            <label className="form-label">สไตล์แหวน</label>
            <div className="grid grid-cols-2 gap-2">
              {RING_STYLES.map(style => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setNewProduct({ ...newProduct, ring_style: style })}
                  className={`p-2 text-xs rounded-lg border transition-all ${newProduct.ring_style === style ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )}


        {type === 'ต่างหู' && (
          <div className="form-group">
            <label className="form-label">ประเภทต่างหู</label>
            <div className="grid grid-cols-3 gap-2">
              {EARRING_TYPES.map(etype => (
                <button
                  key={etype}
                  type="button"
                  onClick={() => setNewProduct({ ...newProduct, earring_type: etype })}
                  className={`p-2 text-xs rounded-lg border transition-all ${newProduct.earring_type === etype ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                >
                  {etype}
                </button>
              ))}
            </div>
          </div>
        )}


        {(type === 'แหวนเพชร' || type === 'ต่างหู' || type === 'สร้อยคอพร้อมจี้' || type === 'กำไลเพชร') && (
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">สีโลหะ</label>
              <select
                className="custom-select"
                value={newProduct.metal_option}
                onChange={e => setNewProduct({ ...newProduct, metal_option: e.target.value })}
              >
                <option value="">เลือกสีโลหะ...</option>
                {METAL_COLORS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">ตัวเลือกโลหะ</label>
              <select
                className="custom-select"
                value={newProduct.metal_option}
                onChange={e => setNewProduct({ ...newProduct, metal_option: e.target.value })}
              >
                <option value="">เลือกตัวเลือก...</option>
                {METAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <div className="content-wrapper">
          <div className="header-section">
            <div>
              <h1 className="header-title">จัดการสินค้า</h1>
              <p className="header-subtitle">เพิ่มและจัดการรายการสินค้าเครื่องประดับพร้อมรายละเอียดเชิงลึก</p>
            </div>
            <button className="btn btn-primary" onClick={() => { resetForm(); setIsModalOpen(true); }}>
              <Plus size={18} />
              <span>เพิ่มสินค้าใหม่</span>
            </button>
          </div>

          <div className="animate-fade-in">
            <div className="filter-grid">
              <div className="input-wrapper">
                <Search className="input-icon left" size={18} />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อสินค้า..."
                  className="custom-input with-left-icon"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="input-wrapper">
                <Filter className="input-icon left" size={18} />
                <select
                  className="custom-select with-left-icon"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="ประเภทเครื่องประดับทั้งหมด">ประเภทเครื่องประดับทั้งหมด</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.product_type_name}>{cat.product_type_name}</option>
                  ))}
                </select>
                <ChevronDown className="input-icon right" size={18} />
              </div>
              <div className="input-wrapper">
                <Database className="input-icon left" size={18} />
                <select
                  className="custom-select with-left-icon"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="open">เปิดใช้งาน</option>
                  <option value="closed">ปิดใช้งาน</option>
                </select>
                <ChevronDown className="input-icon right" size={18} />
              </div>

              <div className="input-wrapper">
                <Gem className="input-icon left" size={18} />
                <select
                  className="custom-select with-left-icon"
                  value={shapeFilter}
                  onChange={(e) => setShapeFilter(e.target.value)}
                >
                  <option value="รูปทรงเพชรทั้งหมด">รูปทรงเพชรทั้งหมด</option>
                  {DIAMOND_SHAPES.map((shape, idx) => (
                    <option key={idx} value={shape}>{shape}</option>
                  ))}
                </select>
                <ChevronDown className="input-icon right" size={18} />
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ข้อมูลสินค้า</th>
                    <th>ราคา</th>
                    <th>หมวดหมู่</th>
                    <th className="text-center">สถานะ</th>
                    <th className="text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={5} className="text-center py-10">กำลังโหลด...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10">ไม่พบข้อมูลสินค้า</td></tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.product_id}>
                        <td>
                          <div className="product-cell">
                            <div className="product-icon-box">
                              {p.image_url ? (
                                <img src={p.image_url.startsWith('http')
                                  ? p.image_url
                                  : `${API.replace('/api', '')}/static/uploads/${p.image_url}`}

                                  className="w-full h-full object-cover rounded-md" />
                              ) : <Gem size={20} className="text-gray-400" />}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{p.product_name}</div>
                              <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-400">ID: #{p.product_id}</span>
                                {p.product_detail && (
                                  <span className="text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                                    {(() => {
                                      try {
                                        const specs = typeof p.product_detail === 'string' ? JSON.parse(p.product_detail) : p.product_detail;
                                        return specs?.diamond_shape || '';
                                      } catch (e) { return ''; }
                                    })()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="font-semibold">{p.price.toLocaleString()} ฿</td>
                        <td>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                            {p.category_name || 'ไม่ได้ระบุ'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button onClick={() => handleToggleStatus(p.product_id)} className="toggle-switch" style={{ backgroundColor: p.status === 1 ? '#10B981' : '#D1D5DB' }}>
                            <span className="toggle-dot" style={{ transform: p.status === 1 ? 'translateX(1.25rem)' : 'translateX(0.25rem)' }} />
                          </button>
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button className="btn-ghost p-2 rounded-full hover:bg-gray-100" onClick={() => handleEdit(p)}><Edit3 size={18} /></button>
                            <button className="btn-danger p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500" onClick={() => handleDelete(p.product_id)}><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>


      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-xl font-bold">{editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
              <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">ชื่อสินค้า</label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="เช่น แหวนเพชรเม็ดเดี่ยว 18K"
                    value={newProduct.product_name}
                    onChange={e => setNewProduct({ ...newProduct, product_name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ประเภทสินค้า</label>
                  <select
                    className="custom-select"
                    value={newProduct.product_type}
                    onChange={e => setNewProduct({ ...newProduct, product_type: e.target.value })}
                  >
                    <option value="">เลือกประเภท...</option>
                    <option value="เพชร">เพชร</option>
                    <option value="แหวน">แหวน</option>
                    <option value="แหวนเพชร">แหวนเพชร</option>
                    <option value="ต่างหู">ต่างหู</option>
                    <option value="สร้อยคอพร้อมจี้">สร้อยคอพร้อมจี้</option>
                    <option value="กำไลเพชร">กำไลเพชร</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">ราคา (บาท)</label>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
              </div>

              {renderTypeSpecificFields()}

              <div className="form-group mt-6">
                <label className="form-label">รายละเอียดเพิ่มเติม</label>
                <textarea
                  className="custom-input min-h-[100px]"
                  placeholder="ระบุรายละเอียดสินค้า..."
                  value={newProduct.description}
                  onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">รูปภาพสินค้า (อัปโหลดได้หลายรูป)</label>
                <div className="image-upload-container">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="image-preview">
                      <img src={preview} alt="preview" />
                      <button className="remove-image" onClick={() => removeImage(idx)}><X size={14} /></button>
                    </div>
                  ))}
                  <label className="upload-placeholder">
                    <Plus size={24} />
                    <span className="text-[10px] mt-1">เพิ่มรูป</span>
                    <input type="file" multiple className="hidden-input" onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="btn btn-primary flex-1 py-3" onClick={handleSubmit}>
                  {editingProduct ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลสินค้า'}
                </button>
                <button className="btn btn-outline flex-1 py-3" onClick={() => setIsModalOpen(false)}>ยกเลิก</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {popup.type && (
        <div className="modal-overlay">
          <div className="modal-content max-w-sm p-6 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${popup.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
              {popup.type === 'success' ? <Package size={24} /> : <X size={24} />}
            </div>
            <h3 className="text-lg font-bold mb-2">{popup.type === 'success' ? 'สำเร็จ!' : 'แจ้งเตือน'}</h3>
            <p className="text-gray-600 mb-6">{popup.message}</p>
            <button className="btn btn-primary w-full" onClick={closePopup}>ตกลง</button>
          </div>
        </div>
      )}
    </div>
  );
}