package edu.codespring.sportgh.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "subcategories")
@NoArgsConstructor
@ToString(callSuper = true)
@AllArgsConstructor
public class SubCategory extends BaseEntity {

    @Column(name = "name", unique = true, length = 25)
    @NotNull
    private String name;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private Category category;

}
