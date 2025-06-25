package models

import "time"

// User merepresentasikan struktur data pengguna di database.
type User struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"` // Jangan kirim password hash ke client
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Product merepresentasikan struktur data produk di database.
type Product struct {
	ID          string    `json:"id"`
	SellerID    string    `json:"seller_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Price       int64     `json:"price"`
	Stock       int       `json:"stock"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Transaction merepresentasikan struktur data transaksi.
type Transaction struct {
	ID         string    `json:"id"`
	BuyerID    string    `json:"buyer_id"`
	ProductID  string    `json:"product_id"`
	Quantity   int       `json:"quantity"`
	TotalPrice int64     `json:"total_price"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"created_at"`
}

// FinancialReport merepresentasikan data laporan keuangan.
type FinancialReport struct {
	TotalRevenue      int64 `json:"total_revenue"`
	TotalItemsSold    int   `json:"total_items_sold"`
	TotalTransactions int   `json:"total_transactions"`
}
