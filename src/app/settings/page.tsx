'use client'

import React, { useState, useEffect } from 'react';
import '@/app/css/settings.css';
import { 
  Store, MapPin, Phone, Mail, Facebook, Instagram, 
  CreditCard, Plus, Trash2, Edit3, Upload, X,
  Building2, QrCode, CheckCircle, Save
} from 'lucide-react';
import {Sidebar} from "@/components/sidebar"

// --- Types ---
type BankAccount = {
  id: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrCode?: string;
  color: string;
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

// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children, footer }: any) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content modal-animate">
        <div className="card-header">
          <h3 className="title" style={{fontSize: '1.125rem'}}>{title}</h3>
          <button onClick={onClose} className="btn-icon">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="card-body" style={{overflowY: 'auto'}}>
          {children}
        </div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

const StoreSettings = () => {

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
  
  const [storeData, setStoreData] = useState(initialStoreData);
  const [bankAccounts, setBankAccounts] = useState(initialBankAccounts);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  
  const selectedBank = bankAccounts.find(bank => bank.id === selectedBankId);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', accountName: '' });

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
      setBankAccounts([...bankAccounts, { id: Date.now(), ...bankForm, color }]);
    }
    setIsBankModalOpen(false);
  };

  const handleDeleteBank = (id: number) => {
    if (confirm("คุณต้องการลบบัญชีธนาคารนี้ใช่หรือไม่?")) {
      setBankAccounts(bankAccounts.filter(b => b.id !== id));
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="header-section">
        <div>
          <h2 className="title">บัญชีร้านค้า</h2>
          <p className="subtitle">ตั้งค่าข้อมูลร้านค้า ช่องทางการติดต่อ และการชำระเงิน</p>
        </div>
        <button className="btn-primary">
          <Save className="w-4 h-4" /> บันทึกการเปลี่ยนแปลง
        </button>
      </div>

      <div className="grid-container">
        <div className="col-span-2">
            <div className="card">
                <div className="card-header">
                    <div className="card-header-title">
                        <div className="icon-box" style={{backgroundColor: '#EFF6FF', color: '#2563eb'}}>
                            <Store className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold">ข้อมูลทั่วไป</h3>
                    </div>
                </div>
                <div className="card-body">
                    <div className="form-grid">
                        <div className="input-group">
                            <label className="label">ชื่อร้านค้า</label>
                            <input type="text" value={storeData.name} onChange={(e) => handleUpdateStore('name', e.target.value)} className="input-field" />
                        </div>
                        <div className="input-group">
                            <label className="label">คำอธิบายร้านค้า</label>
                            <textarea rows={3} value={storeData.description} onChange={(e) => handleUpdateStore('description', e.target.value)} className="textarea-field" style={{resize: 'none'}} />
                        </div>
                        <div className="input-group">
                            <label className="label">ที่อยู่</label>
                            <div className="relative-input">
                                <MapPin className="input-icon" />
                                <textarea rows={2} value={storeData.address} onChange={(e) => handleUpdateStore('address', e.target.value)} className="textarea-field pl-10" style={{resize: 'none'}} />
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="label">เวลาทำการ</label>
                            <textarea rows={2} value={storeData.openingHours} onChange={(e) => handleUpdateStore('openingHours', e.target.value)} className="textarea-field" style={{resize: 'none'}} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-header-title">
                        <div className="icon-box" style={{backgroundColor: '#ECFDF5', color: '#059669'}}>
                            <Phone className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold">ช่องทางการติดต่อ</h3>
                    </div>
                </div>
                <div className="card-body form-grid-2">
                    {['phone', 'mobile', 'email', 'lineId', 'facebook', 'instagram'].map((field) => (
                      <div key={field} className="input-group">
                          <label className="label">{field.toUpperCase()}</label>
                          <div className="relative-input">
                              <div className="input-icon">
                                {field === 'email' ? <Mail className="w-4 h-4"/> : <Phone className="w-4 h-4"/>}
                              </div>
                              <input type="text" value={(storeData as any)[field]} onChange={(e) => handleUpdateStore(field, e.target.value)} className="input-field pl-10" />
                          </div>
                      </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="bank-column">
            <div className="card">
                <div className="card-header">
                    <div className="card-header-title">
                        <div className="icon-box" style={{backgroundColor: '#F5F3FF', color: '#7C3AED'}}>
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold">บัญชีธนาคาร</h3>
                    </div>
                    <button onClick={handleOpenAddBank} className="btn-primary" style={{padding: '0.375rem 0.5rem', fontSize: '0.75rem'}}>
                        <Plus className="w-3 h-3" /> เพิ่ม
                    </button>
                </div>
                <div className="card-body bank-list">
                    {bankAccounts.map((account) => {
                      const isSelected = selectedBankId === account.id;
                      return (
                        <div key={account.id} onClick={() => setSelectedBankId(account.id)} className={`bank-item ${isSelected ? 'selected' : ''}`}>
                          <div className={`bank-sidebar ${account.color}`}></div>
                          {isSelected && (
                            <div style={{position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#111827', color: 'white', borderRadius: '9999px', padding: '0.25rem'}}>
                              <CheckCircle className="w-4 h-4" />
                            </div>
                          )}
                          <div className="bank-header">
                            <div className="bank-info-top">
                              <div className={`radio-circle ${isSelected ? 'selected' : ''}`}>
                                {isSelected && <div className="radio-inner"></div>}
                              </div>
                              <Building2 className={`w-4 h-4 ${account.color.replace('bg-', 'text-')}`} />
                              <h4 className="font-semibold" style={{fontSize: '0.875rem'}}>{account.bankName}</h4>
                            </div>
                            <div className="bank-actions" onClick={(e) => e.stopPropagation()}>
                              <button onClick={() => handleOpenEditBank(account)} className="btn-icon"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDeleteBank(account.id)} className="btn-icon"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                          <p style={{fontFamily: 'monospace', fontSize: '1.125rem', letterSpacing: '0.1em', margin: '0.5rem 0'}}>{account.accountNumber}</p>
                          <p style={{fontSize: '0.75rem', color: '#6B7280'}}>{account.accountName}</p>
                        </div>
                      );
                    })}
                    {selectedBank && (
                      <div style={{marginTop: '1rem', fontSize: '0.875rem', backgroundColor: '#F9FAFB', padding: '0.75rem', borderRadius: '0.5rem'}}>
                        เลือกบัญชี: <span style={{fontWeight: 600}}>{selectedBank.bankName}</span>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <Modal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        title={editingBank ? "แก้ไขบัญชีธนาคาร" : "เพิ่มบัญชีธนาคาร"}
        footer={
            <>
                <button onClick={() => setIsBankModalOpen(false)} className="btn-secondary">ยกเลิก</button>
                <button onClick={handleSaveBank} className="btn-primary">บันทึก</button>
            </>
        }
      >
        <div className="form-grid">
            <div className="input-group">
                <label className="label">ธนาคาร</label>
                <select value={bankForm.bankName} onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})} className="select-field">
                    <option value="">เลือกธนาคาร</option>
                    <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</option>
                    <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</option>
                </select>
            </div>
            <div className="input-group">
                <label className="label">เลขที่บัญชี</label>
                <input type="text" value={bankForm.accountNumber} onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})} className="input-field" />
            </div>
            <div className="input-group">
                <label className="label">ชื่อบัญชี</label>
                <input type="text" value={bankForm.accountName} onChange={(e) => setBankForm({...bankForm, accountName: e.target.value})} className="input-field" />
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <StoreSettings />
      </main>
    </div>
  );
}