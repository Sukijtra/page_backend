'use client'

import React, { useState, useEffect } from 'react';
import { 
  Gem, Star, Search, Filter, MessageSquare, Trash2, 
  CornerDownRight, X, Quote
} from 'lucide-react';
import {Sidebar} from "@/components/sidebar"
import '@/app/css/reviews.css';

// --- Types ---
type Review = {
  id: number;
  customerName: string;
  customerAvatar: string;
  productName: string;
  productCategory: string;
  productImage: string;
  rating: number;
  comment: string;
  images: string[];
  date: string;
  reply?: string;
};

// --- Mock Data ---
const mockReviews: Review[] = [
  {
    id: 1,
    customerName: "คุณสมหญิง จันทร์เจ้า",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    productName: "แหวนเพชรเม็ดเดี่ยว 1 กะรัต",
    productCategory: "แหวน",
    productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=150",
    rating: 5,
    comment: "สวยงามมากค่ะ เพชรเล่นไฟดีมาก ประทับใจการบริการของร้านด้วยค่ะ แอดมินตอบไว ให้คำแนะนำดี ไว้จะมาอุดหนุนอีกนะคะ",
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300"],
    date: "2023-10-05T10:30:00",
    reply: "ขอบพระคุณมากค่ะคุณสมหญิง ทางร้านดีใจที่คุณลูกค้าชอบนะคะ ยินดีให้บริการเสมอค่ะ"
  },
  {
    id: 2,
    customerName: "คุณมานี ใจดี",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    productName: "สร้อยคอทองคำ 18k",
    productCategory: "สร้อยคอ",
    productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=150",
    rating: 4,
    comment: "ได้รับสินค้าแล้วค่ะ สร้อยสวยตรงปก แต่ขนส่งมาช้านิดนึงค่ะ โดยรวมโอเคค่ะ",
    images: [],
    date: "2023-10-02T14:20:00",
  },
  {
    id: 3,
    customerName: "คุณวิไล สวยงาม",
    customerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    productName: "ต่างหูเพชรระย้า",
    productCategory: "ต่างหู",
    productImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=150",
    rating: 5,
    comment: "งานละเอียดมาก ใส่แล้วดูแพงสุดๆ ชอบมากๆค่ะ",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300", "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=300"],
    date: "2023-09-28T09:15:00",
    reply: "ขอบคุณสำหรับรีวิวนะคะคุณวิไล ต่างหูรุ่นนี้เป็น Best Seller ของทางร้านเลยค่ะ ใส่แล้วขับผิวมากๆ"
  },
  {
    id: 4,
    customerName: "คุณสมชาย รักดี",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    productName: "กำไลข้อมือเกลี้ยง",
    productCategory: "กำไล",
    productImage: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=150",
    rating: 3,
    comment: "สินค้าโอเคครับ แต่กล่องบุบนิดหน่อย อยากให้แพ็คแน่นหนากว่านี้ครับ",
    images: [],
    date: "2023-09-25T16:45:00",
  }
];

// --- Shared Components ---

const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{fontSize: '1.125rem', fontWeight: 700}}>{title}</h3>
          <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af'}}><X size={20}/></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

const StarRating = ({ rating }: { rating: number }) => (
  <div style={{display: 'flex', gap: '2px'}}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} size={16} fill={star <= rating ? "#facc15" : "#e5e7eb"} color={star <= rating ? "#facc15" : "#e5e7eb"} />
    ))}
  </div>
);

// --- Review Management Component ---

