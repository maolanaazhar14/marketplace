package handlers

import (
	"ApasihShop/backend/database"
	"database/sql"
	"encoding/json"
	"net/http"
)

// BuyProductHandler menangani logika Penjualan produk.
func BuyProductHandler(w http.ResponseWriter, r *http.Request) {
	var req struct {
		ProductID string `json:"product_id"`
		Quantity  int    `json:"quantity"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Request body tidak valid", http.StatusBadRequest)
		return
	}

	if req.Quantity <= 0 {
		http.Error(w, "Kuantitas harus lebih dari 0", http.StatusBadRequest)
		return
	}

	buyerID := r.Context().Value("userID").(string)

	// Gunakan transaksi database untuk memastikan atomicity
	tx, err := database.DB.Begin()
	if err != nil {
		http.Error(w, "Gagal memulai transaksi", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback() // Rollback jika ada error

	// 1. Ambil data produk dan lock row untuk update
	var price int64
	var stock int
	err = tx.QueryRow("SELECT price, stock FROM apasih.products WHERE id = $1 FOR UPDATE", req.ProductID).Scan(&price, &stock)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Produk tidak ditemukan", http.StatusNotFound)
			return
		}
		http.Error(w, "Gagal mengambil data produk", http.StatusInternalServerError)
		return
	}

	// 2. Cek stok
	if stock < req.Quantity {
		http.Error(w, "Stok tidak mencukupi", http.StatusBadRequest)
		return
	}

	// 3. Kurangi stok
	newStock := stock - req.Quantity
	_, err = tx.Exec("UPDATE apasih.products SET stock = $1 WHERE id = $2", newStock, req.ProductID)
	if err != nil {
		http.Error(w, "Gagal mengupdate stok produk", http.StatusInternalServerError)
		return
	}

	// 4. Catat transaksi
	totalPrice := price * int64(req.Quantity)
	_, err = tx.Exec(
		"INSERT INTO apasih.transactions (buyer_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)",
		buyerID, req.ProductID, req.Quantity, totalPrice,
	)
	if err != nil {
		http.Error(w, "Gagal mencatat transaksi", http.StatusInternalServerError)
		return
	}

	// 5. Jika semua berhasil, commit transaksi
	if err := tx.Commit(); err != nil {
		http.Error(w, "Gagal menyelesaikan transaksi", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Penjualan berhasil"})
}
