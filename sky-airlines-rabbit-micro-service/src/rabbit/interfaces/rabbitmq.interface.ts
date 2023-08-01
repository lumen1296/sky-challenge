export interface RMQOptions {
  urls: string[];
  noAck?: boolean;
  exchange?: string;
  exchangeType?: ExchangeType;
}

export interface RMQServerOptions extends RMQOptions {
  queue?: string;
  queueOptions?: QueueOptions;
}

export interface QueueOptions {
  exclusive?: boolean;
  durable?: boolean;
}

export interface PublishOptions {
  correlationId?: string | undefined;
}

export enum ExchangeType {
  DIRECT = 'direct',
  TOPIC = 'topic',
  HEADERS = 'headers',
  FANOUT = 'fanout',
  MATCH = 'match',
}