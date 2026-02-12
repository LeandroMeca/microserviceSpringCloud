package com.apigateway.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
    // Permitir apenas origens confiáveis em desenvolvimento
    // Ajuste ou adicione domínios conforme seu ambiente (ex: staging/prod).
    config.addAllowedOrigin("http://localhost:4200");
    config.addAllowedOrigin("http://127.0.0.1:4200");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
    config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
