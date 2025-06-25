package database

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq" // Driver PostgreSQL
)

var DB *sql.DB

// ConnectDB menginisialisasi koneksi ke database PostgreSQL.
func ConnectDB() {
	var err error
	// Ganti dengan detail koneksi database Anda
	connStr := "user=postgres password=postgres host=localhost port=5432 dbname=postgres sslmode=disable"
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Gagal terhubung ke database:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("Gagal melakukan ping ke database:", err)
	}

	fmt.Println("Berhasil terhubung ke database!")
}
