package com.tuncode.ecommerce.dao;

import com.tuncode.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin(value = "http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {

    // search/findByCategoryId?id=..
    Page<Product> findByCategoryId(@RequestParam("id") Long id, Pageable pageable);

    // SELECT * FROM Product WHERE s.name LIKE CONCAT ('%',:name,'%')
    // search/findByNameContaining?name=..
    Page<Product> findByNameContaining(@RequestParam("name") String name, Pageable pageable);
}
