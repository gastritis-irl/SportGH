package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.CategoryOutDTO;
import edu.codespring.sportgh.mapper.CategoryMapper;
import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
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
        Category category = categoryService.findById(categoryId);
        if (category == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return categoryMapper.categoryToOut(category);
    }

    @RequestMapping(method = RequestMethod.DELETE, path = "/{categoryId}")
    public void deleteById(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public void deleteAllCategories() {
        categoryService.deleteAllCategories();
    }

    @RequestMapping(method = RequestMethod.POST)
    public CategoryOutDTO createCategory(@RequestBody CategoryOutDTO categoryOutDTO) {
        categoryService.createCategory(categoryOutDTO.getName(), categoryOutDTO.getDescription(), categoryOutDTO.getImageURL());
        return categoryOutDTO;
    }

    @RequestMapping(method = RequestMethod.PUT, path = "/{categoryId}")
    public CategoryOutDTO updateCategory(@PathVariable Long categoryId, @RequestBody CategoryOutDTO categoryOutDTO) {
        if(categoryService.existsCategory(categoryId)) {

            categoryService.updateCategory(categoryId, categoryOutDTO.getName(), categoryOutDTO.getDescription(), categoryOutDTO.getImageURL());
        }else{
            categoryService.createCategory(categoryOutDTO.getName(), categoryOutDTO.getDescription(), categoryOutDTO.getImageURL());
        }
        return categoryOutDTO;
    }

    @RequestMapping(method = RequestMethod.GET, path = "/count")
    public Long countCategories() {
        return categoryService.countCategories();
    }
}

