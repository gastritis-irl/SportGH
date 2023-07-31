package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.SubCategoryInDTO;
import edu.codespring.sportgh.dto.SubCategoryOutDTO;
import edu.codespring.sportgh.mapper.SubCategoryMapper;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.service.SubCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;
    private final SubCategoryMapper subCategoryMapper;

    @GetMapping
    public Collection<SubCategoryOutDTO> findAllSubCategories() {
        Collection<SubCategory> subCategories = subCategoryService.findAll();
        return subCategoryMapper.subCategoriesToOuts(subCategories);
    }

    @GetMapping(path = "/ids/{subCategoryIDs}")
    public Collection<SubCategoryOutDTO> findByIds(@PathVariable Collection<Long> subCategoryIDs) {
        Collection<SubCategory> subCategories = subCategoryService.findByIds(subCategoryIDs);
        return subCategoryMapper.subCategoriesToOuts(subCategories);
    }

    @DeleteMapping(path = "/{subCategoryId}")
    public void deleteById(@PathVariable Long subCategoryId) {
        log.info("Deleting subCategory with ID {}.", subCategoryId);
        subCategoryService.delete(subCategoryId);
    }

    @DeleteMapping
    public void deleteAllSubCategories() {
        subCategoryService.deleteAll();
    }

    @PostMapping(path = "/{subCategoryId}")
    @PutMapping(path = "/{subCategoryId}")
    public ResponseEntity<SubCategoryOutDTO> saveSubCategory(@RequestBody SubCategoryInDTO subCategoryInDTO,
                                                             @PathVariable(required = false) Long subCategoryId) {
        SubCategory subCategory;
        subCategory = subCategoryMapper.dtoToSubCategory(subCategoryInDTO);
        log.info("Saving subCategory with ID {}.", subCategoryId);
        if (subCategoryId != null && subCategoryService.existsById(subCategoryId)) {
            subCategory.setId(subCategoryId);
        }
        subCategoryService.save(subCategory);
        SubCategoryOutDTO subCategoryOutDTO1 = subCategoryMapper.subCategoryToOut(subCategory);

        return ResponseEntity.ok(subCategoryOutDTO1);
    }

    @GetMapping(path = "/categories/{categoryId}")
    public Collection<SubCategoryOutDTO> findByCategoryId(@PathVariable Long categoryId) {
        Collection<SubCategory> subCategories = subCategoryService.findByCategoryId(categoryId);
        return subCategoryMapper.subCategoriesToOuts(subCategories);
    }

}
