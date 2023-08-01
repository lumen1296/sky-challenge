import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMQTransport } from './rabbit/connection/rabbitmq.transport';
import appConfig from './config/app.config';
import { ExchangeType } from './rabbit/interfaces/rabbitmq.interface';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    strategy: new RabbitMQTransport( {
      queue: appConfig().rabbitConfig.queues,
      exchange: appConfig().rabbitConfig.exchange.name,
      exchangeType: ExchangeType.FANOUT,
      urls: [`${appConfig().rabbitConfig.config.uri}`],
      noAck: false,
    }),
  });
  await app.listen();
}
bootstrap();
