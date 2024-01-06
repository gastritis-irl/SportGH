package edu.codespring.sportgh.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;
import java.util.Set;

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

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ToString.Exclude
    @OneToMany(cascade = CascadeType.REFRESH, mappedBy = "subCategory")
    private Set<Product> products;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(unique = true)
    private List<CustomFieldConfig> customFields;
}
