package middleware

import (
	"ApasihShop/backend/auth"
	"context"
	"net/http"
	"strings"
)

// AuthMiddleware adalah middleware untuk memproteksi endpoint yang memerlukan otentikasi.
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Header Authorization tidak ditemukan", http.StatusUnauthorized)
			return
		}

		// Header format: "Bearer <token>"
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader { // Jika tidak ada prefix "Bearer "
			http.Error(w, "Format token salah", http.StatusUnauthorized)
			return
		}

		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			http.Error(w, "Token tidak valid", http.StatusUnauthorized)
			return
		}

		// Simpan user_id di context request agar bisa diakses oleh handler selanjutnya
		ctx := context.WithValue(r.Context(), "userID", claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
