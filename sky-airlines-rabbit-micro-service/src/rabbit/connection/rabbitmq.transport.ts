
import {
  Server,
  CustomTransportStrategy,
  Transport,
  OutgoingResponse,
} from '@nestjs/microservices';
import { isString } from '@nestjs/common/utils/shared.utils';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect,
} from 'amqp-connection-manager';
import {
  PublishOptions,
  RMQServerOptions,
} from '../interfaces/rabbitmq.interface';
import { RmqContext } from '../context/rabbitmq.context';

export class RabbitMQTransport extends Server implements CustomTransportStrategy {
  transportId?: Transport;
  private server: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(private readonly options: RMQServerOptions) {
    super();
    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  async listen(callback: () => void) {
    this.start(callback);
  }

  createAmqpClient() {
    const { urls } = this.options;
    return connect(urls);
  }

  public async start(callback: any) {
    this.server = this.createAmqpClient();
    this.server.on('connect', () => {
      if (this.channel) {
        return;
      }
      this.channel = this.server.createChannel({
        json: false,
        setup: (channel: ConfirmChannel) =>
          this.setupChannel(channel, callback),
      });
    });
  }


  public async setupChannel(channel: ConfirmChannel, callback: any) {
    const {
      queue,
      queueOptions,
      exchange,
      exchangeType,
      noAck,
    } = this.options;
    await channel.assertExchange(exchange, exchangeType);
    await channel.assertQueue(queue, queueOptions);
    this.messageHandlers.forEach((handler, pattern) => {
      channel.bindQueue(queue, exchange, pattern);
    });
    channel.consume(queue, (msg: any) => this.handleMessage(msg, channel), {
      noAck: noAck !== undefined ? noAck : true,
    });
    callback();
  }

  public async handleMessage(message: ConsumeMessage, channel: ConfirmChannel) {
    const rawMessage = JSON.parse(message.content.toString());
    const packet = await this.deserializer.deserialize(rawMessage);
    const pattern = isString(packet.pattern)
      ? packet.pattern
      : JSON.stringify(packet.pattern);
    const rmqContext = new RmqContext([message, channel, pattern]);
    return this.handleEvent(pattern, packet, rmqContext);
  }

  public sendMessage(
    message: any,
    queue: any,
    correlationId: string,
  ): void {
    let publishOptions: PublishOptions = {
      correlationId,
    };
    if (typeof message.response !== 'string') {
      publishOptions = { ...message.response.options, ...publishOptions };
      message.response = message.response.content;
    }
    const outgoingResponse = this.serializer.serialize(
      message as unknown as OutgoingResponse,
    );
    const buffer = Buffer.from(JSON.stringify(outgoingResponse));
    this.channel.sendToQueue(queue, buffer, publishOptions);
  }

  close() {
    this.channel && this.channel.close();
    this.server && this.server.close();
  }
}