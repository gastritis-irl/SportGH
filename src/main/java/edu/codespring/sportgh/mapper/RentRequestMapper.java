package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.RentRequestOutDTO;
import edu.codespring.sportgh.model.RentRequest;
import org.mapstruct.Mapper;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface RentRequestMapper {

    RentRequestOutDTO rentRequestToOut(RentRequest rentRequest);

    Collection<RentRequestOutDTO> rentRequestsToOuts(Collection<RentRequest> rentRequests);
}
