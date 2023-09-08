package edu.codespring.sportgh.service;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    @Value("${file.storage.location}")
    private String storageLocation;

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
            image = save(image);

            log.info("Image saved successfully ({}) with ID: ({}).", file.getOriginalFilename(), image.getId());
            return image;
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
    public Image findById(Long imageID) {
        return imageRepository.findById(imageID).orElse(null);
    }

    @Override
    public boolean existsByName(String name) {
        return imageRepository.existsByName(name);
    }
}

