package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.dto.ImageDTO;
import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.service.ImageService;
import edu.codespring.sportgh.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
public class ImageController {

    private final ImageService imageService;
    private final ProductService productService;

    @GetMapping(path = "/{imageId}")
    public ResponseEntity<Image> findById(@PathVariable Long imageId) {
        Image image = imageService.findById(imageId);
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @GetMapping(path = "/product/{productId}")
    public ResponseEntity<Collection<Image>> findIdsByProductId(@PathVariable Long productId) {
        Collection<Image> images = imageService.findByProductId(productId);
        if (images.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(images, HttpStatus.OK);
    }

    @GetMapping(path = "/file/{imageId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<Resource> getImageFile(@PathVariable Long imageId) {
        Image image = imageService.findById(imageId);
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Path imagePath = Paths.get(image.getUrl(), image.getName());
        Resource resource = new FileSystemResource(imagePath);

        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(resource);
    }

    @GetMapping(path = "/product/files/{productId}")
    public ResponseEntity<List<ImageDTO>> getImageFilesByProductId(@PathVariable Long productId) {
        Collection<Image> images = imageService.findByProductId(productId);

        if (images.isEmpty()) {
            log.warn("Images not found");
            return ResponseEntity.ok().body(null);
        }

        log.info("Found {} images for productId {}.", images.size(), productId);

        List<ImageDTO> imageDTOs = images.stream()
            .map(this::getResourceResponseEntity)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());

        if (imageDTOs.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return ResponseEntity.ok()
            .body(imageDTOs);
    }

    private ImageDTO getResourceResponseEntity(Image image) {
        if (image == null) {
            log.error("Image not found");
            return null;
        }

        try {
            Path imagePath = Paths.get(image.getUrl(), image.getName());
            byte[] imageData = Files.readAllBytes(imagePath);
            ImageDTO imageDTO = new ImageDTO();
            imageDTO.setName(image.getName());
            imageDTO.setData(imageData);
            return imageDTO;
        } catch (IOException e) {
            log.error("Failed to read image file", e);
            return null;
        }
    }

    @PostMapping
    public ResponseEntity<Image> save(@RequestParam("image") MultipartFile file,
                                      @RequestParam("productId") Long productId) {
        if (!file.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "File must be an image");
        }
        log.info("Creating new image with productId {}.", productId);
        Image image = imageService.saveFileAndCreateDbInstance(file);
        if (productId != 0) {
            Product product = productService.findById(productId);
            image.setProduct(product);
            product.addImage(image);
            imageService.save(image);
            productService.addImage(productId, image);
        }
        log.info("Creating new image with ID {}.", image.getId());
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @Transactional
    @PutMapping(path = "/file/{imageId}")
    public ResponseEntity<Image> update(@PathVariable Long imageId,
                                        @RequestParam("image") MultipartFile file,
                                        @RequestParam("productId") Long productId) {
        if (!file.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "File must be an image");
        }
        Image image = imageService.findById(imageId);
        if (image == null) {
            log.info("Creating new image with productId {}.", productId);
            if (productId == 0) {
                image = imageService.saveFileAndCreateDbInstance(file);
                imageService.save(image);
            } else {
                image = imageService.saveFileAndCreateDbInstance(file);
                image.setProduct(productService.findById(productId));
                imageService.save(image);
                productService.addImage(productId, image);
            }
            log.info("Creating new image with ID {}.", image.getId());
        }

        // Update the image with the new file (this will update the database record and replace the old file)
        image = imageService.update(file, imageId);
        log.info("Updating image with ID {}.", image.getId());

        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping(path = "/{imageId}")
    public ResponseEntity<?> deleteById(@PathVariable Long imageId) {
        log.info("Deleting image with ID {}.", imageId);
        imageService.delete(imageId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
