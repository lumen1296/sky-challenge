import { CompanyDTO } from "./company.dto";

export interface UserDTO {
    id: number;
    name: string;
    username: string;
    phone: string;
    website: string;
    company: CompanyDTO;
}