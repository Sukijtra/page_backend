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
  <aside className="w-67 h-screen fixed left-0 top-0 bg-white text-black flex flex-col z-50 shadow-xl">

    {/* Logo Section */}
    <div className="px-1 py-1 border-b border-black/10 flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Nudee Lucky Logo"
        className="w-19 h-19 object-contain"
      />
      <div>
        <h1 className="font-bold text-l tracking-wide">Nudee Lucky</h1>
        <p className="text-xs text-gray-600">Game & Jewely</p>
      </div>
    </div>

    {/* Menu Section */}
    <nav className="flex-1 px-4 py-6 space-y-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg
              ${isActive
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>

    {/* Footer */}
    <div className="p-4 border-t border-black/10">
      <Link href="/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-100">
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">ออกจากระบบ</span>
      </Link>
    </div>

  </aside>
);
};