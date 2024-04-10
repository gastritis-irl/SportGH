package edu.codespring.sportgh.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "images")
public class Image extends BaseEntity {

    private String name;

    private String url;

    @ManyToOne(cascade = CascadeType.REFRESH)
    @JoinColumn(name = "product_id")
    @JsonBackReference
    private Product product;

    public Image(String name, String url) {
        super();
        this.name = name;
        this.url = url;
    }
}
