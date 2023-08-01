import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect as connectAMQP,
} from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { EventEmitter } from 'events';
import {
  RMQClientOptions
} from '../rabbit/interfaces/rabbitmq.interface';
import { fromEvent, merge, Observable, lastValueFrom } from 'rxjs';
import { first, map, share, switchMap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export class RabbitMQClient extends ClientProxy {
  protected readonly logger = new Logger(ClientProxy.name);
  protected client: AmqpConnectionManager;
  protected channel: ChannelWrapper;
  protected responseEmitter: EventEmitter;
  protected connection: Promise<any>;
  protected replyQueue: string;

  constructor(private readonly options: RMQClientOptions) {
    super();
    this.initializeSerializer(options);
    this.initializeDeserializer(options);
  }

  public override connect(): Promise<any> {
    if (this.client) {
      return this.connection;
    }
    this.client = this.createClient();
    const connect$ = this.connect$(this.client);
    this.connection = lastValueFrom(
      this.mergeDisconnectEvent(this.client, connect$).pipe(
        switchMap(() => this.createChannel()),
        share(),
      ),
    );
    return this.connection;
  }

  public createClient() {
    const { urls } = this.options;
    return connectAMQP(urls);
  }


  public mergeDisconnectEvent<T = any>(
    instance: any,
    source$: Observable<T>,
  ): Observable<T> {
    const close$ = fromEvent(instance, 'disconnect').pipe(
      map((err: any) => {
        throw err;
      }),
    );
    return merge(source$, close$).pipe(first());
  }

  public createChannel(): Promise<void> {
    return new Promise((resolve) => {
      this.channel = this.client.createChannel({
        json: false,
        setup: (channel: ConfirmChannel) => this.setupChannel(channel, resolve),
      });
    });
  }

  public async setupChannel(channel: ConfirmChannel, resolve: any) {
    const {
      exchange,
      exchangeType
    } = this.options;
    await channel.assertExchange(exchange, exchangeType);
    this.responseEmitter = new EventEmitter();
    this.responseEmitter.setMaxListeners(0);
    resolve();
  }

  protected override publish(
    message: ReadPacket<string>,
    callback: (packet: WritePacket) => any,
  ): any {
    try {
      const correlationId = randomStringGenerator();
      const listener = ({ content }: { content: any }) =>
        this.handleMessage(JSON.parse(content.toString()), callback);
      const { queue } = this.options;
      if (typeof message.data !== 'string') {
        message.data = message.data;
      }
      const serializedPacket = this.serializer.serialize(message);
      this.responseEmitter.on(correlationId, listener);
      this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(serializedPacket))
      );
      return () => this.responseEmitter.removeListener(correlationId, listener);
    } catch (err) {
      callback({ err });
    }
  }

  public async handleMessage(
    packet: unknown,
    callback: (packet: WritePacket) => any,
  ) {
    const { err, response, isDisposed } = await this.deserializer.deserialize(
      packet,
    );
    if (isDisposed || err) {
      callback({
        err,
        response,
        isDisposed: true,
      });
    }
    callback({
      err,
      response,
    });
  }

  protected override dispatchEvent(
    packet: ReadPacket<string>,
  ): Promise<any> {
    const serializedPacket = this.serializer.serialize(packet);
    const { exchange } = this.options;
    return new Promise<void>((resolve, reject) => {
      this.channel.publish(
        exchange,
        packet.pattern,
        Buffer.from(JSON.stringify(serializedPacket))
      );
    }
    );
  }

  public override close(): void {
    this.channel && this.channel.close();
    this.client && this.client.close();
    this.channel = null;
    this.client = null;
  }
}