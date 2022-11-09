export enum MessageSender {
  APP = "app",
  PARTNER = "partner",
}

export interface TestBoxInnerMessage<K, V> {
  version: 1;
  sender: MessageSender;
  event: K;
  data: V;
}

export interface TestBoxMessage<K, V> {
  testbox: TestBoxInnerMessage<K, V>;
}
