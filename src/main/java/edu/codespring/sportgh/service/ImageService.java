package edu.codespring.sportgh.service;

import edu.codespring.sportgh.model.Image;

public interface ImageService {

    Image save(Image image);

    void delete(Long imageID);

    Image get(Long imageID);
}
