package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ImageDTO;
import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.repository.ImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final ProductService productService;

    @Value("${file.storage.location}")
    private String storageLocation;

    @Transactional
    @Override
    public Image createImage(MultipartFile file, Long productId) {
        if (!file.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "File must be an image");
        }
        log.info("Creating new image with productId {}.", productId);
        Image image = saveFileAndCreateDbInstance(file);
        if (productId != 0) {
            Product product = productService.findById(productId);
            image.setProduct(product);
            product.addImage(image);
            save(image);
            productService.addImage(productId, image);
        }
        log.info("Creating new image with ID {}.", image.getId());
        return image;
    }

    @Transactional
    @Override
    public Image updateImage(Long imageId, MultipartFile file, Long productId) {
        if (!file.getContentType().startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "File must be an image");
        }

        Image image = findById(imageId);
        if (image == null) {
            log.info("Creating new image with productId {}.", productId);
            image = createImage(file, productId);
            log.info("Creating new image with ID {}.", image.getId());
        } else {
            // Update the image with the new file (this will update the database record and replace the old file)
            image = update(file, imageId);
            log.info("Updating image with ID {}.", image.getId());
        }
        return image;
    }

    @Override
    public List<ImageDTO> getImageFilesByProductId(Long productId) {
        Collection<Image> images = findByProductId(productId);

        if (images.isEmpty()) {
            log.warn("Images not found");
            return null; // You might want to return an empty list instead of null
        }

        log.info("Found {} images for productId {}.", images.size(), productId);

        return images.stream()
            .map(this::toImageDTO)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    private ImageDTO toImageDTO(Image image) {
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

    @Transactional
    @Override
    public void deleteImageById(Long imageId) {
        log.info("Deleting image with ID {}.", imageId);
        delete(imageId);
    }

    @Override
    public Image saveFileAndCreateDbInstance(MultipartFile file) {

        Image image = new Image();

        // Generate a unique name for the file
        String uniqueFilename = getUniqueFileName();

        return getImage(file, image, uniqueFilename);
    }

    @Override
    public Image update(MultipartFile file, Long imageId) {
        Image image = findById(imageId);

        String uniqueFilename = getUniqueFileName();

        deleteFile(imageId);
        return getImage(file, image, uniqueFilename);
    }

    @NotNull
    private static String getUniqueFileName() {
        // Generate a unique name for the file
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        String dateStr = LocalDateTime.now().format(formatter);
        return dateStr + "_" + UUID.randomUUID() + ".jpeg";
    }

    @NotNull
    private Image getImage(MultipartFile file, Image image, String uniqueFilename) {
        try {
            // Save the file to the file system
            Path filePathWithFile = Paths.get(storageLocation, uniqueFilename);
            Path filePath = Paths.get(storageLocation);
            Files.copy(file.getInputStream(), filePathWithFile, StandardCopyOption.REPLACE_EXISTING);

            // Save the file metadata to the database
            image.setName(uniqueFilename);
            image.setUrl(filePath.toString());
            Image savedImage = save(image);

            log.info("Image saved successfully ({}) with ID: ({}).", file.getOriginalFilename(), savedImage.getId());
            return savedImage;
        } catch (IOException e) {
            throw new ServiceException("Failed to save image", e);
        }
    }

    @Override
    public Image save(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public void delete(Long imageID) {
        // Delete from the file system
        deleteFile(imageID);

        // Delete from the database
        imageRepository.deleteById(imageID);
        log.info("Image with ID {} deleted successfully.", imageID);
    }

    @Override
    public void deleteFile(Long imageID) {
        Image image = findById(imageID);
        log.info("Deleting image file with ID {}.", imageID);
        if (image != null) {
            Path filePath = Paths.get(image.getUrl(), image.getName());
            try {
                Files.delete(filePath);
            } catch (IOException e) {
                throw new ServiceException("Failed to delete image", e);
            }
        }
    }

    @Override
    public void deleteByProductId(Long productId) {
        Collection<Image> images = findByProductId(productId);
        for (Image image : images) {
            delete(image.getId());
        }
    }

    @Override
    public Image findById(Long imageID) {
        return imageRepository.findById(imageID).orElse(null);
    }

    @Override
    public Collection<Image> findByProductId(Long productId) {
        return imageRepository.findByProductId(productId);
    }
}

