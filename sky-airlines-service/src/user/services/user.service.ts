import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { getUsersMapper } from "../mappers/user.mapper";
import { getReverseIds } from "src/utils/reverseId";
import { getEvenIds } from "src/utils/evenId";

@Injectable()
export class UserService {


    constructor(private readonly httpService: HttpService, @Inject('RABBIT_MQ') private client: ClientProxy) { }


    async getUsers() {
        try {
            const users = await getUsersMapper((await this.httpService.axiosRef.get('https://jsonplaceholder.typicode.com/users')).data);

            this.client.send('save-queue', getEvenIds(users)).subscribe();
            return { message: 'message sent', data: getReverseIds(users) }
        } catch (error) {
            return error;
        }

    }

}