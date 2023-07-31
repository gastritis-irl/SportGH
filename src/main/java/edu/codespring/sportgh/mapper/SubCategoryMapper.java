package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.SubCategoryInDTO;
import edu.codespring.sportgh.dto.SubCategoryOutDTO;
import edu.codespring.sportgh.model.SubCategory;
import edu.codespring.sportgh.service.CategoryService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;

@Mapper(componentModel = "spring")
public abstract class SubCategoryMapper {

    @Autowired
    protected CategoryService categoryService;

    @Mapping(source = "id", target = "subCategoryId")
    @Mapping(source = "name", target = "subCategoryName")
    @Mapping(source = "category.id", target = "categoryId")
    public abstract SubCategoryOutDTO subCategoryToOut(SubCategory subCategory);

    @Mapping(source = "subCategoryName", target = "name")
    @Mapping(source = "subCategoryId", target = "id")
    public abstract SubCategory dtoToSubCategory(SubCategoryInDTO subCategoryInDTO);

    public abstract Collection<SubCategoryOutDTO> subCategoriesToOuts(Collection<SubCategory> subCategories);

    @AfterMapping
    protected void handleDtoToEntityMapping(SubCategoryInDTO dto, @MappingTarget SubCategory entity) {
        if (dto.getCategoryId() != null) {
            entity.setCategory(categoryService.findById(dto.getCategoryId()).orElse(null));
        } else {
            entity.setCategory(null);
        }
    }
}


