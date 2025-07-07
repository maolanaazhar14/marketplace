import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './MyProductsPage.css'; // Buat CSS baru untuk halaman ini

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await api.get('/products'); // Panggil endpoint baru
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal mengambil produk saya:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProducts();
  }, []);

  if (loading) return <p>Loading produk Anda...</p>;

  return (
    <div className="my-products-container">
      <h1>Produk Saya</h1>
      {products.length === 0 ? (
        <p>Anda belum memiliki produk untuk dijual. <Link to="/sell">Jual sekarang!</Link></p>
      ) : (
        <table className="products-table">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>Rp {product.price.toLocaleString('id-ID')}</td>
                <td>{product.stock}</td>
                <td>
                  <Link to={`/edit-product/${product.id}`} className="edit-button">
                    Beli lagi
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyProductsPage;