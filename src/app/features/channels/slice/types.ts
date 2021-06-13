export interface ChannelError {
  status: number;
  message: string;
}

export interface Channel {
  channelId: string;
  connectionId?: string;
  serverId?: string;
  name?: string;
  state?: string;
  statistic?: Statistic;
  connectors?: Channel[];
}

export interface Statistic {
  RECEIVED?: number;
  SENT?: number;
  ERROR?: number;
  FILTERED?: number;
  QUEUED?: number;
}

export interface ChannelActionParam {
  channelIdList?: string[];
  action?: string;
}
