package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.RentRequestOutDTO;
import edu.codespring.sportgh.model.RentRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface RentRequestMapper {

    @Mapping(source = "renter.username", target = "renterName")
    @Mapping(source = "product.name", target = "productName")
    @Mapping(source = "product.id", target = "productId")
    RentRequestOutDTO rentRequestToOut(RentRequest rentRequest);

    Collection<RentRequestOutDTO> rentRequestsToOuts(Collection<RentRequest> rentRequests);
}
