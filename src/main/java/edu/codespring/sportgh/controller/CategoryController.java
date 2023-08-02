package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.CategoryInDTO;
import edu.codespring.sportgh.dto.CategoryOutDTO;
import edu.codespring.sportgh.mapper.CategoryMapper;
import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<Collection<CategoryOutDTO>> findAll() {
        Collection<Category> categories = categoryService.findAll();
        return new ResponseEntity<>(categoryMapper.categoriesToOuts(categories), HttpStatus.OK);
    }

    @GetMapping(path = "/{categoryId}")
    public ResponseEntity<CategoryOutDTO> findById(@PathVariable Long categoryId) {
        // TODO: Implement this method so it loads the products of the category as well.
        Optional<Category> category = categoryService.findById(categoryId);
        if (category.isEmpty()) {
            log.warn("Category with ID {} not found.", categoryId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(categoryMapper.categoryToOut(category.get()), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{categoryId}")
    public ResponseEntity<?> deleteById(@PathVariable Long categoryId) {
        log.info("Deleting category with ID {}.", categoryId);
        categoryService.delete(categoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll() {
        categoryService.deleteAll();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/{categoryId}")
    @PutMapping(path = "/{categoryId}")
    public ResponseEntity<CategoryOutDTO> save(@PathVariable(required = false)
                                               Long categoryId, @RequestBody CategoryInDTO categoryInDTO) {
        log.info("Saving category with ID {}.", categoryId);
        Category category = categoryMapper.dtoToCategory(categoryInDTO);
        category.setId(categoryId); // If id is null, it creates a new Category, else it updates the existing one
        categoryService.save(category);
        CategoryOutDTO categoryOutDTO = categoryMapper.categoryToOut(category);

        return new ResponseEntity<>(categoryOutDTO, categoryId == null ? HttpStatus.CREATED : HttpStatus.OK);
    }


    @GetMapping(path = "/count")
    public ResponseEntity<Long> count() {
        return new ResponseEntity<>(categoryService.count(), HttpStatus.OK);
    }
}

