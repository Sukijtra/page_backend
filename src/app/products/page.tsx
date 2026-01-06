'use client'

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Gem, 
  ShoppingCart, 
  FileText, 
  Users, 
  Star, 
  Settings, 
  Layers,
  DollarSign,
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit3, 
  Trash2, 
  PackageCheck,
  Check, 
  X, 
  Eye, 
  ChevronDown,
  Boxes,
  Shapes,
  Image as ImageIcon
} from 'lucide-react';
import { Sidebar } from '../../../components/sidebar';

// --- Types (Adapted from your ProductManagement.tsx) ---
type Product = {
  id: number;
  name: string;
  category: string;
  material: string;
  karat: string;
  price: number;
  stock: number;
  status: boolean;
  image: string;
};

type Category = { id: number; name: string; status: boolean };
type Material = { id: number; name: string; status: boolean };

// --- Mock Data ---
const initialProducts: Product[] = [
  { id: 1, name: "แหวนเพชรเม็ดเดี่ยว 1 กะรัต", category: "แหวน", material: "ทองคำขาว", karat: "18k", price: 45000, stock: 5, status: true, image: "💍" },
  { id: 2, name: "สร้อยคอทองคำพร้อมจี้", category: "สร้อยคอ", material: "ทองคำ", karat: "22k", price: 28000, stock: 0, status: false, image: "📿" },
  { id: 3, name: "ต่างหูเพชรระย้า", category: "ต่างหู", material: "ทองคำขาว", karat: "18k", price: 32000, stock: 3, status: true, image: "💎" },
  { id: 4, name: "กำไลข้อมือเกลี้ยง", category: "กำไล", material: "ทองชมพู", karat: "18k", price: 18500, stock: 8, status: true, image: "💫" },
  { id: 5, name: "จี้มรกตล้อมเพชร", category: "จี้", material: "ทองคำ", karat: "18k", price: 55000, stock: 2, status: true, image: "💚" },
];

const initialCategories: Category[] = [
  { id: 1, name: "แหวน (Rings)", status: true },
  { id: 2, name: "สร้อยคอ (Necklaces)", status: true },
  { id: 3, name: "ต่างหู (Earrings)", status: true },
  { id: 4, name: "กำไล (Bracelets)", status: true },
];

const initialMaterials: Material[] = [
  { id: 1, name: "ทองคำ (Gold)", status: true },
  { id: 2, name: "ทองคำขาว (White Gold)", status: true },
  { id: 3, name: "ทองชมพู (Rose Gold)", status: true },
  { id: 4, name: "แพลตตินัม (Platinum)", status: true },
];

// --- Main Content Component ---

const ProductManagement = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'materials'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);

    const toggleCategoryStatus = (id: number) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, status: !cat.status } : cat
      )
    );
  };
