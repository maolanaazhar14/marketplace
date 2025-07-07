package handlers

import (
	"ApasihShop/backend/database"
	"ApasihShop/backend/models"
	"encoding/json"
	"net/http"
)

// GetFinancialReportHandler mengambil laporan keuangan untuk penjual.
func GetFinancialReportHandler(w http.ResponseWriter, r *http.Request) {
	sellerID := r.Context().Value("userID").(string)

	var report models.FinancialReport
	err := database.DB.QueryRow(`
		SELECT
			COALESCE(SUM(t.total_price), 0) AS total_revenue,
			COALESCE(SUM(t.quantity), 0) AS total_items_sold,
			COALESCE(COUNT(t.id), 0) AS total_transactions
		FROM apasih.transactions t
		JOIN apasih.products p ON t.product_id = p.id
		WHERE p.seller_id = $1
	`, sellerID).Scan(&report.TotalRevenue, &report.TotalItemsSold, &report.TotalTransactions)

	if err != nil {
		http.Error(w, "Gagal mengambil laporan keuangan", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(report)
}
