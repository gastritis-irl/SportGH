package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.SubCategoryOutDTO;
import edu.codespring.sportgh.model.SubCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface SubCategoryMapper {

    @Mapping(source = "id", target = "subCategoryId")
    SubCategoryOutDTO subCategoryToOut(SubCategory subCategory);

    SubCategory dtoToSubCategory(SubCategoryOutDTO subCategoryOutDTO);

    Collection<SubCategoryOutDTO> subCategoriesToOuts(Collection<SubCategory> subCategories);
}
