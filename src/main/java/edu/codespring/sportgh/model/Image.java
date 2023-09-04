package edu.codespring.sportgh.model;

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
}
