package edu.codespring.sportgh.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    private boolean available = true;

    @Column(length = 50)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 100)
    private String location;

    private Double rentPrice;

    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private SubCategory subCategory;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<Image> images = new HashSet<>();

    public void addImage(Image image) {
        images.add(image);
    }


    public void removeImage( Long imageId) {
        Image image = new Image();
        image.setId(imageId);
        images.remove(image);
    }
}
