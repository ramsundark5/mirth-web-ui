/* --- STATE --- */
export interface ConnectionError {
  connectionId: string;
  status?: number;
  message?: string;
}

export interface Connection {
  id: string;
  url?: string;
  username: string;
  jsessionid?: string;
  status?: string;
  isConnected?: boolean;
  error?: ConnectionError;
}

export interface IMirthClientParams {
  url: string;
  username?: string;
  password?: string;
  disableTLSCheck?: boolean;
}
