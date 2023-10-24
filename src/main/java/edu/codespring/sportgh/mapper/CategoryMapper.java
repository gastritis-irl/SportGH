package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.CategoryInDTO;
import edu.codespring.sportgh.dto.CategoryOutDTO;
import edu.codespring.sportgh.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "image.id", target = "imageId")
    CategoryOutDTO categoryToOut(Category category);

    Collection<CategoryOutDTO> categoriesToOuts(Collection<Category> categories);

    @Mapping(source = "imageId", target = "image.id")
    @Mapping(target = "subCategories", ignore = true)
    Category dtoToCategory(CategoryInDTO categoryInDTO);
}
