package edu.codespring.application.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class User extends BaseEntity {
    @Column(name = "username", unique = true, length = 25)
    private String userName;
    @ToString.Exclude
    @Column(length = 64)
    private String password;

    public User(String uuid, Long id, String userName, String password) {
        super();
        setUuid(uuid);
        setId(id);
        this.userName = userName;
        this.password = password;
    }

}

