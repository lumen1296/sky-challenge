import { UserDTO } from "src/dto/user.dto";

export function getReverseIds(users: UserDTO[]){ 
    return users.sort((a,b) => b.id - a.id);
}

