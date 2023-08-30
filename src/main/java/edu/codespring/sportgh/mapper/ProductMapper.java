package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.ProductInDTO;
import edu.codespring.sportgh.dto.ProductOutDTO;
import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.service.SubCategoryService;
import edu.codespring.sportgh.service.UserService;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.List;

@Mapper(componentModel = "spring")
public abstract class ProductMapper {

    @Autowired
    protected SubCategoryService subCategoryService;
    @Autowired
    protected UserService userService;

    @Mapping(source = "subCategory.id", target = "subCategoryId")
    @Mapping(source = "subCategory.name", target = "subCategoryName")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(target = "imageIds", expression = "java(mapImagesToIds(product.getImages()))")
    public abstract ProductOutDTO productToOut(Product product);

    public abstract Collection<ProductOutDTO> productsToOuts(Collection<Product> products);

    @Mapping(source = "subCategoryId", target = "subCategory.id")
    @Mapping(source = "subCategoryName", target = "subCategory.name")
    @Mapping(source = "userId", target = "user.id")
    // Handle images in your service layer or another custom method
    public abstract Product dtoToProduct(ProductInDTO productInDTO);

    // Custom method to map List<Image> to Long[]
    public Long[] mapImagesToIds(List<Image> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        return images.stream()
            .map(Image::getId)
            .toArray(Long[]::new);
    }
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
