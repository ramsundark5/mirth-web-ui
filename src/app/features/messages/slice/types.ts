import { Channel } from 'app/features/channels/slice/types';
import { Connection } from 'app/features/connections/slice/types';

export interface MessageState {
  searchParams: MessageSearchParams;
  messages: Message[];
  totalCount: number;
  loading: boolean;
  error: MessageError;
}
export interface MessageSearchParams {
  selectedConnection?: Connection;
  selectedChannels: Channel[];
  textSearch?: string;
  status?: string[];
  startDate?: Date;
  endDate?: Date;
  textSearchRegex: boolean;
  page?: number;
  limit?: number;
}

export interface Message {
  messageId: number;
  channelId?: string;
  channelName?: string;
  serverId?: string;
  processed?: boolean;
  receivedDate?: number;
  responseDate?: number;
  connectors?: ConnectorMessage[];
}
export interface ConnectorMessage {
  messageId: string;
  channelId?: string;
  connectorName?: string;
  channelName?: string;
  status?: string;
  orderId?: number;
  receivedDate?: number;
  responseDate?: number;
  errorCode?: number;
  contents?: MessageContent[];
  processingError?: string;
  responseError?: string;
  postProcessorError?: string;
}

export interface MessageContent {
  type: string;
  content?: string;
  contentType?: string;
  dataType?: string;
  encrypted?: boolean;
}

export interface MessageError {
  status: number;
  message: string;
}