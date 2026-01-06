'use client'

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Gem, 
  ShoppingCart, 
  FileText, 
  Users, 
  FilePen,
  Star, 
  PackageCheck,
  Settings, 
  LogOut, 
  DollarSign,
  Plus, 
  Edit3, 
  Layers,
  Trash2, 
  Image as ImageIcon,
  Save,
  Megaphone,
  Info,
  Facebook,
  Instagram,
  ArrowUpRight,
  Phone,
  MapPin,
  Globe,
  X,
  UploadCloud
} from 'lucide-react';
import { Sidebar } from '../../../components/sidebar';

type ArticleCategory = 'knowledge' | 'promotion' | 'draft';

// --- Types ---
type Article = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: ArticleCategory;
};

type ShopInfo = {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  lineId: string;
  facebook: string;
  instagram: string;
  website: string;
};

// --- Mock Data ---
const initialArticles: Article[] = [
  {
    id: 1,
    title: "วิธีเลือกเพชรน้ำงาม 4Cs ที่ควรรู้",
    excerpt: "หลักการง่ายๆ ในการดูเพชรด้วยตาเปล่า และทำความเข้าใจหลัก 4Cs (Carat, Cut, Color, Clarity)",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    date: "2023-10-15",
    category: 'knowledge'
  },
  {
    id: 2,
    title: "ทองคำขาว vs แพลตตินัม ต่างกันอย่างไร?",
    excerpt: "ไขข้อข้องใจสำหรับคู่รักที่กำลังมองหาแหวนแต่งงาน เลือกวัสดุแบบไหนดีกว่ากัน",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    date: "2023-11-02",
    category: 'knowledge'
  },
//   {
//     id: 3,
//     title: "โปรโมชั่นต้อนรับวันแม่ ลดสูงสุด 30%",
//     excerpt: "มอบของขวัญล้ำค่าแทนใจ ให้กับคนที่คุณรักที่สุด ด้วยเครื่องประดับเพชรแท้",
//     image: "https://images.unsplash.com/photo-1589128773085-2c402dc04034?w=600&q=80",
//     date: "2023-08-01",
//     category: 'promotion'
//   },
  {
    id: 4,
    title: "Mid Year Sale เครื่องประดับทองคำ",
    excerpt: "ลดกระหน่ำกลางปี ทองคำรูปพรรณและทองคำแท่ง ค่ากำเหน็จราคาพิเศษ",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    date: "2023-06-15",
    category: 'promotion'
  }
];

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

const initialShopInfo: ShopInfo = {
  name: "ร้านเพชรพลอย จิวเวลรี่",
  description: "จำหน่ายเครื่องประดับเพชรแท้ ทองคำแท้ คุณภาพสูง มีใบรับประกัน GIA ออกแบบโดยช่างผู้ชำนาญการกว่า 20 ปี",
  address: "123 ชั้น 2 ห้างสยามพารากอน เขตปทุมวัน กรุงเทพฯ 10330",
  phone: "089-123-4567",
  email: "contact@phetploy.com",
  lineId: "@phetploy",
  facebook: "PhetPloy Jewelry",
  instagram: "phetploy_official",
  website: "www.phetploy.com"
};

// --- Shared Components ---


const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors flex-1 sm:flex-none justify-center
        ${active 
          ? 'border-gray-900 text-gray-900' 
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );



