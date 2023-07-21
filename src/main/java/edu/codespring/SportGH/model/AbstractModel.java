package edu.codespring.SportGH.model;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

import java.util.UUID;

@Data
@MappedSuperclass
public abstract class AbstractModel {

    @Column(length = 36)
    private String uuid;

    public String getUuid() {
        if (uuid == null) {
            uuid = UUID.randomUUID().toString();
        }
        return uuid;
    }
}
