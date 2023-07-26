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

    @RequestMapping(method = RequestMethod.GET)
    public Collection<CategoryOutDTO> findAllCategories() {
        Collection<Category> categories = categoryService.findAllCategories();
        return categoryMapper.categoriesToOuts(categories);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/{categoryId}")
    public CategoryOutDTO findById(@PathVariable Long categoryId) {
        // TODO: Implement this method so it loads the products of the category as well.
        Optional<Category> category = categoryService.findById(categoryId);
        if (category.isEmpty()) {
            log.warn("Category with ID {} not found.", categoryId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return categoryMapper.categoryToOut(category.get());
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/{categoryId}")
    public void deleteById(@PathVariable Long categoryId) {
        log.info("Deleting category with ID {}.", categoryId);
        categoryService.deleteCategory(categoryId);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteAllCategories() {
        categoryService.deleteAllCategories();
    }

    @RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<CategoryOutDTO> saveCategory(@RequestBody CategoryInDTO categoryInDTO) {
        Category category = categoryMapper.dtoToCategory(categoryInDTO);
        categoryService.saveCategory(category);
        CategoryOutDTO categoryOutDTO = categoryMapper.categoryToOut(category);

        return new ResponseEntity<>(categoryOutDTO, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, path = "/count")
    public Long countCategories() {
        return categoryService.countCategories();
    }
}

