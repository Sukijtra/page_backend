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
  Save, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  Instagram, 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  X,
  Building2,
  QrCode,
  CheckCircle // เพิ่มการ import ตรงนี้
} from 'lucide-react';
import { Sidebar } from '../../../components/sidebar';

// --- Types ---
type BankAccount = {
  id: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrCode?: string;
  color: string; // For UI styling
};


// --- Mock Data ---
const initialStoreData = {
  name: "ร้านเพชรพลอย จิวเวลรี่",
  description: "จำหน่ายเครื่องประดับเพชรแท้ ทองคำแท้ คุณภาพสูง มีใบรับประกัน GIA ออกแบบโดยช่างผู้ชำนาญการกว่า 20 ปี",
  address: "123 ชั้น 2 ห้างสยามพารากอน เขตปทุมวัน กรุงเทพฯ 10330",
  phone: "02-123-4567",
  mobile: "089-123-4567",
  email: "contact@phetploy.com",
  lineId: "@phetploy",
  facebook: "PhetPloy Jewelry",
  instagram: "phetploy_official",
  openingHours: "จันทร์ - เสาร์: 10:00 - 19:00\nอาทิตย์: ปิดทำการ"
};

const initialBankAccounts: BankAccount[] = [
  {
    id: 1,
    bankName: "ธนาคารกสิกรไทย",
    accountNumber: "098-7-65432-1",
    accountName: "บจก. เพชรพลอย จิวเวลรี่",
    color: "bg-green-600",
    qrCode: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
  },
  {
    id: 2,
    bankName: "ธนาคารไทยพาณิชย์",
    accountNumber: "123-4-56789-0",
    accountName: "บจก. เพชรพลอย จิวเวลรี่",
    color: "bg-purple-600"
  }
];

// --- Shared Components ---
const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100">
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

// --- Settings Page Component ---

const StoreSettings = () => {
  const [storeData, setStoreData] = useState(initialStoreData);
  const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);

  // Bank Selection State (เลือกได้ 1 ธนาคาร)
const [selectedBankId, setSelectedBankId] = useState<number | null>(null);

