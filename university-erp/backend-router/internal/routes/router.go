package routes

import (
	"log"
	"net/http"
	"github.com/gorilla/mux"
	"backend-router/internal/config"
	"backend-router/internal/proxy"
	"github.com/redis/go-redis/v9"
	"backend-router/internal/middleware"
)

func SetupRouter(cfg config.Config, rdb *redis.Client) *mux.Router {
	r := mux.NewRouter()

	// Apply global middleware
	r.Use(middleware.LoggerMiddleware)
	r.Use(middleware.CorsMiddleware)
	r.Use(middleware.AdaptiveShield(rdb)) // The new AI Gateway Army Shield layer
	r.Use(middleware.RateLimiterMiddleware)
	r.Use(middleware.GzipMiddleware)
	r.Use(middleware.JwtMiddleware(cfg.JwtSecret, rdb))

	// Create proxies
	authProxy, err := proxy.NewProxy(cfg.RustAuthURL)
	if err != nil {
		log.Fatalf("Failed to create auth proxy: %v", err)
	}

	businessProxy, err := proxy.NewProxy(cfg.SpringBootURL)
	if err != nil {
		log.Fatalf("Failed to create business proxy: %v", err)
	}

	// Setup routes
	api := r.PathPrefix("/api").Subrouter()

	// Auth routes (Rust)
	api.PathPrefix("/auth/").Handler(http.StripPrefix("/api/auth", authProxy))
	
	// Business routes (Spring Boot)
	api.PathPrefix("/business/departments/").Handler(http.StripPrefix("/api/business", businessProxy))
	api.PathPrefix("/business/enrollments/").Handler(http.StripPrefix("/api/business", businessProxy))
	api.PathPrefix("/business/grades/").Handler(http.StripPrefix("/api/business", businessProxy))
	
	// Default business fallback
	api.PathPrefix("/business/").Handler(http.StripPrefix("/api/business", businessProxy))

	// Health check
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Gateway is healthy"))
	}).Methods("GET")

	return r
}
