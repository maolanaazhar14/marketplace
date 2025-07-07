// src/pages/EditProductPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Form.css'; // Kita bisa pakai style form yang sama

const EditProductPage = () => {
  const { id } = useParams(); // Ambil ID produk dari URL
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({ name: '', description: '', price: 0, stock: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Ambil data produk yang ada untuk mengisi form
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data produk.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fungsi untuk handle perubahan di form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // 2. Fungsi untuk submit perubahan
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const updatedData = {
          ...product,
          price: parseInt(product.price, 10),
          stock: parseInt(product.stock, 10),
      };
      await api.put(`/products/${id}`, updatedData);
      setSuccess('Produk berhasil diperbarui!');
      setTimeout(() => navigate('/my-products'), 1500); // Kembali ke daftar produk
    } catch (err) {
      setError('Gagal memperbarui produk.');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Edit Produk</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          type="text"
          name="name"
          placeholder="Nama Produk"
          value={product.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Deskripsi Produk"
          value={product.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Harga (Rp)"
          value={product.price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stok Barang"
          value={product.stock}
          onChange={handleChange}
          required
        />
        <button type="submit">Simpan Perubahan</button>
      </form>
    </div>
  );
};

export default EditProductPage;