// --- Components ---

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
// --- Sub-Components for Product Page ---
const StatusSwitch = ({ status, onToggle }: { status: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
      ${status ? 'bg-emerald-500' : 'bg-gray-300'}`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
        ${status ? 'translate-x-6' : 'translate-x-1'}`}
    />
  </button>
);

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors
      ${active 
        ? 'border-gray-900 text-gray-900' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);


  // Handlers (Mock logic)
  const toggleProductStatus = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: !p.status } : p));
  };

  const deleteProduct = (id: number) => {
    if (confirm("ยืนยันการลบสินค้า?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">จัดการเครื่องประดับ</h2>
          <p className="text-gray-500 text-sm mt-1">จัดการสินค้า หมวดหมู่ และวัสดุภายในร้าน</p>
        </div>
        <button className="bg-gray-900 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
          <Plus className="w-4 h-4" />
          เพิ่มสินค้าใหม่
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-2 flex">
        <TabButton 
          active={activeTab === 'products'} 
          onClick={() => setActiveTab('products')} 
          icon={Gem} 
          label="รายการสินค้า" 
        />
        <TabButton 
          active={activeTab === 'categories'} 
          onClick={() => setActiveTab('categories')} 
          icon={Layers} 
          label="หมวดหมู่" 
        />
      </div>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <StatCard 
          title="สิ้นค้าทั้งหมด (ชิ้น)" 
          value="3" 
          //growth="+20%" 
          //trend="up" 
          icon={Layers}
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatCard 
          title="วัสดุทองคำขาวทั้งหมด (ชิ้น)" 
          value="50" 
          growth="+15%" 
          trend="up" 
          icon={PackageCheck}
          colorClass="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          title="วัสดุทองคำทั้งหมด (ชิ้น)" 
          value="85" 
          growth="+15%" 
          trend="up" 
          icon={PackageCheck}
          colorClass="bg-emerald-50 text-emerald-600"
          />
        <StatCard 
          title="วัสดุทองชมพูทั้งหมด (ชิ้น)" 
          value="55" 
          growth="+15%" 
          trend="up" 
          icon={PackageCheck}
          colorClass="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 min-h-[500px] p-6">
        
        {/* --- Tab: Product List --- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อสินค้า, รหัส, หมวดหมู่..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  ตัวกรอง
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <ChevronDown className="w-4 h-4" />
                  สถานะ
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">สินค้า</th>
                    <th className="px-6 py-4">หมวดหมู่</th>
                    <th className="px-6 py-4">วัสดุ</th>
                    <th className="px-6 py-4 text-right">ราคา</th>
                    <th className="px-6 py-4 text-center">คงเหลือ</th>
                    <th className="px-6 py-4">สถานะ</th>
                    <th className="px-6 py-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl border border-gray-200">
                            {product.image}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-400">ID: #PROD-{product.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.material} <span className="text-gray-400 text-xs ml-1">({product.karat})</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        ฿{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium 
                          ${product.stock === 0 ? 'bg-red-100 text-red-700' : product.stock < 5 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                          {product.stock === 0 ? 'หมด' : `${product.stock} ชิ้น`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusSwitch
                          status={product.status}
                          onToggle={() => toggleProductStatus(product.id)}
                        />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="แก้ไข">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="ลบ">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Mockup */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
               <p className="text-xs text-gray-500">แสดง 1-5 จากทั้งหมด 24 รายการ</p>
               <div className="flex gap-1">
                 <button className="px-3 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-50" disabled>ก่อนหน้า</button>
                 <button className="px-3 py-1 text-xs border bg-gray-900 text-white rounded">1</button>
                 <button className="px-3 py-1 text-xs border rounded hover:bg-gray-50">2</button>
                 <button className="px-3 py-1 text-xs border rounded hover:bg-gray-50">3</button>
                 <button className="px-3 py-1 text-xs border rounded hover:bg-gray-50">ถัดไป</button>
               </div>
            </div>
          </div>
        )}

        {/* --- Tab: Categories --- */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">หมวดหมู่หลัก</h3>
                <button className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                  <Plus className="w-3 h-3" /> เพิ่มหมวดหมู่
                </button>
              </div>
              <div className="border rounded-xl divide-y divide-gray-100 overflow-hidden">
                {categories.map(cat => (
                  <div key={cat.id} className="p-4 flex items-center justify-between bg-white hover:bg-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100">
                      <StatusSwitch
                      status={cat.status}
                      onToggle={() => toggleCategoryStatus(cat.id)}
/>

                      <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500"><Edit3 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Placeholder for Subcategories or visual balance */}
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
               <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
               <p className="text-sm">เลือกหมวดหมู่หลักเพื่อดูหมวดหมู่ย่อย</p>
            </div>
          </div>
        )}

        {/* --- Tab: Materials --- */}
        {activeTab === 'materials' && (
           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="font-semibold text-gray-900">รายการวัสดุ (Materials)</h3>
                 <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50">
                    จัดการ Karat / Purity
                 </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {materials.map(mat => (
                    <div key={mat.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow relative group">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3 mb-3">
                             <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                                <Shapes className="w-5 h-5" />
                             </div>
                             <div>
                                <h4 className="font-medium text-gray-900">{mat.name}</h4>
                                <p className="text-xs text-gray-500">4 รูปแบบ (Karats)</p>
                             </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4">
                             <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-5 h-5" /></button>
                          </div>
                       </div>
                       <div className="flex gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-600">14k</span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-600">18k</span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-600">22k</span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-600">24k</span>
                       </div>
                    </div>
                 ))}
                 <button className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all h-full min-h-[120px]">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">เพิ่มวัสดุใหม่</span>
                 </button>
              </div>
           </div>
        )}

      </div>
    </div>
  );
};

// --- App Container ---
export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900 flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <ProductManagement />
      </main>
    </div>
  );
}