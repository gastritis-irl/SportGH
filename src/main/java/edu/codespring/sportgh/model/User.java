package edu.codespring.sportgh.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.Set;


@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "username", unique = true, length = 64)
    private String username;

    @EqualsAndHashCode.Include
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@(.+)$")
    @Column(name = "email", unique = true, length = 64)
    private String email;

    @EqualsAndHashCode.Include
    @Column(name = "firebase_uid", unique = true, length = 128)
    private String firebaseUid;

    @Column(name = "role", length = 25)
    private String role = "USER";

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "user")
    private Set<Product> products;
}

