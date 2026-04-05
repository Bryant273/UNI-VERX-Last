FROM golang:1.21-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o gateway cmd/main.go

FROM alpine:latest
WORKDIR /app
COPY --from=build /app/gateway .
EXPOSE 8000
CMD ["./gateway"]
