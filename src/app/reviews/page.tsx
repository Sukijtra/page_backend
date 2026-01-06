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
  LogOut, 
  Search, 
  Filter, 
  MessageSquare, 
  Trash2, 
  MoreHorizontal, 
  ThumbsUp, 
  CornerDownRight, 
  CheckCircle, 
  X,
  Image as ImageIcon,
  Quote
} from 'lucide-react';
import { Sidebar } from '../../../components/sidebar';

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

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                />
            ))}
        </div>
    );
};

// --- Review Management Component ---

const ReviewManagement = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'replied' | 'pending'>('all');
  
  // Reply Modal State
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");

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
      if (confirm("คุณแน่ใจหรือไม่ที่จะลบุรีวิวนี้? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
          setReviews(reviews.filter(r => r.id !== id));
      }
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">จัดการรีวิว</h2>
          <p className="text-gray-500 text-sm mt-1">เสียงตอบรับจากลูกค้าและการประเมินร้านค้า</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                    <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">คะแนนเฉลี่ย</p>
                    <div className="flex items-baseline gap-1">
                        <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
                        <span className="text-sm text-gray-500">/ 5.0</span>
                    </div>
                </div>
            </div>
            <div className="bg-white/50 backdrop-blur-sm px-5 py-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                    <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">รีวิวทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-900">{reviews.length} <span className="text-sm font-normal text-gray-500">รายการ</span></p>
                </div>
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหารีวิว, ชื่อลูกค้า..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 text-sm bg-gray-50/50 focus:bg-white transition-all"
            />
        </div>
        <div className="flex gap-3">
             <div className="relative group">
                 <select 
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="appearance-none px-4 py-2.5 pr-8 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:border-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                 >
                     <option value="all">ดาวทั้งหมด</option>
                     <option value="5">5 ดาว</option>
                     <option value="4">4 ดาว</option>
                     <option value="3">3 ดาว</option>
                     <option value="2">2 ดาว</option>
                     <option value="1">1 ดาว</option>
                 </select>
                 <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <div className="relative">
                 <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="appearance-none px-4 py-2.5 pr-8 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:border-gray-900 cursor-pointer hover:bg-gray-50 transition-colors"
                 >
                     <option value="all">สถานะทั้งหมด</option>
                     <option value="replied">ตอบกลับแล้ว</option>
                     <option value="pending">รอตอบกลับ</option>
                 </select>
                 <CornerDownRight className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
          {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex flex-col lg:flex-row gap-6">
                          
                          {/* Left: User & Rating */}
                          <div className="w-full lg:w-48 flex-shrink-0 flex flex-row lg:flex-col gap-4 items-center lg:items-start lg:border-r border-gray-100 pr-0 lg:pr-6">
                              <div className="text-center lg:text-left">
                                  <div className="relative inline-block">
                                    <img src={review.customerAvatar} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md mb-2" />
                                  </div>
                                  <p className="text-sm font-bold text-gray-900 mt-1">{review.customerName}</p>
                                  <p className="text-xs text-gray-400">Verified Buyer</p>
                              </div>
                              
                              <div className="flex-1 lg:flex-none flex flex-col items-end lg:items-start">
                                  <div className="bg-yellow-50 px-2 py-1 rounded-md mb-1 inline-flex">
                                      <StarRating rating={review.rating} />
                                  </div>
                                  <p className="text-xs text-gray-400">
                                      {new Date(review.date).toLocaleString('th-TH', { 
                                          year: 'numeric', 
                                          month: 'short', 
                                          day: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                      })}
                                  </p>
                              </div>
                          </div>

                          {/* Right: Content */}
                          <div className="flex-1 min-w-0">
                              {/* Product Info Tag */}
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3 bg-gray-50/80 rounded-lg p-2 pr-4 border border-gray-100 max-w-fit hover:bg-gray-100 transition-colors cursor-pointer">
                                    <img src={review.productImage} className="w-10 h-10 rounded-md bg-white object-cover border border-gray-200" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-900 line-clamp-1">{review.productName}</p>
                                        <p className="text-xs text-gray-500">{review.productCategory}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!review.reply && (
                                        <button onClick={() => openReplyDialog(review)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="ตอบกลับ">
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="ลบ">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                              </div>

                              {/* Comment */}
                              <div className="relative pl-4 border-l-2 border-gray-100">
                                  <Quote className="w-4 h-4 text-gray-300 absolute -top-1 -left-6 transform -scale-x-100" />
                                  <p className="text-gray-700 text-sm leading-relaxed italic">
                                      "{review.comment}"
                                  </p>
                              </div>

                              {/* Images */}
                              {review.images.length > 0 && (
                                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2 no-scrollbar">
                                      {review.images.map((img, idx) => (
                                          <div key={idx} className="relative w-20 h-20 flex-shrink-0 group/img cursor-zoom-in">
                                              <img src={img} className="w-full h-full rounded-lg object-cover border border-gray-100 shadow-sm transition-transform group-hover/img:scale-105" />
                                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors rounded-lg"></div>
                                          </div>
                                      ))}
                                  </div>
                              )}

                              {/* Admin Reply */}
                              {review.reply && (
                                  <div className="mt-5 ml-4 relative">
                                      <div className="absolute -left-6 top-0 bottom-0 w-6 border-l-2 border-b-2 border-gray-100 rounded-bl-xl"></div>
                                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/60 relative group/reply">
                                          <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
                                                      <Gem className="w-3 h-3 text-white" />
                                                  </div>
                                                  <span className="text-xs font-bold text-gray-900">ร้านเพชรพลอย (Admin)</span>
                                                  <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Official</span>
                                              </div>
                                              <button 
                                                onClick={() => openReplyDialog(review)}
                                                className="text-[10px] text-gray-400 hover:text-gray-700 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                                              >
                                                  แก้ไข
                                              </button>
                                          </div>
                                          <p className="text-sm text-gray-600 pl-8">{review.reply}</p>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">ไม่พบรีวิวที่ค้นหา</h3>
                  <p className="text-gray-500 text-sm mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะครับ</p>
                  <button 
                    onClick={() => {setSearchTerm(''); setFilterRating('all'); setFilterStatus('all');}}
                    className="mt-4 text-sm text-blue-600 font-medium hover:underline"
                  >
                      ล้างตัวกรองทั้งหมด
                  </button>
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
                <button onClick={() => setReplyDialogOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button>
                <button onClick={handleSendReply} disabled={!replyText.trim()} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200">
                    <MessageSquare className="w-4 h-4 inline-block mr-2" />
                    ส่งคำตอบ
                </button>
            </>
        }
      >
        {selectedReview && (
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                    <img src={selectedReview.customerAvatar} className="w-10 h-10 rounded-full object-cover border border-white shadow-sm flex-shrink-0" />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-gray-900">{selectedReview.customerName}</span>
                            <StarRating rating={selectedReview.rating} />
                        </div>
                        <p className="text-sm text-gray-600 italic">"{selectedReview.comment}"</p>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ข้อความตอบกลับ</label>
                    <div className="relative">
                        <textarea 
                            rows={5}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none resize-none text-sm transition-all shadow-sm"
                            placeholder="พิมพ์ข้อความตอบกลับเพื่อแสดงความขอบคุณ หรือชี้แจงข้อมูล..."
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {replyText.length} ตัวอักษร
                        </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                        <button onClick={() => setReplyText("ขอบพระคุณมากค่ะ ทางร้านดีใจที่คุณลูกค้าชอบสินค้าของเรานะคะ 🙏")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 transition-colors">
                            + ขอบคุณทั่วไป
                        </button>
                        <button onClick={() => setReplyText("ทางร้านต้องขออภัยในความไม่สะดวกด้วยนะคะ เราจะนำคำติชมไปปรับปรุงบริการให้ดียิ่งขึ้นค่ะ")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full text-gray-600 transition-colors">
                            + ขออภัย
                        </button>
                    </div>
                </div>
            </div>
        )}
      </Modal>

    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-900 flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">
        <ReviewManagement />
      </main>
    </div>
  );
}