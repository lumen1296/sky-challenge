import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { UserDTO } from 'src/dto/user.dto';


@Controller('test')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Get('users')
    getUsers() {
        return this.userService.getUsers();
    }

}


