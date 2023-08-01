import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { HttpModule } from "@nestjs/axios";
import appConfig from "src/config/app.config";
import { UserController } from "./controllers/user.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMQClient } from "src/rabbit/rabbitmq.client";
import { ExchangeType } from "src/rabbit/interfaces/rabbitmq.interface";

@Module({
    imports: [HttpModule.register({
        timeout: Number(appConfig().axios.timeOut)
    })],
    controllers: [UserController],
    providers: [UserService,
        {
            provide: 'RABBIT_MQ',
            useFactory: () => {
                return new RabbitMQClient({
                    urls: [`${appConfig().rabbitConfig.config.uri}`],
                    exchange: appConfig().rabbitConfig.exchange.name,
                    exchangeType: ExchangeType.FANOUT,
                    queue: appConfig().rabbitConfig.queues,
                    noAck: false,
                });
            },
        },],
    exports: [UserService]
})
export class UserModule { }
