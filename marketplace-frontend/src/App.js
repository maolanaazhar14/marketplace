import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // Anda perlu membuat file ini
import SellProductPage from './pages/SellingProductPage'; // Anda perlu membuat file ini
import ReportPage from './pages/ReportPage'; // Anda perlu membuat file ini
import MyProductsPage from './pages/MyProductsPage';
import EditProductPage from './pages/EditProductPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="container">
          <Routes>
            {/* Rute Publik */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/my-products"
              element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>}
            />
            <Route
              path="/edit-product/:id"
              element={<ProtectedRoute><EditProductPage /></ProtectedRoute>}
            />

            {/* Rute Terproteksi */}
            <Route
              path="/sell"
              element={
                <ProtectedRoute>
                  <SellProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ReportPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
