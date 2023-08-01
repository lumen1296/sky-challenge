import { UserDTO } from "src/dto/user.dto";

export const getUsersMapper = async (users: any[]): Promise<UserDTO[]> => {
    let usersDTO: UserDTO[] = [];
   
    for (let user of users) {
        const userDTO: UserDTO = {
            id: user.id,
            name: user.name,
            username: user.username,
            phone: user.phone,
            website: user.website,
            company: user.company,
        };
        usersDTO.push(userDTO);
    };
    return usersDTO;
}