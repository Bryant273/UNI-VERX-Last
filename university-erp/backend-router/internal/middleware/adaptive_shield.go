package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/redis/go-redis/v9"
)

// AdaptiveShield reads Redis for blocked IPs or high-load signals
func AdaptiveShield(rdb *redis.Client) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get IP
			ip := r.RemoteAddr
			if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
				ip = strings.Split(forwarded, ",")[0]
			}
			ip = strings.Split(ip, ":")[0]

			// Fast check in Redis if IP is in the "blacklisted_ips" set
			// (Assuming Rust Security pushes to this set)
			isBlocked, err := rdb.SIsMember(context.Background(), "blacklisted_ips", ip).Result()
			if err == nil && isBlocked {
				http.Error(w, "AI Adaptive Shield: IP Blocked", http.StatusTooManyRequests)
				return
			}

			// Load shedding check / Chaos simulation
			// If chaos engine sets 'gateway:panic' = 'true', we shed 30% load randomly
			panicMode, _ := rdb.Get(context.Background(), "gateway:panic").Result()
			if panicMode == "true" {
			    // Simplified random drop for the 'Army' simulation
				// Random logic could be added, but for now just pass to next
				// In a real system, we'd check current concurrent requests
			}

			next.ServeHTTP(w, r)
		})
	}
}
