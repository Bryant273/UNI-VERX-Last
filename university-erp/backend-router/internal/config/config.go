package config

import (
	"os"
)

type Config struct {
	Port          string
	RustAuthURL   string
	SpringBootURL string
	JwtSecret     string
	RedisURL      string
}

func LoadConfig() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	rustURL := os.Getenv("RUST_AUTH_URL")
	if rustURL == "" {
		rustURL = "http://127.0.0.1:8001"
	}

	springURL := os.Getenv("SPRING_BUSINESS_URL")
	if springURL == "" {
		springURL = "http://127.0.0.1:8080"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "your-256-bit-secret"
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://127.0.0.1:6379/0"
	}

	return Config{
		Port:          port,
		RustAuthURL:   rustURL,
		SpringBootURL: springURL,
		JwtSecret:     jwtSecret,
		RedisURL:      redisURL,
	}
}
