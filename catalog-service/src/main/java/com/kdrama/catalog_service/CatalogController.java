package com.kdrama.catalog_service;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private List<CatalogItem> catalogItems = Arrays.asList(
            new CatalogItem("1", "City Hunter", "Action/Romance", 2011, 4.8),
            new CatalogItem("2", "Stranger Things", "Sci-Fi/Mystery", 2016, 4.7),
            new CatalogItem("3", "The Witcher", "Action/Fantasy", 2019, 4.5),
            new CatalogItem("4", "The Lord of the Rings", "Historical/Action", 2001, 4.9),
            new CatalogItem("5", "Vagabond", "Action/Thriller", 2019, 4.6)
    );

    @GetMapping
    public List<CatalogItem> getAllCatalog() {
        return catalogItems;
    }
}