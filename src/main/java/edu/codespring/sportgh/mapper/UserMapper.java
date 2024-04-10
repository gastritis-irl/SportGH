package edu.codespring.sportgh.mapper;

import edu.codespring.sportgh.dto.UserInDTO;
import edu.codespring.sportgh.dto.UserOutDTO;
import edu.codespring.sportgh.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collection;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "image.id", target = "imageId")
    UserOutDTO userToOut(User user);

    Collection<UserOutDTO> usersToOuts(Collection<User> users);

    @Mapping(source = "imageId", target = "image.id")
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "myRequests", ignore = true)
    User dtoToUser(UserInDTO userInDTO);
}
