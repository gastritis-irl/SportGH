package edu.codespring.sportgh.model;


import jakarta.persistence.*;
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
  private String name;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;

}
