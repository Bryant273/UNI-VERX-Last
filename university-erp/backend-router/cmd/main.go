package main

import (
	"fmt"
	"log"
	"net/http"
	"backend-router/internal/config"
	"backend-router/internal/routes"
	"github.com/redis/go-redis/v9"
)

func main() {
	fmt.Println("Starting UNI-VERX API Gateway...")
	
	cfg := config.LoadConfig()
	
	rdb := redis.NewClient(&redis.Options{
		Addr: strings.TrimPrefix(cfg.RedisURL, "redis://"),
	})

	router := routes.SetupRouter(cfg, rdb)

	server := &http.Server{
		Handler: router,
		Addr:    ":" + cfg.Port,
	}

	fmt.Printf("Gateway running on port %s 🚀\n", cfg.Port)
	fmt.Printf("Routing /api/auth    -> %s\n", cfg.RustAuthURL)
	fmt.Printf("Routing /api/business -> %s\n", cfg.SpringBootURL)

	log.Fatal(server.ListenAndServe())
}
