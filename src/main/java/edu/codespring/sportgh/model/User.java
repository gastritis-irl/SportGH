package edu.codespring.sportgh.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(name = "username", unique = true, length = 25)
    private String username;

    @ToString.Exclude
    @Column(length = 64)
    private String password;

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.REFRESH)
    private Set<Product> products;
}
