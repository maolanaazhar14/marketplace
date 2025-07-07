import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Form.css'; // Menggunakan CSS yang sama dengan form lain

// Halaman untuk registrasi pengguna baru
const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fungsi untuk menangani submit form registrasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi sederhana
    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    try {
      // Menggunakan 'password' di frontend, backend akan menerima dan menghashnya
      // Nama field di backend adalah 'password_hash' tapi kita kirim sbg 'password'
      // Model Go Anda harus disesuaikan untuk menerima `Password` saat decoding JSON jika perlu
      // Untuk simplicity, kita asumsikan backend menerima `password_hash` dan kita isi dengan password biasa
      await api.post('/register', { name, email, password_hash: password });
      setSuccess('Registrasi berhasil! Silakan login.');
      // Redirect ke halaman login setelah 2 detik
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('Registrasi gagal. Email mungkin sudah digunakan.');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <input
          type="text"
          placeholder="Nama Lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;