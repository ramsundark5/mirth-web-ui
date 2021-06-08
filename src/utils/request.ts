import APIConstants from 'app/constants/APIConstants';
import MessageConstants from 'app/constants/MessageConstants';
import { connectionsActions } from 'app/features/connections/slice';
import { notificationsActions } from 'app/features/notifications/slice';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { store } from 'store';
import log from 'utils/logger';
import { v4 as uuidv4 } from 'uuid';
import xml2js from 'xml2js';
const xmlParse = initXMLParser();

function initXMLParser() {
  const xmlParser = new xml2js.Parser();
  const xmlParse = async xml => {
    try {
      return await xmlParser.parseStringPromise(xml);
    } catch (e) {
      return undefined;
    }
  };
  return xmlParse;
}
export class ResponseError extends Error {
  public response: AxiosResponse;

  constructor(response: AxiosResponse) {
    super(response.statusText);
    this.response = response;
  }
}
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response: AxiosResponse) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }
  return response.data;
}

/**
 * Parses the XML returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
async function parseXML(response: AxiosResponse) {
  let jsonResponse = {};
  if (response.status === 204 || response.status === 205) {
    return jsonResponse;
  }
  if (
    typeof response.data === 'string' &&
    response.statusText !== 'No Content'
  ) {
    jsonResponse = await xmlParse(response.data);
  } else if (
    typeof response.data === 'function' &&
    response.statusText !== 'No Content'
  ) {
    let text = await response.data;
    jsonResponse = await xmlParse(text);
  }
  return jsonResponse;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response: AxiosResponse) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  log.error('Error status found ', response);
  const error = new ResponseError(response);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} requestConfig The options we want to pass to "axios"
 * @param  {boolean} isXmlResponse indicate if response format is XML
 *
 * @return {object}           The response data
 */
export async function request(
  requestConfig: AxiosRequestConfig,
  connectionId?: string,
  isXmlResponse?: boolean,
): Promise<{} | { err: ResponseError }> {
  let jsonResponse = {};
  try {
    if (!requestConfig.timeout || requestConfig.timeout < 1000) {
      requestConfig.timeout = 10000;
    }
    const axiosResponse = await axios.request(requestConfig);
    const response = checkStatus(axiosResponse);
    if (isXmlResponse) {
      jsonResponse = await parseXML(response);
    } else {
      jsonResponse = parseJSON(response);
    }
    let jsessionId = response.headers['jsessionid'];
    if (jsessionId) {
      jsonResponse['jsessionid'] = jsessionId;
    }
    return jsonResponse;
  } catch (error) {
    let errorResponse = {
      status: error?.response?.status,
      message: error?.response?.data,
    };
    log.error('Error in API request:', error);
    const notificationId = uuidv4();
    const requestedMirthUrl =
      requestConfig?.headers?.['mirth-url'] || 'http://unknownhost/';
    const hostName = new URL(requestedMirthUrl).hostname;
    //also show a snackbar of the error
    if (errorResponse.status && errorResponse.status === 401) {
      store.dispatch(
        connectionsActions.updateConnection({
          id: connectionId || '',
          changes: { isConnected: false },
        }),
      );
      store.dispatch(
        notificationsActions.enqueueNotification({
          id: notificationId,
          message: MessageConstants.UNAUTHORIZED_MESSAGE(hostName),
          dismissed: false,
          options: {
            key: notificationId,
            variant: 'error',
          },
        }),
      );
    }
    if (error?.request?.status === 0) {
      const errMessage =
        'Unable to reach the host. Check your internet or network connection.';
      errorResponse = {
        status: 0,
        message: errMessage,
      };
      store.dispatch(
        notificationsActions.enqueueNotification({
          id: notificationId,
          message: errMessage,
          dismissed: false,
          options: {
            key: notificationId,
            variant: 'error',
          },
        }),
      );
      log.error(errMessage);
    }
    throw errorResponse;
  }
}

export async function requestMirthAPI(
  mirthRequestConfig: IMirthAPIConfig,
  requestConfigParams?: AxiosRequestConfig,
): Promise<{} | { err: ResponseError }> {
  let requestConfig: AxiosRequestConfig = {
    url: APIConstants.PROXY_API_REQUEST,
    method: 'POST',
    headers: {
      'mirth-url': mirthRequestConfig.url,
      'mirth-http-method': mirthRequestConfig.method || 'GET',
      jsessionid: mirthRequestConfig.jsessionid,
    },
    ...requestConfigParams,
  };
  if (mirthRequestConfig.data) {
    requestConfig.data = mirthRequestConfig.data;
  }
  let jsonResponse = await request(
    requestConfig,
    mirthRequestConfig.connectionId,
    true,
  );
  return jsonResponse;
}

export interface IMirthAPIConfig {
  connectionId: string;
  url: string;
  jsessionid?: string;
  method?: string;
  data?: any;
}
