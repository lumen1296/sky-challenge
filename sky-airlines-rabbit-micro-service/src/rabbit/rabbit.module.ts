import { Module } from "@nestjs/common";
import { RabbitController } from "./controllers/rabbit.controller";

@Module({
    imports: [],
    controllers: [RabbitController],
    providers: []
})
export class RabbitModule { }
