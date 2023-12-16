package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.SubCategoryInDTO;
import edu.codespring.sportgh.dto.SubCategoryOutDTO;
import edu.codespring.sportgh.mapper.SubCategoryMapper;
import edu.codespring.sportgh.model.CustomFieldConfig;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.service.SubCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;
    private final SubCategoryMapper subCategoryMapper;

    @GetMapping
    public ResponseEntity<Collection<SubCategoryOutDTO>> findAll(@RequestParam("Category") Optional<Long> categoryId) {
        Collection<SubCategory> subCategories = categoryId.isPresent()
                ? subCategoryService.findByCategoryId(categoryId.get()) : subCategoryService.findAll();

        return new ResponseEntity<>(subCategoryMapper.subCategoriesToOuts(subCategories), HttpStatus.OK);
    }

    @GetMapping(path = "/{subCategoryId}")
    public ResponseEntity<SubCategoryOutDTO> findById(@PathVariable Long subCategoryId) {
        SubCategory subcategory = subCategoryService.findById(subCategoryId);
        if (subcategory == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(subCategoryMapper.subCategoryToOut(subcategory), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{subCategoryId}")
    public ResponseEntity<?> deleteById(@PathVariable Long subCategoryId) {
        log.info("Deleting subCategory with ID {}.", subCategoryId);
        subCategoryService.delete(subCategoryId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private ResponseEntity<SubCategoryOutDTO> save(@Valid SubCategoryInDTO subcategoryInDTO) {
        SubCategory subCategory = subCategoryMapper.dtoToSubCategory(subcategoryInDTO);
        subCategoryService.save(subCategory);
        SubCategoryOutDTO subcategoryOutDTO = subCategoryMapper.subCategoryToOut(subCategory);
        return new ResponseEntity<>(subcategoryOutDTO, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<SubCategoryOutDTO> create(@RequestBody @Valid SubCategoryInDTO subCategoryInDTO) {
        log.info("Creating subcategory with ID {}. ", subCategoryInDTO.getName());
        if (subCategoryInDTO.getId() != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return uniqueConstraintCheckForCustomFieldNames(subCategoryInDTO);
    }

    private ResponseEntity<SubCategoryOutDTO> uniqueConstraintCheckForCustomFieldNames(@RequestBody @Valid SubCategoryInDTO subCategoryInDTO) {
        Object[] customFieldNames = subCategoryInDTO.getCustomFields().stream().map(CustomFieldConfig::getName).toArray();
        boolean hasDuplicate = Arrays.stream(customFieldNames).anyMatch(i -> Arrays.stream(customFieldNames).filter(j -> j.equals(i)).count() > 1);
        if (hasDuplicate) {
            log.info("hasDuplicates");
        }
        return save(subCategoryInDTO);
    }

    @PutMapping(path = "/{subCategoryId}")
    public ResponseEntity<SubCategoryOutDTO> update(@RequestBody @Valid SubCategoryInDTO subCategoryInDTO,
                                                    @PathVariable Long subCategoryId) {
        log.info("Updating subCategory with ID {}.", subCategoryId);
        if (!Objects.equals(subCategoryId, subCategoryInDTO.getId())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!subCategoryService.existsById(subCategoryId)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return uniqueConstraintCheckForCustomFieldNames(subCategoryInDTO);
    }
}
