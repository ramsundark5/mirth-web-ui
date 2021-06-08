class MessageConstants {
  UNAUTHORIZED_MESSAGE = hostName =>
    `Authorization error from ${hostName}. Check your credentials/permissions or try reconnecting.`;
}
export default new MessageConstants();
