import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';



@Controller()
export class RabbitController {
    constructor() { }


    @MessagePattern('save-queue')
    async saveQueue(users: any) {
        return console.log({message: 'received from client: ', users });
    }
}


