package edu.codespring.sportgh.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(callSuper = true)
@Data
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "created_date")
    protected Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_date")
    protected Date updatedAt;
}
