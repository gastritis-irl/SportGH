package edu.codespring.sportgh.controller;

import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
public class ImageController {

    private final ImageService imageService;

    @GetMapping(path = "/{imageId}")
    public ResponseEntity<Image> findById(@PathVariable Long imageId) {
        Image image = imageService.get(imageId);
        if (image == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{imageId}")
    public ResponseEntity<?> deleteById(@PathVariable Long imageId) {
        log.info("Deleting image with ID {}.", imageId);
        imageService.delete(imageId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Image> save(@RequestBody Image image) {
        imageService.save(image);
        return new ResponseEntity<>(image, HttpStatus.OK);
    }

    @PutMapping(path = "/{imageId}")
    public ResponseEntity<Image> update(@PathVariable Long imageId,
                                        @RequestBody Image image) {
        imageService.save(image);
        if (!imageId.equals(image.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        if (imageService.get(imageId) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(image, HttpStatus.OK);
    }
}
