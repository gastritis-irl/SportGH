package edu.codespring.sportgh.security;

import com.google.firebase.auth.FirebaseToken;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FirebaseTokenHolder {

    private FirebaseToken token;

    public String getUid() {
        return token.getUid();
    }

    public String getEmail() {
        return token.getEmail();
    }

    public String getDisplayName() {
        return token.getName();
    }

    public String getPhotoUrl() {
        return token.getPicture();
    }
}
