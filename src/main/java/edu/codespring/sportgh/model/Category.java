package edu.codespring.sportgh.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @Size(max = 25, message = "Category name too long.")
    @NotNull
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @ToString.Exclude
    @Column(name = "imageURL", length = 1000)
    private String imageURL;

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "category")
    private Set<SubCategory> subcategories;
}
