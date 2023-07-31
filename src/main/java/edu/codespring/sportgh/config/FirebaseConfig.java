package edu.codespring.sportgh.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

@Slf4j
@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            FileInputStream serviceAccount =
                new FileInputStream(System.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_PATH"));

            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

            if(FirebaseApp.getApps().isEmpty()) { //<-- check with this line
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {
            log.error("Could not open serviceAccountKey",e);
            throw new RuntimeException(e);
        }
    }
}
