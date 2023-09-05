package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.CategoryInDTO;
import edu.codespring.sportgh.dto.CategoryOutDTO;
import edu.codespring.sportgh.mapper.CategoryMapper;
import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.service.CategoryService;
import edu.codespring.sportgh.service.ImageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Objects;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;
    private final ImageService imageService;

    @GetMapping
    public ResponseEntity<Collection<CategoryOutDTO>> findAll() {
        Collection<Category> categories = categoryService.findAll();
        return new ResponseEntity<>(categoryMapper.categoriesToOuts(categories), HttpStatus.OK);
    }

    @GetMapping(path = "/{categoryId}")
    public ResponseEntity<CategoryOutDTO> findById(@PathVariable Long categoryId) {
        Category category = categoryService.findById(categoryId);
        if (category == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(categoryMapper.categoryToOut(category), HttpStatus.OK);
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

    private ResponseEntity<CategoryOutDTO> save(@Valid CategoryInDTO categoryInDTO) {
        Category category = categoryMapper.dtoToCategory(categoryInDTO);
        category.setImage(imageService.findById(categoryInDTO.getImageId()));
        categoryService.save(category);
        CategoryOutDTO categoryOutDTO = categoryMapper.categoryToOut(category);
        return new ResponseEntity<>(categoryOutDTO, HttpStatus.OK);
    }

    @PutMapping(path = "/{categoryId}")
    public ResponseEntity<CategoryOutDTO> update(@PathVariable Long categoryId,
                                                 @RequestBody @Valid CategoryInDTO categoryInDTO) {
        log.info("Updating category with ID {}.", categoryId);
        if (!Objects.equals(categoryId, categoryInDTO.getId())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!categoryService.existsById(categoryId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return save(categoryInDTO);
    }

    @PostMapping
    public ResponseEntity<CategoryOutDTO> create(@RequestBody @Valid CategoryInDTO categoryInDTO) {
        log.info("Creating category from {}.", categoryInDTO);
        if (categoryInDTO.getId() != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return save(categoryInDTO);
    }

    @GetMapping(path = "/count")
    public ResponseEntity<Long> count() {
        return new ResponseEntity<>(categoryService.count(), HttpStatus.OK);
    }
}

