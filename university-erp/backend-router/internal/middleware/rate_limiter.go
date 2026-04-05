package middleware

import (
	"net/http"
	"sync"
	"time"
)

type client struct {
	count int
	lastSeen time.Time
}

var (
	clients = make(map[string]*client)
	mu sync.Mutex
)

// RateLimiterMiddleware limits requests per IP (simple memory-based for now)
func RateLimiterMiddleware(next http.Handler) http.Handler {
	// Cleanup routine could be added here
	
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr // In production, parse X-Forwarded-For if behind a load balancer
		
		mu.Lock()
		c, exists := clients[ip]
		if !exists {
			clients[ip] = &client{count: 1, lastSeen: time.Now()}
			mu.Unlock()
			next.ServeHTTP(w, r)
			return
		}
		
		// Reset count if a minute has passed
		if time.Since(c.lastSeen) > time.Minute {
			c.count = 0
		}
		
		c.count++
		c.lastSeen = time.Now()
		
		// Limit to 100 requests per minute
		if c.count > 100 {
			mu.Unlock()
			http.Error(w, "Rate limit exceeded", http.StatusTooManyRequests)
			return
		}
		mu.Unlock()
		
		next.ServeHTTP(w, r)
	})
}
