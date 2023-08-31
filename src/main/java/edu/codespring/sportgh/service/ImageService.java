package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Image;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    Image save(MultipartFile file);

    Image saveData(Image image);

    void delete(Long imageID);

    Image get(Long imageID);

    boolean existsByName(String name);
}
