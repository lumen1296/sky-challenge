import { UserDTO } from "src/dto/user.dto";

export function getEvenIds(users: UserDTO[]){ 
    return users.filter((user) => user.id % 2 ==0);
}

