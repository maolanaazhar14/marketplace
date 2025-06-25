package handlers

import (
	"ApasihShop/backend/auth"
	"ApasihShop/backend/database"
	"ApasihShop/backend/models"
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"

	"golang.org/x/crypto/bcrypt"
)

// RegisterHandler menangani logika registrasi user baru.
func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Request body tidak valid", http.StatusBadRequest)
		return
	}

	// Hash password sebelum disimpan
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Gagal mengenkripsi password", http.StatusInternalServerError)
		return
	}
	user.PasswordHash = string(hashedPassword)

	// Simpan ke database
	err = database.DB.QueryRow(
		"INSERT INTO apasih.users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id",
		user.Name, user.Email, user.PasswordHash,
	).Scan(&user.ID)

	if err != nil {
		log.Println("Error saat insert user:", err)
		http.Error(w, "Gagal membuat user baru", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User berhasil dibuat"})
}

// LoginHandler menangani logika login user.
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "Request body tidak valid", http.StatusBadRequest)
		return
	}

	// Debug: Print credential yang diterima
	fmt.Printf("Login attempt: email=%s\n", credentials.Email)
	fmt.Printf("Password length: %s\n", credentials.Password)

	// Validasi data wajib
	if credentials.Email == "" || credentials.Password == "" {
		fmt.Println("Email atau password kosong")
		http.Error(w, "Email dan password tidak boleh kosong", http.StatusBadRequest)
		return
	}

	// Validasi format email
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(credentials.Email) {
		fmt.Println("Format email tidak valid")
		http.Error(w, "Format email tidak valid", http.StatusBadRequest)
		return
	}

	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, password_hash FROM apasih.users WHERE email = $1",
		credentials.Email,
	).Scan(&user.ID, &user.PasswordHash)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Email atau password salah", http.StatusUnauthorized)
			return
		}
		http.Error(w, "Terjadi kesalahan server", http.StatusInternalServerError)
		return
	}

	// Debug: Verifikasi format hash
	fmt.Printf("Hash length: %d\n", len(user.PasswordHash))
	fmt.Printf("Hash starts with: %s\n", user.PasswordHash[:6]) // Harus $2a$ atau $2b$

	// Bandingkan password yang diinput dengan hash di DB
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(credentials.Password))
	fmt.Println(err)
	if err != nil {
		http.Error(w, "Email atau password salah", http.StatusUnauthorized)
		return
	}

	// Generate JWT
	token, err := auth.GenerateJWT(user.ID)
	if err != nil {
		http.Error(w, "Gagal membuat token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}
