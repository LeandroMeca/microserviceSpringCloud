package com.apigateway.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Simple GlobalFilter to log request method/uri/headers and response status.
 * Useful for debugging requests that pass through the gateway.
 */
@Component
public class RequestResponseLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(RequestResponseLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        try {
            logger.info("[GW] Incoming request: {} {}", request.getMethod(), request.getURI());
            request.getHeaders().forEach((name, values) -> logger.debug("[GW] Header: {}={} ", name, values));
        } catch (Exception ex) {
            logger.warn("[GW] Failed to log request headers: {}", ex.getMessage());
        }

        return chain.filter(exchange).doOnSuccess(aVoid -> {
            try {
                Integer status = exchange.getResponse().getStatusCode() != null ? exchange.getResponse().getStatusCode().value() : null;
                logger.info("[GW] Response for {} {} -> status={}", request.getMethod(), request.getURI(), status);
            } catch (Exception e) {
                logger.warn("[GW] Failed to log response status: {}", e.getMessage());
            }
        });
    }

    @Override
    public int getOrder() {
        // run early
        return -1;
    }
}
