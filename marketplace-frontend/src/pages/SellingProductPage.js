import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Form.css'; // Menggunakan CSS yang sama

// Halaman untuk penjual menambahkan produk baru
const SellProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const productData = {
        name,
        description,
        price: parseInt(price, 10), // Konversi ke integer
        stock: parseInt(stock, 10), // Konversi ke integer
      };

      await api.post('/products', productData);
      setSuccess('Produk berhasil ditambahkan!');
      
      // Reset form atau redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (err) {
      setError('Gagal menambahkan produk. Pastikan semua data terisi benar.');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Pembelian Barang</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          type="text"
          placeholder="Nama Produk"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Deskripsi Produk"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Harga (Rp)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
        />
        <input
          type="number"
          placeholder="Stok Barang"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          min="0"
        />
        <button type="submit">Tambahkan Produk</button>
      </form>
    </div>
  );
};

export default SellProductPage;