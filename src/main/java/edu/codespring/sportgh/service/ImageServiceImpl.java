package edu.codespring.sportgh.service;

import edu.codespring.sportgh.exception.ServiceException;
import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    public Image save(MultipartFile file) {
        // Generate a unique name for the file
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        String dateStr = LocalDateTime.now().format(formatter);
        String uniqueFilename = dateStr + "_" + UUID.randomUUID() + "_" + ".jpeg";
        try {
            // Save the file to the file system
            Path filePathWithFile = Paths.get(storageLocation, uniqueFilename);
            Path filePath = Paths.get(storageLocation);
            Files.copy(file.getInputStream(), filePathWithFile, StandardCopyOption.REPLACE_EXISTING);

            // Save the file metadata to the database
            Image image = new Image();
            image.setName(uniqueFilename);
            image.setUrl(filePath.toString());
            image = imageRepository.save(image);

            log.info("Image saved successfully ({}) with ID: ({}).", file.getOriginalFilename(), image.getId());
            return image;
        } catch (IOException e) {
            log.error("Failed to save image", e);
            throw new ServiceException("Failed to save image", e);
        }
    }

    @Override
    public Image saveData(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public void delete(Long imageID) {
        // Delete from the file system
        Image image = findById(imageID);
        if (image != null) {
            Path filePath = Paths.get(image.getUrl(), image.getName());
            try {
                Files.delete(filePath);
            } catch (IOException e) {
                log.error("Failed to delete image file", e);
            }
        }

        // Delete from the database
        imageRepository.deleteById(imageID);
        log.info("Image with ID {} deleted successfully.", imageID);
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

