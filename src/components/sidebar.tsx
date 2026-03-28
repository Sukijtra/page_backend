"use client"; // จำเป็นต้องใส่เพื่อให้ใช้ hooks ได้

import React, { useState } from 'react';
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
  LogOut,
  ChevronDown
} from 'lucide-react';

interface MenuItem {
  label: string;
  icon: any;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
}

export const Sidebar = () => {
  const pathname = usePathname(); // ดึง path ปัจจุบัน เช่น "/products"
  const [openJewelry, setOpenJewelry] = useState(
  pathname.startsWith("/products")
);

  const menuItems: MenuItem[] = [
    { label: "แดชบอร์ด", icon: LayoutDashboard, href: "/" }, // หรือ "/dashboard" แล้วแต่ structure
    {
      label: "จัดการเครื่องประดับ",
      icon: Gem,
     children: [
    { label: "รายการสินค้า", href: "/products" },
    { label: "จัดการหมวดหมู่เพชร", href: "/products/diamond" },
    { label: "จัดการหมวดหมู่เครื่องประดับ", href: "/products/jewelry" },
    { label: "จัดการหมวดหมู่โลหะ", href: "/products/metal" },
    { label: "จัดการไซส์แหวน", href: "/products/ring" },
  ],  
    },
    { label: "คำสั่งซื้อ", icon: ShoppingCart, href: "/orders" },
    { label: "จัดการเนื้อหา", icon: FileText, href: "/content" },
    { label: "จัดการลูกค้า", icon: Users, href: "/customers" },
    { label: "จัดการรีวิว", icon: Star, href: "/reviews" },
    { label: "บัญชีร้านค้า", icon: Settings, href: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white text-black flex flex-col z-50 shadow-xl">

      {/* Logo Section */}
      <div className="px-1 py-1 border-b border-black/10 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Nudee Lucky Logo"
          className="w-19 h-19 object-contain"
        />
        <div>
          <h1 className="font-bold text-l tracking-wide">Nudee Lucky</h1>
          <p className="text-xs text-gray-600">Game & Jewely. </p>
        </div>
      </div>

      {/* Menu Section */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {

          if (item.children) {
            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenJewelry(!openJewelry)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${openJewelry ? "rotate-180" : ""}`}
                  />
                </button>

                {openJewelry && (
                  <div className="ml-10 mt-1 flex flex-col gap-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`text-sm px-3 py-2 rounded-md
                        ${
                          pathname === child.href
                            ? "bg-gray-200 text-black"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname.startsWith(item.href || "");

          return (
            <Link
              key={item.href}
              href={item.href!}
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