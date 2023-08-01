import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';


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


