package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.CategoryInDTO;
import edu.codespring.sportgh.dto.CategoryOutDTO;
import edu.codespring.sportgh.model.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "id", target = "categoryId")
    @Mapping(source = "name", target = "categoryName")
    @Mapping(source = "description", target = "categoryDescription")
    @Mapping(source = "imageURL", target = "categoryImageURL")
    CategoryOutDTO categoryToOut(Category category);

    Collection<CategoryOutDTO> categoriesToOuts(Collection<Category> categories);

    @Mapping(source = "categoryName", target = "name")
    @Mapping(source = "categoryDescription", target = "description")
    @Mapping(source = "categoryImageURL", target = "imageURL")
    Category dtoToCategory(CategoryInDTO categoryInDTO);
}
