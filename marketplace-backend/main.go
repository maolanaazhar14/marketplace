package main

import (
	"ApasihShop/backend/database"
	"ApasihShop/backend/handlers"
	"ApasihShop/backend/middleware"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	// Koneksi ke database
	database.ConnectDB()

	// Inisialisasi router
	r := mux.NewRouter()

	// Rute publik (tanpa otentikasi)
	r.HandleFunc("/api/register", handlers.RegisterHandler).Methods("POST")
	r.HandleFunc("/api/login", handlers.LoginHandler).Methods("POST")
	r.HandleFunc("/api/products", handlers.GetProductsHandler).Methods("GET")
	r.HandleFunc("/api/products/{id}", handlers.GetProductByIDHandler).Methods("GET")

	// Rute yang memerlukan otentikasi
	api := r.PathPrefix("/api").Subrouter()
	api.Use(middleware.AuthMiddleware)
	api.HandleFunc("/products", handlers.CreateProductHandler).Methods("POST")
	api.HandleFunc("/transactions/buy", handlers.BuyProductHandler).Methods("POST")
	api.HandleFunc("/reports/financial", handlers.GetFinancialReportHandler).Methods("GET")
	// Tambahkan rute PUT dan DELETE untuk produk di sini jika diperlukan
	api.HandleFunc("/products/{id}", handlers.UpdateProductHandler).Methods("PUT")
	// api.HandleFunc("/products/{id}", handlers.DeleteProductHandler).Methods("DELETE")

	// Konfigurasi CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // Sesuaikan dengan URL frontend Anda
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	handler := c.Handler(r)

	// Jalankan server
	log.Println("Server berjalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}
