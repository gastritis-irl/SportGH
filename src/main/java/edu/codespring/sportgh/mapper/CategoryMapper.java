package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.CategoryInDTO;
import edu.codespring.sportgh.dto.CategoryOutDTO;
import edu.codespring.sportgh.model.Category;
import org.mapstruct.Mapper;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryOutDTO categoryToOut(Category category);

    Collection<CategoryOutDTO> categoriesToOuts(Collection<Category> categories);

    Category dtoToCategory(CategoryInDTO categoryInDTO);
}
