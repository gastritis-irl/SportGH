package edu.codespring.sportgh.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "categories")
@NoArgsConstructor
@ToString(callSuper = true)
public class Category extends BaseEntity{

        @Column(name = "name", unique = true, length = 25)
        private String name;

        @Column(name = "description", length = 100)
        private String description;

        @ToString.Exclude
        @Column(name = "imageURL", length = 100)
        private String imageURL;
}
