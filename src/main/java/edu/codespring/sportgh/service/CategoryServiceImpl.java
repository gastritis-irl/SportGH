package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Category;
import edu.codespring.sportgh.repository.CategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;

@Service
@Slf4j
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ImageService imageService;


    @Override
    public void deleteImageFileByCategoryId(Long categoryId) {
        Category category = findById(categoryId);
        if (category == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        } else if (category.getImage() != null) {
            imageService.deleteFile(category.getImage().getId());
        }
    }

    @Override
    public void save(Category category) {
        categoryRepository.save(category);
        log.info("Category saved successfully ({}) with ID: ({}).", category.getName(), category.getId());
    }

    @Transactional
    @Override
    public void delete(Long categoryId) {
        deleteImageFileByCategoryId(categoryId);
        categoryRepository.deleteById(categoryId);
        log.info("Category with ID {} deleted successfully.", categoryId);
    }

    @Override
    public boolean existsById(Long categoryID) {
        return categoryRepository.existsById(categoryID);
    }

    @Override
    public boolean existsByName(String categoryName) {
        return categoryRepository.existsByName(categoryName);
    }

    @Override
    public Collection<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Long categoryId) {
        return categoryRepository.findById(categoryId).orElse(null);
    }

    @Override
    public Category findByName(String categoryName) {
        return categoryRepository.findByName(categoryName);
    }
}
