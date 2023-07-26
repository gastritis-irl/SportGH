package edu.codespring.sportgh.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "categories")
@NoArgsConstructor
@ToString(callSuper = true)
@AllArgsConstructor
public class Category extends BaseEntity {

    @Column(name = "name", unique = true, length = 25)
    private String name;

    @Column(name = "description", length = 1000)
    private String description;

    @ToString.Exclude
    @Column(name = "imageURL", length = 1000)
    private String imageURL;
}
