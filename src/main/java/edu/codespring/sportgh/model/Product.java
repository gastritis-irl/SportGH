package edu.codespring.sportgh.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    private boolean publicContact = true;

    @Column(length = 50)
    private String name;

    @Column(length = 1000)
    private String description;

    private Double locationLat;

    private Double locationLng;

    private Double rentPrice;

    @ManyToOne
    @JoinColumn(name = "subcategory_id")
    private SubCategory subCategory;

    @JdbcTypeCode(SqlTypes.JSON)
    private List<CustomFieldValue> customFieldValues;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "product")
    private Set<RentRequest> requests;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Image> images = new HashSet<>();

    public void addImage(Image image) {
        images.add(image);
    }
}
