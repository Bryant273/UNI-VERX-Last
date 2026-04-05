package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func JwtMiddleware(secret string, rdb *redis.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Skip for public routes
			if strings.HasPrefix(r.URL.Path, "/api/auth/login") || strings.HasPrefix(r.URL.Path, "/api/auth/register") {
				next.ServeHTTP(w, r)
				return
			}

			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Missing Authorization Header", http.StatusUnauthorized)
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
				}
				return []byte(secret), nil
			})

			if err != nil || !token.Valid {
				http.Error(w, "Invalid Token", http.StatusUnauthorized)
				return
			}

			// Blacklist Check (Zero-Trust)
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				if jti, ok := claims["jti"].(string); ok {
					blacklisted, _ := rdb.Exists(ctx, fmt.Sprintf("blacklist_%s", jti)).Result()
					if blacklisted > 0 {
						http.Error(w, "Token Revoked", http.StatusUnauthorized)
						return
					}
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
