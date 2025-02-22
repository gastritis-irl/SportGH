package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.dto.ProductPageOutDTO;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.service.SubCategoryService;
import edu.codespring.sportgh.service.UserService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;

@Mapper(componentModel = "spring")
public abstract class ProductMapper {

    @Autowired
    protected SubCategoryService subCategoryService;
    @Autowired
    protected UserService userService;

    @Mapping(source = "subCategory.id", target = "subCategoryId")
    @Mapping(source = "subCategory.name", target = "subCategoryName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firebaseUid", target = "userUid")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "subCategory.category.id", target = "categoryId")
    @Mapping(source = "subCategory.category.name", target = "categoryName")
    public abstract ProductOutDTO productToOut(Product product);

    public abstract Collection<ProductOutDTO> productsToOuts(Collection<Product> products);

    public abstract ProductPageOutDTO productPageToOut(Collection<Product> products, int nrOfPages, long nrOfElements);

    @Mapping(source = "subCategoryId", target = "subCategory.id")
    @Mapping(source = "subCategoryName", target = "subCategory.name")
    @Mapping(source = "userId", target = "user.id")
    @Mapping(target = "requests", ignore = true)
    @Mapping(target = "images", ignore = true)
    public abstract Product dtoToProduct(ProductInDTO productInDTO);

    @AfterMapping
    protected void handleDtoToEntityMapping(ProductInDTO dto, @MappingTarget Product entity) {
        if (dto.getSubCategoryId() == null) {
            entity.setSubCategory(null);
        } else {
            entity.setSubCategory(subCategoryService.findById(dto.getSubCategoryId()));
        }
        if (dto.getUserId() == null) {
            entity.setUser(null);
        } else {
            entity.setUser(userService.findById(dto.getUserId()));
        }
    }
}