// --- Content Page Component ---

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState<ArticleCategory | 'about'>('knowledge');
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(initialShopInfo);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Form State (for Modal)
  const [formData, setFormData] = useState({ title: '', excerpt: '', image: '' });

  // --- Handlers ---

  const handleOpenAdd = () => {
    setEditingArticle(null);
    setFormData({ title: '', excerpt: '', image: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({ title: article.title, excerpt: article.excerpt, image: article.image });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบบทความนี้?")) {
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleSaveArticle = () => {
    if (editingArticle) {
      // Update
      setArticles(articles.map(a => a.id === editingArticle.id ? { ...a, ...formData } : a));
    } else {
      // Create
      const newId = Math.max(...articles.map(a => a.id)) + 1;
      setArticles([...articles, { 
        id: newId, 
        ...formData, 
        date: new Date().toISOString().split('T')[0],
        category: activeTab as ArticleCategory
      }]);
    }
    setIsModalOpen(false);
  };

  const handleUpdateShopInfo = (field: keyof ShopInfo, value: string) => {
    setShopInfo({ ...shopInfo, [field]: value });
  };

  // --- Render Helpers ---

  const filteredArticles = articles.filter(a => a.category === activeTab);

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">จัดการเนื้อหา</h2>
          <p className="text-gray-500 text-sm mt-1">บริหารจัดการบทความ โปรโมชั่น และข้อมูลร้านค้า</p>
        </div>
        {activeTab !== 'about' && (
            <button 
                onClick={handleOpenAdd}
                className="bg-gray-900 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
                <Plus className="w-4 h-4" />
                {activeTab === 'knowledge'
                  ? 'เพิ่มบทความ'
                  : activeTab === 'promotion'
                  ? 'เพิ่มโปรโมชั่น'
                  : 'เพิ่มฉบับร่าง'}

            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-2 flex">
        <TabButton 
          active={activeTab === 'knowledge'} 
          onClick={() => setActiveTab('knowledge')} 
          icon={FileText} 
          label="ความรู้เรื่องเพชร" 
        />
        <TabButton 
        active={activeTab === 'draft'} 
        onClick={() => setActiveTab('draft')} 
        icon={FilePen} 
        label="ฉบับร่าง" 
      />

      
      </div>
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-2 flex flex-wrap"></div>

      {/* Content Area */}
      <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-gray-200 min-h-[500px] p-6">
        
        {/* --- Tab: Knowledge & Promotion (Shared Grid Layout) --- */}
        {(activeTab === 'knowledge' || activeTab === 'promotion' || activeTab === 'draft') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <div key={article.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-600 shadow-sm">
                                    {article.date}
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1" title={article.title}>{article.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{article.excerpt}</p>
                                
                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-50">
                                    <button 
                                        onClick={() => handleOpenEdit(article)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 text-sm font-medium transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" /> แก้ไข
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(article.id)}
                                        className="flex-none px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-8 h-8 opacity-20" />
                        </div>
                        <p>ยังไม่มีเนื้อหาในส่วนนี้</p>
                    </div>
                )}
            </div>
        )}

        {/* --- Tab: About Us (Form Layout) --- */}
        {activeTab === 'about' && (
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Section 1: General Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900">ข้อมูลทั่วไป</h3>
                        <p className="text-sm text-gray-500 mt-1">ชื่อร้าน รายละเอียด และที่ตั้ง</p>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อร้านค้า</label>
                            <div className="relative">
                                <Gem className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={shopInfo.name}
                                    onChange={(e) => handleUpdateShopInfo('name', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายร้านค้า</label>
                            <textarea 
                                rows={4}
                                value={shopInfo.description}
                                onChange={(e) => handleUpdateShopInfo('description', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <textarea 
                                    rows={2}
                                    value={shopInfo.address}
                                    onChange={(e) => handleUpdateShopInfo('address', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Section 2: Contact & Social */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900">ช่องทางการติดต่อ</h3>
                        <p className="text-sm text-gray-500 mt-1">โซเชียลมีเดีย และเบอร์โทรศัพท์</p>
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={shopInfo.phone}
                                    onChange={(e) => handleUpdateShopInfo('phone', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LINE ID</label>
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 w-4 h-4 flex items-center justify-center font-bold text-green-500 text-xs">L</div>
                                <input 
                                    type="text" 
                                    value={shopInfo.lineId}
                                    onChange={(e) => handleUpdateShopInfo('lineId', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                            <div className="relative">
                                <Facebook className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={shopInfo.facebook}
                                    onChange={(e) => handleUpdateShopInfo('facebook', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                            <div className="relative">
                                <Instagram className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={shopInfo.instagram}
                                    onChange={(e) => handleUpdateShopInfo('instagram', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={shopInfo.website}
                                    onChange={(e) => handleUpdateShopInfo('website', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                        <Save className="w-4 h-4" />
                        บันทึกข้อมูล
                    </button>
                </div>
            </div>
        )}

      </div>

      {/* --- Add/Edit Modal --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}
        footer={
            <>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button>
                <button onClick={handleSaveArticle} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg">บันทึก</button>
            </>
        }
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อ</label>
                <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none"
                    placeholder="ใส่หัวข้อบทความ..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เนื้อหาโดยย่อ</label>
                <textarea 
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none resize-none"
                    placeholder="รายละเอียดสั้นๆ..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">รูปภาพหน้าปก (URL)</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none text-sm text-gray-500"
                        placeholder="https://..."
                    />
                    <button className="bg-gray-100 p-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
                        <UploadCloud className="w-5 h-5" />
                    </button>
                </div>
                {formData.image && (
                    <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>
        </div>
      </Modal>

    </div>
  );

  
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900 flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <ContentManagement />
      </main>
    </div>
  );
}