// ธนาคารที่ถูกเลือก (เอาไปใช้งานต่อได้)
const selectedBank = bankAccounts.find(
  (bank) => bank.id === selectedBankId
);
  
  // Bank Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', accountName: '' });

  // Handlers
  const handleUpdateStore = (field: string, value: string) => {
    setStoreData({ ...storeData, [field as keyof typeof storeData]: value });
  };

  const handleOpenAddBank = () => {
    setEditingBank(null);
    setBankForm({ bankName: '', accountNumber: '', accountName: '' });
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (bank: BankAccount) => {
    setEditingBank(bank);
    setBankForm({ bankName: bank.bankName, accountNumber: bank.accountNumber, accountName: bank.accountName });
    setIsBankModalOpen(true);
  };

  const handleSaveBank = () => {
    const colorMap: Record<string, string> = {
        'ธนาคารกสิกรไทย': 'bg-green-600',
        'ธนาคารไทยพาณิชย์': 'bg-purple-600',
        'ธนาคารกรุงเทพ': 'bg-blue-600',
        'ธนาคารกรุงไทย': 'bg-sky-500',
        'ธนาคารกรุงศรี': 'bg-yellow-500',
    };
    const color = colorMap[bankForm.bankName] || 'bg-gray-600';

    if (editingBank) {
      setBankAccounts(bankAccounts.map(b => b.id === editingBank.id ? { ...b, ...bankForm, color } : b));
    } else {
      setBankAccounts([...bankAccounts, { 
        id: Date.now(), 
        ...bankForm, 
        color,
        qrCode: undefined 
      }]);
    }
    setIsBankModalOpen(false);
  };

  const handleDeleteBank = (id: number) => {
    if (confirm("คุณต้องการลบบัญชีธนาคารนี้ใช่หรือไม่?")) {
      setBankAccounts(bankAccounts.filter(b => b.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">บัญชีร้านค้า</h2>
          <p className="text-gray-500 text-sm mt-1">ตั้งค่าข้อมูลร้านค้า ช่องทางการติดต่อ และการชำระเงิน</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
          <Save className="w-4 h-4" />
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Store Information (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
            
            {/* 1. General Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Store className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">ข้อมูลทั่วไป</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อร้านค้า</label>
                            <input 
                                type="text" 
                                value={storeData.name}
                                onChange={(e) => handleUpdateStore('name', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบายร้านค้า</label>
                            <textarea 
                                rows={3}
                                value={storeData.description}
                                onChange={(e) => handleUpdateStore('description', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all resize-none"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">ที่อยู่</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <textarea 
                                    rows={2}
                                    value={storeData.address}
                                    onChange={(e) => handleUpdateStore('address', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">เวลาทำการ</label>
                            <textarea 
                                rows={2}
                                value={storeData.openingHours}
                                onChange={(e) => handleUpdateStore('openingHours', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Contact Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Phone className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">ช่องทางการติดต่อ</h3>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์โทรศัพท์ร้าน</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                value={storeData.phone}
                                onChange={(e) => handleUpdateStore('phone', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เบอร์มือถือ</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                value={storeData.mobile}
                                onChange={(e) => handleUpdateStore('mobile', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="email" 
                                value={storeData.email}
                                onChange={(e) => handleUpdateStore('email', e.target.value)}
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
                                value={storeData.lineId}
                                onChange={(e) => handleUpdateStore('lineId', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Page</label>
                        <div className="relative">
                            <Facebook className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                value={storeData.facebook}
                                onChange={(e) => handleUpdateStore('facebook', e.target.value)}
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
                                value={storeData.instagram}
                                onChange={(e) => handleUpdateStore('instagram', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>

        {/* Right Column: Financial (1/3 width) */}
        <div className="space-y-6">
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">บัญชีธนาคาร</h3>
                    </div>
                    <button 
                        onClick={handleOpenAddBank}
                        className="text-xs bg-gray-900 text-white px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> เพิ่ม
                    </button>
                </div>
                
                <div className="p-4 space-y-4">
                    {bankAccounts.map((account) => {const isSelected = selectedBankId === account.id;
                      return (
                        <div
                          key={account.id}
                          onClick={() => setSelectedBankId(account.id)}
                          className={`group relative overflow-hidden rounded-xl border cursor-pointer
                            transition-all
                            ${isSelected
                              ? 'border-gray-900 ring-2 ring-gray-900/20 shadow-md'
                              : 'border-gray-200 shadow-sm hover:shadow-md'
                            }`}
                            
                        >
                          {/* Card Background Decoration */}
                          <div className={`absolute top-0 left-0 w-2 h-full ${account.color}`}></div>
                          

                          {/* ไอคอนเลือกแล้ว */}
                          {isSelected && (
                            <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-1">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                          

                          <div className="p-4 pl-6">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                {/* Radio */}
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                    ${isSelected ? 'border-gray-900' : 'border-gray-300'}`}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                                  )}
                                </div>

                                <Building2
                                  className={`w-4 h-4 ${account.color.replace('bg-', 'text-')}`}
                                />
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {account.bankName}
                                </h4>
                              </div>

                              {/* ปุ่มแก้ไข / ลบ (ไม่ให้ไป trigger การเลือก) */}
                              <div
                                className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleOpenEditBank(account)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBank(account.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="font-mono text-lg text-gray-800 tracking-wider mb-1">
                              {account.accountNumber}
                            </p>
                            <p className="text-xs text-gray-500">{account.accountName}</p>

                            {account.qrCode && (
                              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                                <QrCode className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> มี QR Code แล้ว
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {/* 🔽 ตรงนี้แหละ ที่ถามหา */}
                    {selectedBank && (
                      <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        เลือกบัญชี:
                        <span className="font-semibold text-gray-900 ml-1">
                          {selectedBank.bankName}
                        </span>
                      </div>
                    )}

                    {bankAccounts.length === 0 && (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">ยังไม่มีบัญชีธนาคาร</p>
                        </div>
                    )}
                </div>
            </div>

        </div>

      </div>

      {/* Add/Edit Bank Modal */}
      <Modal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        title={editingBank ? "แก้ไขบัญชีธนาคาร" : "เพิ่มบัญชีธนาคาร"}
        footer={
            <>
                <button onClick={() => setIsBankModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">ยกเลิก</button>
                <button onClick={handleSaveBank} className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg">บันทึก</button>
            </>
        }
      >
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ธนาคาร</label>
                <select 
                    value={bankForm.bankName}
                    onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none bg-white"
                >
                    <option value="">เลือกธนาคาร</option>
                    <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</option>
                    <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                    <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</option>
                    <option value="ธนาคารกรุงไทย">ธนาคารกรุงไทย</option>
                    <option value="ธนาคารกรุงศรี">ธนาคารกรุงศรี</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่บัญชี</label>
                <input 
                    type="text" 
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none font-mono"
                    placeholder="xxx-x-xxxxx-x"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อบัญชี</label>
                <input 
                    type="text" 
                    value={bankForm.accountName}
                    onChange={(e) => setBankForm({...bankForm, accountName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 outline-none"
                    placeholder="ชื่อ-นามสกุล หรือ ชื่อบริษัท"
                />
            </div>
            
            <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">QR Code (รูปภาพ)</label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="text-sm text-gray-500"><span className="font-semibold">คลิกเพื่ออัปโหลด</span> หรือลากไฟล์มาวาง</p>
                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                        </div>
                        <input type="file" className="hidden" />
                    </label>
                </div>
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
        <StoreSettings />
      </main>
    </div>
  );
}