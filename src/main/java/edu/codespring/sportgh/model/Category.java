package edu.codespring.sportgh.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "categories")
@NoArgsConstructor
@ToString(callSuper = true)
@AllArgsConstructor
public class Category extends BaseEntity {

    @Column(name = "name", unique = true, length = 25)
    @NotNull
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "category")
    private Set<SubCategory> subcategories;

    @ToString.Exclude
    @OneToOne(cascade = CascadeType.ALL)
    private Image image;
}
