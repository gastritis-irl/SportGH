package edu.codespring.sportgh.model;

import jakarta.persistence.*;
import lombok.*;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "rent_requests")
public class RentRequest extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "renter_id")
    private User renter;

    @ManyToOne
    private Product product;

    public enum Status {
        PENDING,
        ACCEPTED,
        DECLINED
    }

    private Status requestStatus;
}
