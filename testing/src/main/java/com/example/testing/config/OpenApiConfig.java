package com.example.testing.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI tasklyOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("Taskly API")
                .description("API REST para la gestion de tareas de Taskly.")
                .version("1.0.0"));
    }
}
