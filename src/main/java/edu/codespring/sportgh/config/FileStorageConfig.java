package edu.codespring.sportgh.config;

import edu.codespring.sportgh.exception.ServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Slf4j
public class FileStorageConfig {

    @Value("${file.storage.location}")
    private String storageLocation;

    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(storageLocation);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info("Directory created at: " + path.toAbsolutePath());
            }
        } catch (IOException e) {
            throw new ServiceException("Could not initialize storage directory", e);
        }
    }
}
