package com.univerx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class UniversxApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniversxApplication.class, args);
        System.out.println("Started Spring Boot Business Backend on port 8080...");
    }

}
