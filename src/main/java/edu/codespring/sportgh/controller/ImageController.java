package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.service.ImageService;
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

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
public class ImageController {

    private final ImageService imageService;

    @GetMapping(path = "/{imageId}")
    public ResponseEntity<Image> findById(@PathVariable Long imageId) {
        Image image = imageService.findById(imageId);
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(image, HttpStatus.OK);
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


    @PostMapping
    public ResponseEntity<Image> save(@RequestParam("image") MultipartFile file) {
        Image image = imageService.save(file);
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    //update with file, create new Image instance, unlink old instance
    @PutMapping(path = "/file/{imageId}")
    public ResponseEntity<Image> update(@PathVariable Long imageId, @RequestParam("image") MultipartFile file) {
        Image image = imageService.findById(imageId);
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        // Update the image with the new file (this will update the database record and replace the old file)
        imageService.deleteFile(imageId);
        image = imageService.update(file, imageId);

        return new ResponseEntity<>(image, HttpStatus.OK);
    }


    @DeleteMapping(path = "/{imageId}")
    public ResponseEntity<?> deleteById(@PathVariable Long imageId) {
        log.info("Deleting image with ID {}.", imageId);
        imageService.delete(imageId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
