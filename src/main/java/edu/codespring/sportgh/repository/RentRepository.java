package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface RentRepository extends BaseRepository<RentRequest> {

    RentRequest findByRenterAndProduct(User renter, Product product);

    Collection<RentRequest> findByProductUserId(Long ownerId);

    Collection<RentRequest> findByRenterId(Long renterId);

    @Modifying
    @Query("update RentRequest rr"
        + " set rr.requestStatus = :status"
        + " where rr.id = :rentRequestId")
    void updateRentRequestStatus(@Param("rentRequestId") Long rentRequestId,
                                 @Param("status") RentRequest.Status status);
}
