package com.kdrama.catalog_service;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CatalogItem {
    private String id;
    private String title;
    private String category;
    private int releaseYear;
    private double rating;
}