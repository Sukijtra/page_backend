'use client'
import React, { useState, useEffect } from 'react';
import '@/app/css/homeadmin.css';
import {
  ShoppingCart, Users, Star, Bell, ArrowUpRight,
  DollarSign, Package, TrendingUp,
  PieChart as PieIcon, BarChart as BarChartIcon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart,
  AreaChart, Area, Pie, Cell
} from 'recharts';
import { Sidebar } from '@/components/sidebar'

const COLORS = ['#1f2937', '#4b5563', '#9ca3af', '#d1d5db', '#e5e7eb'];

const StatCard = ({ title, value, growth, trend, icon: Icon, colorClass }: any) => (
  <div className="stat-card">
    <div className="stat-header">
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
      </div>
      <div className={`stat-icon ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>

    <div className="stat-footer">
      <span className={`growth-badge ${trend === 'up'
        ? 'bg-emerald-50 text-emerald-600'
        : 'bg-red-100 text-red-600'
        }`}>
        {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
        {growth}
      </span>
      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
        ข้อมูลล่าสุดจากระบบ
      </span>
    </div>
  </div>
);

const DashboardContent = () => {

  const [data, setData] = useState<any>({
    stats: {
      orders: 0,
      revenue: 0,
      products: 0,
      users: 0
    },
    monthlySales: [],
    categoryData: [],
    topProducts: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {

    const fetchDashboardData = async () => {
      try {

        const response = await fetch('http://localhost:8080/api/admin/summary');

        if (!response.ok) {
          throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        }

        const result = await response.json();

        console.log("API RESULT =>", result);

        setData({
          stats: result.stats || {},
          monthlySales: result.monthlySales || [],
          categoryData: result.categoryData || [],
          topProducts: result.topProducts || []
        });

      } catch (err: any) {

        console.error("Fetch Error:", err);
        setError(err.message);

      } finally {

        setLoading(false);

      }
    };

    fetchDashboardData();

  }, []);


  if (loading) {
    return (
      <div className="p-10 text-center font-bold">
        กำลังโหลดข้อมูลจากฐานข้อมูล...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
         เกิดข้อผิดพลาด: {error}
        <br />
        <span className="text-sm font-normal text-gray-500">
          ตรวจสอบว่ารัน Backend (python3 app.py) แล้วหรือยัง
        </span>
      </div>
    )
  }

  return (

    <div className="dashboard-container animate-in">

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>แดชบอร์ด</h2>
          <p>ภาพรวมข้อมูลจริงจากร้าน (Live Data)</p>
        </div>

        <button className="bell-button">
          <Bell className="w-6 h-6" />
          <span className="notif-dot"></span>
        </button>
      </div>


      {/* Stat Cards */}
      <div className="stats-grid">

        <StatCard
          title="คำสั่งซื้อทั้งหมด"
          value={data.stats.orders}
          growth="Live"
          trend="up"
          icon={ShoppingCart}
          colorClass="bg-blue-50"
        />

        <StatCard
          title="ยอดขายทั้งหมด"
          value={`฿${Number(data.stats.revenue).toLocaleString()}`}
          growth="บาท"
          trend="up"
          icon={DollarSign}
          colorClass="bg-emerald-50"
        />

        <StatCard
          title="สินค้าทั้งหมด"
          value={data.stats.products}
          growth="รายการ"
          trend="up"
          icon={Package}
          colorClass="bg-indigo-50"
        />

        <StatCard
          title="จำนวนลูกค้า"
          value={data.stats.users}
          growth="คน"
          trend="up"
          icon={Users}
          colorClass="bg-emerald-50"
        />

      </div>


      {/* Monthly Sales Chart */}
      <div className="chart-card">

        <div className="chart-title-box">
          <div className="chart-icon-bg blue">
            <BarChartIcon className="chart-icon blue-icon" />
          </div>

          <h3 className="chart-title">
            ยอดขายรายเดือน
          </h3>
        </div>

        <div style={{ width: '100%', height: 350 }}>

          <ResponsiveContainer>

            <BarChart data={data.monthlySales}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip formatter={(v: any) => `฿${v}`} />

              <Bar dataKey="total" fill="#374151" />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* Top Products */}
      <div className="products-container mt-6">

        <div className="chart-title-box" style={{ marginBottom: 24 }}>
          <div className="chart-icon-bg bg-orange-50">
            <Star className="w-4 h-4 text-orange-600" />
          </div>

          <h3>สินค้าขายดี Top 5</h3>
        </div>


        <div className="table-container">

          <table className="data-table">

            <thead>
              <tr>
                <th>อันดับ</th>
                <th>สินค้า</th>
                <th>ประเภท</th>
                <th>ราคา</th>
              </tr>
            </thead>


            <tbody>

              {Array.isArray(data.topProducts) &&
                data.topProducts.map((product: any, index: number) => (

                  <tr key={product.product_id}>

                    <td>#{index + 1}</td>

                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>

                        <img
                          src={`http://localhost:8080${product.product_image}`}
                          width={40}
                        />

                        {product.product_name}

                      </div>
                    </td>

                    <td>
                      {product.category_name || 'ทั่วไป'}
                    </td>

                    <td>
                      ฿{Number(product.price).toLocaleString()}
                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default function App() {

  return (
    <div className="main-layout">

      <Sidebar />

      <main className="content-wrapper">

        <DashboardContent />

      </main>

    </div>
  );

}