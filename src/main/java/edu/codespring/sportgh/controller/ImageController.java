package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
public class ImageController {

    private final ImageService imageService;

    @Value("${file.storage.location}")
    private String storageLocation;

    @GetMapping(path = "/{imageId}")
    public ResponseEntity<Image> findById(@PathVariable Long imageId) {
        Image image = imageService.get(imageId);
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @GetMapping(path = "/file/{imageId}", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getImageFile(@PathVariable Long imageId) {
        Image image = imageService.get(imageId);
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        Path imagePath = Paths.get(storageLocation, image.getName());
        try {
            return Files.readAllBytes(imagePath);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image file not found", e);
        }
    }

    @PostMapping
    public ResponseEntity<Image> save(@RequestParam("image") MultipartFile file) {
        Image image = imageService.save(file);
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{imageId}")
    public ResponseEntity<?> deleteById(@PathVariable Long imageId) {
        log.info("Deleting image with ID {}.", imageId);
        imageService.delete(imageId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