const ReviewManagement = () => {

useEffect(() => {
    const hasRefreshed = sessionStorage.getItem("pageRefreshed");
    if (!hasRefreshed) {
      sessionStorage.setItem("pageRefreshed", "true");
      window.location.reload();
    }
    return () => {
      sessionStorage.removeItem("pageRefreshed");
    };
  }, []);

  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'replied' | 'pending'>('all');
  
  // Modals & Preview State
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
        review.customerName.includes(searchTerm) || 
        review.productName.includes(searchTerm) ||
        review.comment.includes(searchTerm);
    const matchesRating = filterRating === 'all' || review.rating === filterRating;
    const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'replied' && review.reply) || 
        (filterStatus === 'pending' && !review.reply);
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  const averageRating = (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1);

  // Handlers
  const openReplyDialog = (review: Review) => {
      setSelectedReview(review);
      setReplyText(review.reply || "");
      setReplyDialogOpen(true);
  };

  const handleSendReply = () => {
      if (selectedReview && replyText) {
          setReviews(reviews.map(r => 
              r.id === selectedReview.id ? { ...r, reply: replyText } : r
          ));
          setReplyDialogOpen(false);
          setReplyText("");
          setSelectedReview(null);
      }
  };

  const handleDeleteReview = (id: number) => {
      if (confirm("คุณแน่ใจหรือไม่ที่จะลบุรีวิวนี้?")) {
          setReviews(reviews.filter(r => r.id !== id));
      }
  };

  return (
    <div className="review-container">
      
      {/* Header & Stats */}
      <div className="review-header">
        <div className="header-title">
          <h2>จัดการรีวิว</h2>
          <p>เสียงตอบรับจากลูกค้าและการประเมินร้านค้า</p>
        </div>
        <div className="stats-group">
            <div className="stat-card">
                <div className="stat-icon blue-icon"><Star fill="currentColor" /></div>
                <div className="stat-info">
                    <p>คะแนนเฉลี่ย</p>
                    <div className="stat-value">
                        <h4>{averageRating}</h4>
                        <span style={{fontSize: '0.875rem', color: '#6b7280'}}>/ 5.0</span>
                    </div>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-icon green-icon"><MessageSquare /></div>
                <div className="stat-info">
                    <p>รีวิวทั้งหมด</p>
                    <div className="stat-value">
                        <h4>{reviews.length}</h4>
                        <span style={{fontSize: '0.875rem', color: '#6b7280'}}>รายการ</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
            <Search className="search-icon" />
            <input 
              type="text" 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารีวิว, ชื่อลูกค้า..." 
            />
        </div>
        <div className="filter-group">
             <div className="select-wrapper">
                 <select 
                    className="custom-select"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                 >
                     <option value="all">ดาวทั้งหมด</option>
                     <option value="5">5 ดาว</option>
                     <option value="4">4 ดาว</option>
                     <option value="3">3 ดาว</option>
                     <option value="2">2 ดาว</option>
                     <option value="1">1 ดาว</option>
                 </select>
                 <Filter className="select-chevron" />
             </div>
             <div className="select-wrapper">
                 <select 
                    className="custom-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                 >
                     <option value="all">สถานะทั้งหมด</option>
                     <option value="replied">ตอบกลับแล้ว</option>
                     <option value="pending">รอตอบกลับ</option>
                 </select>
                 <CornerDownRight className="select-chevron" />
             </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
          {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                  <div key={review.id} className="review-item">
                      <div className="review-layout">
                          
                          {/* Customer Info */}
                          <div className="customer-info">
                              <img src={review.customerAvatar} className="avatar" alt="avatar" />
                              <div style={{textAlign: 'inherit'}}>
                                  <p style={{fontSize: '0.875rem', fontWeight: 700, margin: 0}}>{review.customerName}</p>
                                  <p style={{fontSize: '0.75rem', color: '#9ca3af', margin: 0}}>Verified Buyer</p>
                                  <div style={{marginTop: '0.5rem'}}>
                                      <StarRating rating={review.rating} />
                                      <p style={{fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem'}}>
                                          {new Date(review.date).toLocaleDateString('th-TH')}
                                      </p>
                                  </div>
                              </div>
                          </div>

                          {/* Content */}
                          <div style={{flex: 1, minWidth: 0}}>
                              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                                <div className="product-tag">
                                    <img src={review.productImage} style={{width: '2.5rem', height: '2.5rem', borderRadius: '0.375rem', objectFit: 'cover'}} alt="product" />
                                    <div>
                                        <p style={{fontSize: '0.75rem', fontWeight: 600, margin: 0}}>{review.productName}</p>
                                        <p style={{fontSize: '0.75rem', color: '#6b7280', margin: 0}}>{review.productCategory}</p>
                                    </div>
                                </div>
                                <div style={{display: 'flex', gap: '0.25rem'}}>
                                    {!review.reply && (
                                        <button onClick={() => openReplyDialog(review)} style={{padding: '0.5rem', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer'}}><MessageSquare size={16}/></button>
                                    )}
                                    <button onClick={() => handleDeleteReview(review.id)} style={{padding: '0.5rem', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer'}}><Trash2 size={16}/></button>
                                </div>
                              </div>

                              <div className="comment-box">
                                  <Quote size={16} style={{position: 'absolute', left: '-1.5rem', top: '-0.25rem', color: '#e5e7eb'}} />
                                  <p className="comment-text">"{review.comment}"</p>
                              </div>

                              {/* Images with Click to Preview */}
                              {review.images.length > 0 && (
                                  <div style={{display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto'}} className="no-scrollbar">
                                      {review.images.map((img, idx) => (
                                          <img 
                                            key={idx} 
                                            src={img} 
                                            className="review-image-clickable"
                                            style={{width: '5rem', height: '5rem', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid #f3f4f6'}} 
                                            alt="review attachment" 
                                            onClick={() => setPreviewImage(img)}
                                          />
                                      ))}
                                  </div>
                              )}

                              {/* Admin Reply */}
                              {review.reply && (
                                  <div className="admin-reply">
                                      <div className="reply-bubble">
                                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                                                  <div style={{width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                      <Gem size={12} color="white" />
                                                  </div>
                                                  <span style={{fontSize: '0.75rem', fontWeight: 700}}>Admin</span>
                                                  <span style={{fontSize: '10px', padding: '2px 6px', background: '#dcfce7', color: '#15803d', borderRadius: '99px'}}>Official</span>
                                              </div>
                                              <button onClick={() => openReplyDialog(review)} style={{fontSize: '10px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer'}}>แก้ไข</button>
                                          </div>
                                          <p style={{fontSize: '0.875rem', color: '#4b5563', margin: 0, paddingLeft: '2rem'}}>{review.reply}</p>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <div style={{textAlign: 'center', padding: '4rem', border: '2px dashed #e5e7eb', borderRadius: '0.75rem'}}>
                  <h3 style={{color: '#9ca3af'}}>ไม่พบรีวิวที่ค้นหา</h3>
              </div>
          )}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        title="ตอบกลับรีวิว"
        footer={
            <>
                <button onClick={() => setReplyDialogOpen(false)} style={{padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem'}}>ยกเลิก</button>
                <button onClick={handleSendReply} disabled={!replyText.trim()} className="btn-primary">ส่งคำตอบ</button>
            </>
        }
      >
        {selectedReview && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div style={{background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem', display: 'flex', gap: '1rem'}}>
                    <img src={selectedReview.customerAvatar} style={{width: '2.5rem', height: '2.5rem', borderRadius: '50%'}} alt="customer" />
                    <div>
                        <span style={{fontSize: '0.875rem', fontWeight: 700}}>{selectedReview.customerName}</span>
                        <p style={{fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic', margin: '0.25rem 0'}}>"{selectedReview.comment}"</p>
                    </div>
                </div>
                <textarea 
                    rows={5}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    style={{width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', fontSize: '0.875rem'}}
                    placeholder="พิมพ์ข้อความตอบกลับ..."
                />
            </div>
        )}
      </Modal>

      {/* Image Lightbox */}
      {previewImage && (
        <div className="lightbox-overlay" onClick={() => setPreviewImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setPreviewImage(null)}>
              <X size={20} color="#000" />
            </button>
            <img src={previewImage} className="lightbox-image" alt="Preview" />
          </div>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <div style={{minHeight: '100vh', background: '#F5F7FA', display: 'flex'}}>
      <Sidebar />
      <main style={{flex: 1, marginLeft: '16rem', minHeight: '100vh'}}>
        <ReviewManagement />
      </main>
    </div>
  );
}