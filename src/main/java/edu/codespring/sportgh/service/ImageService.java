package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Image;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    Image save(MultipartFile file);

    Image saveData(Image image);

    Image update(MultipartFile file, Long imageId);

    void delete(Long imageID);

    void deleteFile(Long imageID);

    Image findById(Long imageID);

    boolean existsByName(String name);
}
