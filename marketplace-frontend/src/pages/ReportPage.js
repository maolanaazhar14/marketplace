import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ReportPage.css'; // CSS khusus untuk halaman laporan

// Halaman untuk menampilkan laporan keuangan penjual
const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reports/financial');
        setReport(response.data);
      } catch (err) {
        setError('Gagal memuat laporan keuangan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="error">{error}</p>;

  // Format angka ke format mata uang Rupiah
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="report-container">
      <h1>Laporan Penjualan Anda</h1>
      {report ? (
        <div className="report-grid">
          <div className="report-card">
            <h3>Total Pendapatan</h3>
            <p className="report-value revenue">{formatCurrency(report.total_revenue)}</p>
          </div>
          <div className="report-card">
            <h3>Barang Terjual</h3>
            <p className="report-value">{report.total_items_sold}</p>
          </div>
          <div className="report-card">
            <h3>Jumlah Transaksi</h3>
            <p className="report-value">{report.total_transactions}</p>
          </div>
        </div>
      ) : (
        <p>Belum ada data untuk ditampilkan.</p>
      )}
    </div>
  );
};

export default ReportPage;