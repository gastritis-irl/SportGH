package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.SubCategoryInDTO;
import edu.codespring.sportgh.dto.SubCategoryOutDTO;
import edu.codespring.sportgh.mapper.SubCategoryMapper;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.service.SubCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;
    private final SubCategoryMapper subCategoryMapper;

    @GetMapping
    public ResponseEntity<Collection<SubCategoryOutDTO>> findAll(
            @RequestParam("Category") Optional<Long> categoryId,
            @RequestHeader("Authorization") String idToken
    ) {
        Collection<SubCategory> subCategories = categoryId.isPresent()
                ? subCategoryService.findByCategoryId(categoryId.get()) : subCategoryService.findAll();

        return new ResponseEntity<>(subCategoryMapper.subCategoriesToOuts(subCategories), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{subCategoryId}")
    public ResponseEntity<?> deleteById(
            @PathVariable Long subCategoryId,
            @RequestHeader("Authorization") String idToken
    ) {
        log.info("Deleting subCategory with ID {}.", subCategoryId);
        subCategoryService.delete(subCategoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/{subCategoryId}")
    @PutMapping(path = "/{subCategoryId}")
    public ResponseEntity<SubCategoryOutDTO> save(
            @RequestBody @Valid SubCategoryInDTO subCategoryInDTO,
            @PathVariable(required = false) Long subCategoryId,
            @RequestHeader("Authorization") String idToken
    ) {
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
}
