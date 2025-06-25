package handlers

import (
	"ApasihShop/backend/database"
	"ApasihShop/backend/models"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

// CreateProductHandler menangani pembuatan produk baru.
func CreateProductHandler(w http.ResponseWriter, r *http.Request) {
	var product models.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Request body tidak valid", http.StatusBadRequest)
		return
	}

	// Ambil userID dari context yang diset oleh middleware
	sellerID := r.Context().Value("userID").(string)
	product.SellerID = sellerID

	err := database.DB.QueryRow(
		"INSERT INTO products (seller_id, name, description, price, stock) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at",
		product.SellerID, product.Name, product.Description, product.Price, product.Stock,
	).Scan(&product.ID, &product.CreatedAt, &product.UpdatedAt)

	if err != nil {
		log.Println("Error saat insert produk:", err)
		http.Error(w, "Gagal membuat produk baru", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

// GetProductsHandler mengambil semua produk yang ada di marketplace.
func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, seller_id, name, description, price, stock, created_at FROM products WHERE stock > 0 ORDER BY created_at DESC")
	if err != nil {
		http.Error(w, "Gagal mengambil data produk", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.SellerID, &p.Name, &p.Description, &p.Price, &p.Stock, &p.CreatedAt); err != nil {
			http.Error(w, "Gagal memindai data produk", http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// GetProductByIDHandler mengambil detail satu produk berdasarkan ID.
func GetProductByIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["id"]

	var p models.Product
	err := database.DB.QueryRow(
		"SELECT id, seller_id, name, description, price, stock, created_at FROM products WHERE id = $1",
		productID,
	).Scan(&p.ID, &p.SellerID, &p.Name, &p.Description, &p.Price, &p.Stock, &p.CreatedAt)

	if err != nil {
		http.Error(w, "Produk tidak ditemukan", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

// ... (Update dan Delete bisa ditambahkan dengan logika serupa, memeriksa seller_id dari token)
