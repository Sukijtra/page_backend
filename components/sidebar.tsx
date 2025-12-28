"use client"; // จำเป็นต้องใส่เพื่อให้ใช้ hooks ได้

import React from 'react';
import Link from 'next/link'; // ใช้ Link ของ Next.js
import { usePathname } from 'next/navigation'; // Hook สำหรับเช็ค Path ปัจจุบัน
import {
  LayoutDashboard,
  Gem,
  ShoppingCart,
  FileText,
  Users,
  Star,
  Settings,
  LogOut
} from 'lucide-react';

interface MenuItem {
  label: string;
  icon: any;
  href: string;
}

export const Sidebar = () => {
  const pathname = usePathname(); // ดึง path ปัจจุบัน เช่น "/products"

  const menuItems: MenuItem[] = [
    { label: "แดชบอร์ด", icon: LayoutDashboard, href: "/" }, // หรือ "/dashboard" แล้วแต่ structure
    { label: "จัดการเครื่องประดับ", icon: Gem, href: "/products" },
    { label: "คำสั่งซื้อ", icon: ShoppingCart, href: "/orders" },
    { label: "จัดการเนื้อหา", icon: FileText, href: "/content" },
    { label: "จัดการลูกค้า", icon: Users, href: "/customers" },
    { label: "จัดการรีวิว", icon: Star, href: "/reviews" },
    { label: "บัญชีร้านค้า", icon: Settings, href: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 text-white flex flex-col z-50 shadow-xl"
      style={{ background: 'linear-gradient(160deg, #111111 0%, #2a2a2a 100%)' }}>

      {/* Logo Section */}
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/10 shadow-inner">
          <Gem className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-wide">Nudee Lucky</h1>
          <p className="text-xs text-gray-400">Game & Jewely</p>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          // ตรวจสอบว่า path ปัจจุบันตรงกับ href ของเมนูหรือไม่
          // ใช้ startsWith เพื่อให้ active เมื่ออยู่ใน sub-path ได้ด้วย (ถ้าต้องการ) 
          // หรือใช้ === ถ้าต้องการ exact match
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${isActive
                  ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm border border-white/10'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-white/10">
        <Link href="/logout" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-black-400 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">ออกจากระบบ</span>
        </Link>
      </div>
    </aside>
  );
};