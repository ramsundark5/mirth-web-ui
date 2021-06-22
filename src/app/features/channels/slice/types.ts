export interface ChannelError {
  status: number;
  message: string;
}

export interface Channel {
  id: string; //channel id is not unique across servers
  channelId: string;
  connectionId: string;
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
  channelUidList?: string[];
  action?: string;
}

export enum CHANNEL_ACTIONS {
  START = 'START',
  STOP = 'STOP',
  HALT = 'HALT',
  PAUSE = 'PAUSE',
  RESUME = 'RESUME',
}
