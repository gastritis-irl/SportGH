package edu.codespring.sportgh.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Set;


@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "username", unique = true, length = 25)
    private String username;

    @Column(name = "email", unique = true, length = 64)
    private String email;

    @ToString.Exclude
    @Column(length = 64)
    private String password;

    @Column(name = "firebase_uid", unique = true, length = 128)
    private String firebaseUid;

    @Column(name = "role", length = 25)
    private String role;

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "user")
    private Set<Product> products;
}

