package com.example.api.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Record Java para schema Product
 * Baseado em estrutura típica de API de produtos
 * 
 * ATENÇÃO: Este é um exemplo genérico. Após configurar o Apidog MCP,
 * execute: "Busque a especificação do schema Product e gere records Java"
 * para obter a estrutura exata da sua API.
 */
public record Product(
    @JsonProperty("id")
    UUID id,
    
    @JsonProperty("name")
    String name,
    
    @JsonProperty("description")
    String description,
    
    @JsonProperty("price")
    Double price,
    
    @JsonProperty("currency")
    String currency,
    
    @JsonProperty("sku")
    String sku,
    
    @JsonProperty("category")
    String category,
    
    @JsonProperty("categoryId")
    UUID categoryId,
    
    @JsonProperty("stock")
    Integer stock,
    
    @JsonProperty("inStock")
    Boolean inStock,
    
    @JsonProperty("images")
    List<String> images,
    
    @JsonProperty("tags")
    List<String> tags,
    
    @JsonProperty("status")
    ProductStatus status,
    
    @JsonProperty("metadata")
    ProductMetadata metadata,
    
    @JsonProperty("createdAt")
    LocalDateTime createdAt,
    
    @JsonProperty("updatedAt")
    LocalDateTime updatedAt
) {
    /**
     * Enum para status do produto
     */
    public enum ProductStatus {
        @JsonProperty("active")
        ACTIVE,
        
        @JsonProperty("inactive")
        INACTIVE,
        
        @JsonProperty("draft")
        DRAFT,
        
        @JsonProperty("archived")
        ARCHIVED
    }
    
    /**
     * Record para metadados adicionais do produto
     */
    public record ProductMetadata(
        @JsonProperty("brand")
        String brand,
        
        @JsonProperty("model")
        String model,
        
        @JsonProperty("weight")
        Double weight,
        
        @JsonProperty("dimensions")
        ProductDimensions dimensions,
        
        @JsonProperty("specifications")
        java.util.Map<String, String> specifications
    ) {}
    
    /**
     * Record para dimensões do produto
     */
    public record ProductDimensions(
        @JsonProperty("length")
        Double length,
        
        @JsonProperty("width")
        Double width,
        
        @JsonProperty("height")
        Double height,
        
        @JsonProperty("unit")
        String unit
    ) {}
}

/**
 * Record para criação de produto (sem campos gerados)
 */
public record CreateProductRequest(
    @JsonProperty("name")
    String name,
    
    @JsonProperty("description")
    String description,
    
    @JsonProperty("price")
    Double price,
    
    @JsonProperty("currency")
    String currency,
    
    @JsonProperty("sku")
    String sku,
    
    @JsonProperty("categoryId")
    UUID categoryId,
    
    @JsonProperty("stock")
    Integer stock,
    
    @JsonProperty("images")
    List<String> images,
    
    @JsonProperty("tags")
    List<String> tags,
    
    @JsonProperty("metadata")
    Product.ProductMetadata metadata
) {}

/**
 * Record para atualização de produto (todos campos opcionais)
 */
public record UpdateProductRequest(
    @JsonProperty("name")
    String name,
    
    @JsonProperty("description")
    String description,
    
    @JsonProperty("price")
    Double price,
    
    @JsonProperty("stock")
    Integer stock,
    
    @JsonProperty("status")
    Product.ProductStatus status,
    
    @JsonProperty("images")
    List<String> images,
    
    @JsonProperty("tags")
    List<String> tags,
    
    @JsonProperty("metadata")
    Product.ProductMetadata metadata
) {}

/**
 * Record para resposta de lista de produtos
 */
public record ProductListResponse(
    @JsonProperty("products")
    List<Product> products,
    
    @JsonProperty("total")
    Long total,
    
    @JsonProperty("page")
    Integer page,
    
    @JsonProperty("pageSize")
    Integer pageSize,
    
    @JsonProperty("totalPages")
    Integer totalPages
) {}


