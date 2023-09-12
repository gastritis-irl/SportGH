package edu.codespring.sportgh.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.Objects;
import java.util.Set;


@ToString(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "username", unique = true, length = 64)
    private String username;

    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$")
    @Column(name = "email", unique = true, length = 64)
    private String email;

    @Column(name = "firebase_uid", unique = true, length = 128)
    private String firebaseUid;

    @Column(name = "role", length = 25)
    private String role = "USER";

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "user")
    private Set<Product> products;

    @Override
    public boolean equals(Object object) {
        if (this == object) return true;
        if (object == null || getClass() != object.getClass()) return false;
        User userObj = (User) object;
        return Objects.equals(firebaseUid, userObj.firebaseUid) &&
            Objects.equals(email, userObj.email);
    }
}

