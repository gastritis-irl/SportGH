package edu.codespring.sportgh.utils;

import com.google.firebase.auth.FirebaseToken;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FirebaseTokenHolder {

    private FirebaseToken token;
}
