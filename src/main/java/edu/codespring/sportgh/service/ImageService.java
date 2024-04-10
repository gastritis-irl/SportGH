package edu.codespring.sportgh.service;

import edu.codespring.sportgh.dto.ImageDTO;
import edu.codespring.sportgh.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collection;
import java.util.List;

public interface ImageService {

    Image saveFileAndCreateDbInstance(MultipartFile file);

    Image save(Image image);

    Image update(MultipartFile file, Long imageId);

    void delete(Long imageID);

    void deleteFile(Long imageID);

    Image findById(Long imageID);

    Collection<Image> findByProductId(Long productId);

    void deleteByProductId(Long productId);

    Image createImage(MultipartFile file, Long productId);

    Image updateImage(Long imageId, MultipartFile file, Long productId);

    List<ImageDTO> getImageFilesByProductId(Long productId);
}
