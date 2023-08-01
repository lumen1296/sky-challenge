export interface RMQOptions {
  urls: string[];
  noAck?: boolean;
  exchange?: string;
  exchangeType?: ExchangeType;
}

export interface RMQClientOptions extends RMQOptions {
  queue?: string;
}

export enum ExchangeType {
  DIRECT = 'direct',
  TOPIC = 'topic',
  HEADERS = 'headers',
  FANOUT = 'fanout',
  MATCH = 'match',
}