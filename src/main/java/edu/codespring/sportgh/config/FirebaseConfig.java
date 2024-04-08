package edu.codespring.sportgh.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import edu.codespring.sportgh.security.FirebaseAuthenticationProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Bean
    public FirebaseAuthenticationProvider firebaseAuthenticationProvider() {
        return new FirebaseAuthenticationProvider();
    }

    @PostConstruct
    public void initialize() {
        try {
            GoogleCredentials credentials = getCredentials();
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(credentials)
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            log.error("Could not open serviceAccountKey file");
            throw new IllegalStateException("Could not open serviceAccountKey file", e);
        }
    }

    private GoogleCredentials getCredentials() throws IOException {
        String serviceAccountPath = "serviceAccountKey.json";
        return GoogleCredentials.fromStream(Files.newInputStream(
                Paths.get(serviceAccountPath)));
    }
}
