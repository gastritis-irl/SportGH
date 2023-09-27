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

    @Column(name = "full_name", length = 64)
    private String fullName;

    @Column(name = "phone_number", length = 12)
    private String phoneNumber;

    @Column(name = "bio", length = 600)
    private String bio;

    @Column(name = "address", length = 100)
    private String address;

    @Column(name = "city", length = 64)
    private String city;

    @Column(name = "country", length = 64)
    private String country;

    @EqualsAndHashCode.Include
    @Column(name = "firebase_uid", unique = true, length = 128)
    private String firebaseUid;

    @Column(name = "role", length = 25)
    private String role = "USER";

    @ToString.Exclude
    @OneToOne()
    @JoinColumn(name = "image_id")
    private Image image;

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "user")
    private Set<Product> products;

    @ToString.Exclude
    @OneToMany(mappedBy = "renter")
    private Set<RentRequest> myRequests;
}

