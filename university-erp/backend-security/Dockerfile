FROM rust:1.75-slim AS build
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=build /app/target/release/backend-security .
EXPOSE 8081
CMD ["./backend-security"]
