package com.kdrama.catalog_service;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
@CrossOrigin(origins = "*")
public class CatalogController {

    private List<CatalogItem> catalogItems = Arrays.asList(
            new CatalogItem("1", "Vincenzo", "Action/Crime", 2021, 4.8),
            new CatalogItem("2", "Healer", "Action/Romance/Mystery", 2014, 4.7),
            new CatalogItem("3", "The K2", "Action/Thriller", 2016, 4.6),
            new CatalogItem("4", "Goblin", "Fantasy/Romance", 2016, 4.8),
            new CatalogItem("5", "Itaewon Class", "Drama/Revenge", 2020, 4.6),
            new CatalogItem("6", "Kingdom", "Historical/Action/Horror", 2019, 4.7),
            new CatalogItem("7", "Taxi Driver", "Action/Crime", 2021, 4.7),
            new CatalogItem("8", "Signal", "Thriller/Mystery", 2016, 4.8),
            new CatalogItem("9", "Arthdal Chronicles", "Fantasy/Action", 2019, 4.5),
            new CatalogItem("10", "Descendants of the Sun", "Action/Romance", 2016, 4.6)
    );

    @GetMapping
    public List<CatalogItem> getAllCatalog() {
        return catalogItems;
    }
}