'use client'

import React, { useState } from 'react';
import '@/app/css/content.css';
import { Plus, Edit3, Trash2, X, FileText, FilePen, UploadCloud } from 'lucide-react';
import { Sidebar } from "@/components/sidebar"

// --- Types ---
type ArticleCategory = 'knowledge' | 'promotion' | 'draft';
type Article = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: ArticleCategory;
};

// --- Mock Data ---
const initialArticles: Article[] = [
  {
    id: 1,
    title: "วิธีเลือกเพชรน้ำงาม 4Cs ที่ควรรู้",
    excerpt: "หลักการง่ายๆ ในการดูเพชรด้วยตาเปล่า และทำความเข้าใจหลัก 4Cs",
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
  }
];

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState<ArticleCategory | 'about'>('knowledge');
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({ title: '', excerpt: '', image: '' });

  // --- Handlers (ส่วนที่แก้ตัวแดง) ---

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
      const newId = articles.length > 0 ? Math.max(...articles.map(a => a.id)) + 1 : 1;
      setArticles([...articles, { 
        id: newId, 
        ...formData, 
        date: new Date().toISOString().split('T')[0],
        category: (activeTab === 'about' ? 'knowledge' : activeTab) as ArticleCategory
      }]);
    }
    setIsModalOpen(false);
  };

  const filteredArticles = articles.filter(a => a.category === activeTab);

  return (
    <div className="main-content">
      {/* Header */}
      <div className="content-header">
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>จัดการเนื้อหา</h2>
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>บริหารจัดการบทความและข้อมูลร้านค้า</p>
        </div>
        {activeTab !== 'about' && (
            <button onClick={handleOpenAdd} className="btn-primary">
                <Plus size={16} />
                {activeTab === 'knowledge' ? 'เพิ่มบทความ' : 'เพิ่มฉบับร่าง'}
            </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tab-container">
        <button 
          className={`tab-button ${activeTab === 'knowledge' ? 'active' : ''}`}
          onClick={() => setActiveTab('knowledge')}
        >
          <FileText size={16} /> ความรู้เรื่องเพชร
        </button>
        <button 
          className={`tab-button ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          <FilePen size={16} /> ฉบับร่าง
        </button>
      </div>

      {/* Content Area */}
      <div className="article-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="card-image-wrapper">
                <img src={article.image} alt={article.title} />
              </div>
              <div style={{ padding: '1.25rem' }}>
                <h3 className="line-clamp-1" style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{article.title}</h3>
                <p className="line-clamp-2" style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>{article.excerpt}</p>
                
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #F9FAFB', paddingTop: '1rem' }}>
                  <button onClick={() => handleOpenEdit(article)} className="tab-button" style={{ flex: 1, background: '#F9FAFB', borderRadius: '0.5rem', border: 'none' }}>
                    <Edit3 size={16} /> แก้ไข
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="tab-button" style={{ color: '#EF4444', background: '#FEF2F2', borderRadius: '0.5rem', border: 'none' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 0', color: '#9CA3AF' }}>
            <FileText size={48} style={{ opacity: 0.2, marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto' }} />
            <p>ยังไม่มีเนื้อหาในส่วนนี้</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 'bold', margin: 0 }}>{editingArticle ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}</h3>
              <X onClick={() => setIsModalOpen(false)} style={{ cursor: 'pointer', color: '#9CA3AF' }} />
            </div>
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>หัวข้อ</label>
                <input className="input-field" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="ใส่หัวข้อบทความ..." />
              </div>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>เนื้อหาโดยย่อ</label>
                <textarea className="input-field" rows={3} value={formData.excerpt} onChange={(e) => setFormData({...formData, excerpt: e.target.value})} style={{ resize: 'none' }} placeholder="รายละเอียดสั้นๆ..." />
              </div>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: 500 }}>รูปภาพหน้าปก (URL)</label>
                <input className="input-field" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer', color: '#6B7280' }}>ยกเลิก</button>
              <button onClick={handleSaveArticle} className="btn-primary">บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <div className="admin-container">
      <Sidebar />
      <ContentManagement />
    </div>
  );
}