package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Image;
import edu.codespring.sportgh.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    @Override
    public Image save(Image image) {
        imageRepository.save(image);
        log.info("Image saved successfully ({}) with ID: ({}).", image.getName(), image.getId());
        return image;
    }

    @Override
    public void delete(Long imageID) {
        imageRepository.deleteById(imageID);
        log.info("Image with ID {} deleted successfully.", imageID);
    }

    @Override
    public Image get(Long imageID) {
        return imageRepository.findById(imageID).orElse(null);
    }
}
