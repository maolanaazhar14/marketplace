import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './HomePage.css'; // Buat file CSS untuk styling

// Halaman utama untuk menampilkan semua produk
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({}); // Menyimpan quantity tiap produk

  useEffect(() => {
    // Fungsi untuk mengambil data produk dari backend
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/products');
        setProducts(response.data);
        setError('');
      } catch (err) {
        setError('Gagal memuat produk. Coba lagi nanti.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fungsi untuk membeli produk
  const handleBuy = async (productId) => {
    const quantity = quantities[productId] || 1; // Default ke 1 kalau kosong

    if (quantity <= 0) {
      alert('Jumlah harus lebih dari 0');
      return;
    }

    try {
      await api.post('/transactions/buy', { product_id: productId, quantity });
      alert('Produk berhasil dijual!');
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (err) {
      alert('Gagal menjual produk: ' + (err.response?.data || err.message));
    }
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(value) || 1, // Pastikan angka, default 1
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="homepage">
      <h1>Produk Tersedia</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="price">Rp {product.price.toLocaleString('id-ID')}</p>
            <p>Stok: {product.stock}</p>
            
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantities[product.id] || 1}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              style={{ width: '60px', marginRight: '10px' }}
            />
            <button onClick={() => handleBuy(product.id)}>Jual</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;