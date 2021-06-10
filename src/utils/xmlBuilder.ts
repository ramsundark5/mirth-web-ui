import xml2js from 'xml2js';

export function convertToXML(body) {
  const xmlBuilder = new xml2js.Builder();
  if (body) {
    body = xmlBuilder.buildObject(body);
  }
  return body;
}

export const xmlParse = initXMLParser();

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
