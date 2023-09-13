package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;

public interface ImageService {

    Image saveFileAndCreateDbInstance(MultipartFile file);

    Image save(Image image);

    Image update(MultipartFile file, Long imageId);

    void delete(Long imageID);

    void deleteFile(Long imageID);

    Image findById(Long imageID);

    Collection<Image> findByProductId(Long product_id);
}
