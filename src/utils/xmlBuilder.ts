import xml2js from 'xml2js';

export function convertToXML(body) {
  const xmlBuilder = new xml2js.Builder();
  if (body) {
    body = xmlBuilder.buildObject(body);
  }
  return body;
}
