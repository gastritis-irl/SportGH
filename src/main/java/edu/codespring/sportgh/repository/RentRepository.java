package edu.codespring.sportgh.repository;

import edu.codespring.sportgh.model.Product;
import edu.codespring.sportgh.model.RentRequest;
import edu.codespring.sportgh.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;

public interface RentRepository extends BaseRepository<RentRequest> {

    RentRequest findByRenterAndProduct(User renter, Product product);

    Collection<RentRequest> findByProduct(Product product);

    @Query("select rr from RentRequest rr where rr.product.user.id = :ownerId")
    Collection<RentRequest> findByProductOwnerId(@Param("ownerId") Long ownerId);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("update RentRequest rr"
        + " set rr.requestStatus = :status"
        + " where rr.id = :rentRequestId")
    void updateRentRequestStatus(@Param("rentRequestId") Long rentRequestId,
                                 @Param("status") RentRequest.Status status);
}
