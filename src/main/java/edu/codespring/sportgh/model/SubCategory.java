package edu.codespring.sportgh.model;


import edu.codespring.sportgh.mapper.JsonConverter;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Map;
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

    @Column(name="properties_list", columnDefinition = "json")
    @Convert(converter = JsonConverter.class)
    private Map<String, String> propertyFields;
}
