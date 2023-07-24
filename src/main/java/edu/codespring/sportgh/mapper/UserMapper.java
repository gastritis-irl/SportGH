package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "id", target = "userID")
    UserOutDTO userToOut(User user);

    Collection<UserOutDTO> usersToOuts(Collection<User> users);
}
