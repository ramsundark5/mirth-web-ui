/* eslint-disable no-useless-escape */
import faker from 'faker';
import { createServer, Response } from 'miragejs';

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,
    routes() {
      this.namespace = 'mirth';
      this.post('/login', () => {
        return new Response(200, {}, successLoginResponse);
      });
      this.post('/api', (schema, request) => {
        const requestedMirthUrl = request?.requestHeaders?.['mirth-url'] || '';
        if (requestedMirthUrl.includes('/messages/')) {
          const messageContentResponse = messageContent(1);
          return new Response(200, {}, messageContentResponse);
        }
        if (requestedMirthUrl.includes('/messages')) {
          const messageListResponse = generateMessageList();
          return new Response(200, {}, messageListResponse);
        }
        const channelStatusResponse = generateChannelStatuses();
        return new Response(200, {}, channelStatusResponse);
      });
    },
  });
}

const successLoginResponse = `<com.mirth.connect.model.LoginStatus>
  <status>SUCCESS</status>
  <message></message>
  <updatedUsername>test</updatedUsername>
</com.mirth.connect.model.LoginStatus>
`;

const percentage = (total, percent) => {
  return Math.ceil((percent / 100) * total);
};

const generateChannelStatuses = () => {
  let finalResponse = '<list>';
  for (let i = 0; i < 110; i++) {
    const response = channelStatusTemplate(
      i,
      faker.company.companyName(),
      faker.datatype.number(),
    );
    finalResponse += response;
  }
  finalResponse += '</list>';
  return finalResponse;
};

const generateMessageList = channelId => {
  let finalResponse = '<list>';
  for (let i = 0; i < 50; i++) {
    const response = messageListTemplate(i, channelId);
    finalResponse += response;
  }
  finalResponse += '</list>';
  return finalResponse;
};

const channelStatusTemplate = (channelId, channelName, receivedCount) => `
<dashboardStatus>
  <channelId>${channelId}</channelId>
  <name>${channelName}</name>
  <state>STARTED</state>
  <deployedRevisionDelta>0</deployedRevisionDelta>
  <deployedDate>
    <time>1621625385241</time>
    <timezone>America/New_York</timezone>
  </deployedDate>
  <codeTemplatesChanged>true</codeTemplatesChanged>
  <statistics class="linked-hash-map">
    <entry>
      <com.mirth.connect.donkey.model.message.Status>RECEIVED</com.mirth.connect.donkey.model.message.Status>
      <long>${Math.ceil(receivedCount)}</long>
    </entry>
    <entry>
      <com.mirth.connect.donkey.model.message.Status>FILTERED</com.mirth.connect.donkey.model.message.Status>
      <long>${percentage(receivedCount, 70)}</long>
    </entry>
    <entry>
      <com.mirth.connect.donkey.model.message.Status>SENT</com.mirth.connect.donkey.model.message.Status>
      <long>${percentage(receivedCount, 20)}</long>
    </entry>
    <entry>
      <com.mirth.connect.donkey.model.message.Status>ERROR</com.mirth.connect.donkey.model.message.Status>
      <long>${percentage(receivedCount, 10)}</long>
    </entry>
  </statistics>
  <childStatuses>
    <dashboardStatus>
      <channelId>${channelId}</channelId>
      <name>Source</name>
      <state>STARTED</state>
      <statistics class="linked-hash-map">
        <entry>
          <com.mirth.connect.donkey.model.message.Status>RECEIVED</com.mirth.connect.donkey.model.message.Status>
          <long>${Math.ceil(receivedCount)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>FILTERED</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 70)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>SENT</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 20)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>ERROR</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 10)}</long>
        </entry>
      </statistics>
      <childStatuses/>
      <metaDataId>0</metaDataId>
      <queueEnabled>false</queueEnabled>
      <queued>${percentage(receivedCount, 1)}</queued>
      <waitForPrevious>false</waitForPrevious>
      <statusType>SOURCE_CONNECTOR</statusType>
    </dashboardStatus>
    <dashboardStatus>
      <channelId>${channelId}</channelId>
      <name>${channelName} Destination 1</name>
      <state>STARTED</state>
      <statistics class="linked-hash-map">
        <entry>
          <com.mirth.connect.donkey.model.message.Status>RECEIVED</com.mirth.connect.donkey.model.message.Status>
          <long>${Math.ceil(receivedCount)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>FILTERED</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 70)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>SENT</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 20)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>ERROR</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 10)}</long>
        </entry>
      </statistics>
      <childStatuses/>
      <metaDataId>0</metaDataId>
      <queueEnabled>false</queueEnabled>
      <queued>10</queued>
      <waitForPrevious>false</waitForPrevious>
      <statusType>SOURCE_CONNECTOR</statusType>
    </dashboardStatus>
    <dashboardStatus>
      <channelId>${channelId}</channelId>
      <name>${channelName} Destination 2</name>
      <state>STARTED</state>
      <statistics class="linked-hash-map">
        <entry>
          <com.mirth.connect.donkey.model.message.Status>RECEIVED</com.mirth.connect.donkey.model.message.Status>
          <long>${Math.ceil(receivedCount)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>FILTERED</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 70)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>SENT</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 20)}</long>
        </entry>
        <entry>
          <com.mirth.connect.donkey.model.message.Status>ERROR</com.mirth.connect.donkey.model.message.Status>
          <long>${percentage(receivedCount, 10)}</long>
        </entry>
      </statistics>
      <childStatuses/>
      <metaDataId>0</metaDataId>
      <queueEnabled>false</queueEnabled>
      <queued>10</queued>
      <waitForPrevious>false</waitForPrevious>
      <statusType>SOURCE_CONNECTOR</statusType>
    </dashboardStatus>
  </childStatuses>
</dashboardStatus>  
`;

const messageListTemplate = (messageId, channelId) => `
<message>
    <messageId>${messageId}</messageId>
    <serverId>d651e43e-7f64-45a8-ac12-7e6189090e87</serverId>
    <channelId>${channelId}</channelId>
    <receivedDate>
        <time>1622207243767</time>
        <timezone>America/New_York</timezone>
    </receivedDate>
    <processed>true</processed>
    <connectorMessages class="linked-hash-map">
        <entry>
            <int>0</int>
            <connectorMessage>
                <messageId>${messageId}</messageId>
                <metaDataId>0</metaDataId>
                <channelId>${channelId}</channelId>
                <channelName>Test Channel Name</channelName>
                <connectorName>Source</connectorName>
                <serverId>d651e43e-7f64-45a8-ac12-7e6189090e87</serverId>
                <receivedDate>
                    <time>1622207243767</time>
                    <timezone>America/New_York</timezone>
                </receivedDate>
                <status>TRANSFORMED</status>
                <sourceMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </sourceMapContent>
                <connectorMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </connectorMapContent>
                <channelMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </channelMapContent>
                <responseMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </responseMapContent>
                <processingErrorContent>
                    <encrypted>false</encrypted>
                </processingErrorContent>
                <postProcessorErrorContent>
                    <encrypted>false</encrypted>
                </postProcessorErrorContent>
                <responseErrorContent>
                    <encrypted>false</encrypted>
                </responseErrorContent>
                <errorCode>0</errorCode>
                <sendAttempts>1</sendAttempts>
                <responseDate>
                    <time>1622207243775</time>
                    <timezone>America/New_York</timezone>
                </responseDate>
                <chainId>0</chainId>
                <orderId>0</orderId>
            </connectorMessage>
        </entry>
        <entry>
            <int>1</int>
            <connectorMessage>
                <messageId>${messageId}</messageId>
                <metaDataId>1</metaDataId>
                <channelId>${channelId}</channelId>
                <channelName>Test Channel Interface</channelName>
                <connectorName>Destination 1</connectorName>
                <serverId>d651e43e-7f64-45a8-ac12-7e6189090e87</serverId>
                <receivedDate>
                    <time>1622207243767</time>
                    <timezone>America/New_York</timezone>
                </receivedDate>
                <status>TRANSFORMED</status>
                <sourceMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </sourceMapContent>
                <connectorMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </connectorMapContent>
                <channelMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </channelMapContent>
                <responseMapContent>
                    <encrypted>false</encrypted>
                    <content class="map"/>
                </responseMapContent>
                <processingErrorContent>
                    <encrypted>false</encrypted>
                </processingErrorContent>
                <postProcessorErrorContent>
                    <encrypted>false</encrypted>
                </postProcessorErrorContent>
                <responseErrorContent>
                    <encrypted>false</encrypted>
                </responseErrorContent>
                <errorCode>0</errorCode>
                <sendAttempts>1</sendAttempts>
                <responseDate>
                    <time>1622207243775</time>
                    <timezone>America/New_York</timezone>
                </responseDate>
                <chainId>1</chainId>
                <orderId>1</orderId>
            </connectorMessage>
        </entry>
    </connectorMessages>
</message>
`;

const messageContent = messageId => `
<message>
    <messageId>${messageId}</messageId>
    <serverId>d651e43e-7f64-45a8-ac12-7e6189090e87</serverId>
    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
    <receivedDate>
        <time>1622205720218</time>
        <timezone>America/New_York</timezone>
    </receivedDate>
    <processed>true</processed>
    <connectorMessages class="linked-hash-map">
        <entry>
            <int>0</int>
            <connectorMessage>
                <messageId>${messageId}</messageId>
                <metaDataId>0</metaDataId>
                <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                <channelName>Test Channel</channelName>
                <connectorName>Source</connectorName>
                <serverId>d651e43e-7f64-45a8-ac12-7e6189090e87</serverId>
                <receivedDate>
                    <time>1622205720218</time>
                    <timezone>America/New_York</timezone>
                </receivedDate>
                <status>TRANSFORMED</status>
                <raw>
                    <encrypted>false</encrypted>
                    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                    <messageId>1061241</messageId>
                    <metaDataId>0</metaDataId>
                    <contentType>RAW</contentType>
                    <content>MSH|^~\&amp;|Epic|TST4|||20201120015744|F27790|ADT^A04|48295389|P|2.3&#xd;EVN|A04|20160630121055&#xd;PID|||sur00mrn1212||Mirth6^Test^RT^576070482APISuffix||202001130|F||Race W123|address line1^address line 2^city^state^123456||1234567890|9012345678|Eng|Married|reli|sur00mrn1212|855030522|||||||||||N&#xd;NK1|1|NOK_LName_123^NOK_FName_123|||1234567890|9087654321|Contact 1|||||||||19871008&#xd;NK1|2|NOK_LName_234^NOK_FName_234|SPOUSE|AddressLine1^AddressLine2^City123^MA^01879^USA^^^Merrimack|2345678901|8091234567|Emergency Contact 1|||||||||19871009&#xd;PD1|1|||^PrimaryDocLName^PrimaryDocFName&#xd;PV1|1|I|unit^123^234^8765|AdmitType|1^AttenDocLName^AttenDocFName^M^^^AttenDocDegree|||HS|||||||2^AdmitDocLName^AdmitDocFName^AdmitDocMName^^^AdmitDocDegree|OUTPATIENT||FC||||||||||||||||DISPO||||||||202011200001220|&#xd;PV2|1||headache||||||20200812000000&#xd;OBX|||WT^WEIGHT||54|POUND|\r&#xd;OBX|||HT^HEIGHT||5|FT|\r&#xd;DG1|1|ICD-10-CM|J96.90|Pneumonia&#xd;DG1|2|ICD-9-CM|J56.54|Depression&#xd;GT1|1|879219991|Swartz^Arnold||1060 Showalter Dr^^BLACKSBURG^VA^24060|||19410701|F|P/F|SLF|705430824|20160101&#xd;IN1|1|123^test123|3080057|Test Insurance company|address line 1^address line 2^city^state^12345|ContactLName^ContactFName|0123456789|group576070482|groupName576070482|||20160630|20240819|||subLName^subFName|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||2|||||||||||||839963|987654111||||||DISABLED|F&#xd;IN1|1|Z11|3080057|MEDICARE|address line 1^address line 2^city^state^12345||(601)936-0105|||||20160101|20170101|||Hemp^Ivan|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||1|||||||||||||839963|351079594||||||DISABLED|F&#xd;TXA|1||TX|||||||||test||||test||||AD&#xd;OBX|1|TX|||I am testing Hl7Doc&#xd;OBX|2|TX|||This is some sample&#xd;</content>
                    <dataType>HL7V2</dataType>
                </raw>
                <encoded>
                    <encrypted>false</encrypted>
                    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                    <messageId>1061241</messageId>
                    <metaDataId>0</metaDataId>
                    <contentType>ENCODED</contentType>
                    <content>MSH|^~\&amp;|Epic|TST4|||20201120015744|F27790|ADT^A04|48295389|P|2.3&#xd;EVN|A04|20160630121055&#xd;PID|||sur00mrn1212||Mirth6^Test^RT^576070482APISuffix||202001130|F||Race W123|address line1^address line 2^city^state^123456||1234567890|9012345678|Eng|Married|reli|sur00mrn1212|855030522|||||||||||N&#xd;NK1|1|NOK_LName_123^NOK_FName_123|||1234567890|9087654321|Contact 1|||||||||19871008&#xd;NK1|2|NOK_LName_234^NOK_FName_234|SPOUSE|AddressLine1^AddressLine2^City123^MA^01879^USA^^^Merrimack|2345678901|8091234567|Emergency Contact 1|||||||||19871009&#xd;PD1|1|||^PrimaryDocLName^PrimaryDocFName&#xd;PV1|1|I|unit^123^234^8765|AdmitType|1^AttenDocLName^AttenDocFName^M^^^AttenDocDegree|||HS|||||||2^AdmitDocLName^AdmitDocFName^AdmitDocMName^^^AdmitDocDegree|OUTPATIENT||FC||||||||||||||||DISPO||||||||202011200001220|&#xd;PV2|1||headache||||||20200812000000&#xd;OBX|||WT^WEIGHT||54|POUND|\r&#xd;OBX|||HT^HEIGHT||5|FT|\r&#xd;DG1|1|ICD-10-CM|J96.90|Pneumonia&#xd;DG1|2|ICD-9-CM|J56.54|Depression&#xd;GT1|1|879219991|Swartz^Arnold||1060 Showalter Dr^^BLACKSBURG^VA^24060|||19410701|F|P/F|SLF|705430824|20160101&#xd;IN1|1|123^test123|3080057|Test Insurance company|address line 1^address line 2^city^state^12345|ContactLName^ContactFName|0123456789|group576070482|groupName576070482|||20160630|20240819|||subLName^subFName|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||2|||||||||||||839963|987654111||||||DISABLED|F&#xd;IN1|1|Z11|3080057|MEDICARE|address line 1^address line 2^city^state^12345||(601)936-0105|||||20160101|20170101|||Hemp^Ivan|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||1|||||||||||||839963|351079594||||||DISABLED|F&#xd;TXA|1||TX|||||||||test||||test||||AD&#xd;OBX|1|TX|||I am testing Hl7Doc&#xd;OBX|2|TX|||This is some sample&#xd;</content>
                    <dataType>HL7V2</dataType>
                </encoded>
                <response>
                    <encrypted>false</encrypted>
                    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                    <messageId>1061241</messageId>
                    <metaDataId>0</metaDataId>
                    <contentType>RESPONSE</contentType>
                    <content>
            &lt;response&gt;
              &lt;status&gt;RECEIVED&lt;/status&gt;
              &lt;message&gt;MSH|^~\&amp;amp;|MIRTH||Epic|TST4|20210528084200.226||ACK|20210528084200.226|P|2.3&amp;#xd;MSA|AA|48295389&amp;#xd;&lt;/message&gt;
              &lt;statusMessage&gt;HL7v2 ACK successfully generated.&lt;/statusMessage&gt;
          &lt;/response&gt;</content>
                </response>
                <sourceMapContent>
                    <encrypted>false</encrypted>
                    <content class="java.util.Collections$UnmodifiableMap">
                        <m>
                            <entry>
                                <string>prodMode</string>
                                <string>RELEASE</string>
                            </entry>
                            <entry>
                                <string>sourceChannelId</string>
                                <string>353dee33-c3ec-451d-afcd-894ccfbbbbd6</string>
                            </entry>
                            <entry>
                                <string>sourceMessageId</string>
                                <long>85</long>
                            </entry>
                            <entry>
                                <string>destinationSet</string>
                                <linked-hash-set>
                                    <int>1</int>
                                </linked-hash-set>
                            </entry>
                        </m>
                    </content>
                </sourceMapContent>
                <connectorMapContent>
                    <encrypted>false</encrypted>
                    <content class="map">
                        <entry>
                            <string>mirth_source</string>
                            <string>CERGH</string>
                        </entry>
                        <entry>
                            <string>mirth_version</string>
                            <string>2.3</string>
                        </entry>
                        <entry>
                            <string>mirth_type</string>
                            <string>ADT-A04</string>
                        </entry>
                    </content>
                </connectorMapContent>
                <channelMapContent>
                    <encrypted>false</encrypted>
                    <content class="map">
                        <entry>
                            <string>ChannelError</string>
                            <boolean>false</boolean>
                        </entry>
                        <entry>
                            <string>pidAccount</string>
                            <string>sur00mrn1212</string>
                        </entry>
                        <entry>
                            <string>interfaceName</string>
                            <string>cerner_cm_test</string>
                        </entry>
                    </content>
                </channelMapContent>
                <responseMapContent>
                    <encrypted>false</encrypted>
                    <content class="map">
                        <entry>
                            <string>d1</string>
                            <response>
                                <status>QUEUED</status>
                                <message></message>
                                <error></error>
                                <statusMessage>Message queued successfully</statusMessage>
                            </response>
                        </entry>
                    </content>
                </responseMapContent>
                <metaDataMap>
                    <entry>
                        <string>MESSAGE_ID</string>
                        <big-decimal>1061241</big-decimal>
                    </entry>
                    <entry>
                        <string>SOURCE</string>
                        <string>CERGH</string>
                    </entry>
                    <entry>
                        <string>METADATA_ID</string>
                        <big-decimal>0</big-decimal>
                    </entry>
                    <entry>
                        <string>TYPE</string>
                        <string>ADT-A04</string>
                    </entry>
                </metaDataMap>
                <processingErrorContent>
                    <encrypted>false</encrypted>
                </processingErrorContent>
                <postProcessorErrorContent>
                    <encrypted>false</encrypted>
                </postProcessorErrorContent>
                <responseErrorContent>
                    <encrypted>false</encrypted>
                </responseErrorContent>
                <errorCode>0</errorCode>
                <sendAttempts>1</sendAttempts>
                <responseDate>
                    <time>1622205720226</time>
                    <timezone>America/New_York</timezone>
                </responseDate>
                <chainId>0</chainId>
                <orderId>0</orderId>
            </connectorMessage>
        </entry>
        <entry>
            <int>1</int>
            <connectorMessage>
                <messageId>1061241</messageId>
                <metaDataId>1</metaDataId>
                <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                <channelName>Test Channel Interface</channelName>
                <connectorName>Destination 1</connectorName>
                <serverId>d651e43e-7f64-45a8-ac12-7e6189090e87</serverId>
                <receivedDate>
                    <time>1622205720233</time>
                    <timezone>America/New_York</timezone>
                </receivedDate>
                <status>SENT</status>
                <raw>
                    <encrypted>false</encrypted>
                    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                    <messageId>1061241</messageId>
                    <metaDataId>1</metaDataId>
                    <contentType>RAW</contentType>
                    <content>MSH|^~\&amp;|Epic|CERGH|||20201120015744|F27790|ADT^A04|48295389|P|2.3&#xd;EVN|A04|20160630121055&#xd;PID|||sur00mrn1212||Mirth6^Test^RT^576070482APISuffix||202001130|F||Race W123|address line1^address line 2^city^state^123456||1234567890|9012345678|Eng|Married|reli|sur00mrn1212|855030522|||||||||||N&#xd;NK1|1|NOK_LName_123^NOK_FName_123|||1234567890|9087654321|Contact 1|||||||||19871008&#xd;NK1|2|NOK_LName_234^NOK_FName_234|SPOUSE|AddressLine1^AddressLine2^City123^MA^01879^USA^^^Merrimack|2345678901|8091234567|Emergency Contact 1|||||||||19871009&#xd;PD1|1|||^PrimaryDocLName^PrimaryDocFName&#xd;PV1|1|I|unit^123^234^8765|AdmitType|1^AttenDocLName^AttenDocFName^M^^^AttenDocDegree|||HS|||||||2^AdmitDocLName^AdmitDocFName^AdmitDocMName^^^AdmitDocDegree|OUTPATIENT||FC||||||||||||||||DISPO||||||||202011200001220|&#xd;PV2|1||headache||||||20200812000000&#xd;OBX|||WT^WEIGHT||54|POUND|\r&#xd;OBX|||HT^HEIGHT||5|FT|\r&#xd;DG1|1|ICD-10-CM|J96.90|Pneumonia&#xd;DG1|2|ICD-9-CM|J56.54|Depression&#xd;GT1|1|879219991|Swartz^Arnold||1060 Showalter Dr^^BLACKSBURG^VA^24060|||19410701|F|P/F|SLF|705430824|20160101&#xd;IN1|1|123^test123|3080057|Test Insurance company|address line 1^address line 2^city^state^12345|ContactLName^ContactFName|0123456789|group576070482|groupName576070482|||20160630|20240819|||subLName^subFName|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||2|||||||||||||839963|987654111||||||DISABLED|F&#xd;IN1|1|Z11|3080057|MEDICARE|address line 1^address line 2^city^state^12345||(601)936-0105|||||20160101|20170101|||Hemp^Ivan|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||1|||||||||||||839963|351079594||||||DISABLED|F&#xd;TXA|1||TX|||||||||test||||test||||AD&#xd;OBX|1|TX|||I am testing Hl7Doc&#xd;OBX|2|TX|||This is some sample&#xd;</content>
                    <dataType>HL7V2</dataType>
                </raw>
                <encoded>
                    <encrypted>false</encrypted>
                    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                    <messageId>1061241</messageId>
                    <metaDataId>1</metaDataId>
                    <contentType>ENCODED</contentType>
                    <content>MSH|^~\&amp;|Epic|CERGH|||20201120015744|F27790|ADT^A04|48295389|P|2.3&#xd;EVN|A04|20160630121055&#xd;PID|||sur00mrn1212||Mirth6^Test^RT^576070482APISuffix||202001130|F||Race W123|address line1^address line 2^city^state^123456||1234567890|9012345678|Eng|Married|reli|sur00mrn1212|855030522|||||||||||N&#xd;NK1|1|NOK_LName_123^NOK_FName_123|||1234567890|9087654321|Contact 1|||||||||19871008&#xd;NK1|2|NOK_LName_234^NOK_FName_234|SPOUSE|AddressLine1^AddressLine2^City123^MA^01879^USA^^^Merrimack|2345678901|8091234567|Emergency Contact 1|||||||||19871009&#xd;PD1|1|||^PrimaryDocLName^PrimaryDocFName&#xd;PV1|1|I|unit^123^234^8765|AdmitType|1^AttenDocLName^AttenDocFName^M^^^AttenDocDegree|||HS|||||||2^AdmitDocLName^AdmitDocFName^AdmitDocMName^^^AdmitDocDegree|OUTPATIENT||FC||||||||||||||||DISPO||||||||202011200001220|&#xd;PV2|1||headache||||||20200812000000&#xd;OBX|||WT^WEIGHT||54|POUND|\r&#xd;OBX|||HT^HEIGHT||5|FT|\r&#xd;DG1|1|ICD-10-CM|J96.90|Pneumonia&#xd;DG1|2|ICD-9-CM|J56.54|Depression&#xd;GT1|1|879219991|Swartz^Arnold||1060 Showalter Dr^^BLACKSBURG^VA^24060|||19410701|F|P/F|SLF|705430824|20160101&#xd;IN1|1|123^test123|3080057|Test Insurance company|address line 1^address line 2^city^state^12345|ContactLName^ContactFName|0123456789|group576070482|groupName576070482|||20160630|20240819|||subLName^subFName|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||2|||||||||||||839963|987654111||||||DISABLED|F&#xd;IN1|1|Z11|3080057|MEDICARE|address line 1^address line 2^city^state^12345||(601)936-0105|||||20160101|20170101|||Hemp^Ivan|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||1|||||||||||||839963|351079594||||||DISABLED|F&#xd;TXA|1||TX|||||||||test||||test||||AD&#xd;OBX|1|TX|||I am testing Hl7Doc&#xd;OBX|2|TX|||This is some sample&#xd;</content>
                    <dataType>RAW</dataType>
                </encoded>
                <sent>
                    <encrypted>false</encrypted>
                    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                    <messageId>1061241</messageId>
                    <metaDataId>1</metaDataId>
                    <contentType>SENT</contentType>
                    <content>MSH|^~\&amp;|Epic|CERGH|||20201120015744|F27790|ADT^A04|48295389|P|2.3&#xd;EVN|A04|20160630121055&#xd;PID|||sur00mrn1212||Mirth6^Test^RT^576070482APISuffix||202001130|F||Race W123|address line1^address line 2^city^state^123456||1234567890|9012345678|Eng|Married|reli|sur00mrn1212|855030522|||||||||||N&#xd;NK1|1|NOK_LName_123^NOK_FName_123|||1234567890|9087654321|Contact 1|||||||||19871008&#xd;NK1|2|NOK_LName_234^NOK_FName_234|SPOUSE|AddressLine1^AddressLine2^City123^MA^01879^USA^^^Merrimack|2345678901|8091234567|Emergency Contact 1|||||||||19871009&#xd;PD1|1|||^PrimaryDocLName^PrimaryDocFName&#xd;PV1|1|I|unit^123^234^8765|AdmitType|1^AttenDocLName^AttenDocFName^M^^^AttenDocDegree|||HS|||||||2^AdmitDocLName^AdmitDocFName^AdmitDocMName^^^AdmitDocDegree|OUTPATIENT||FC||||||||||||||||DISPO||||||||202011200001220|&#xd;PV2|1||headache||||||20200812000000&#xd;OBX|||WT^WEIGHT||54|POUND|\r&#xd;OBX|||HT^HEIGHT||5|FT|\r&#xd;DG1|1|ICD-10-CM|J96.90|Pneumonia&#xd;DG1|2|ICD-9-CM|J56.54|Depression&#xd;GT1|1|879219991|Swartz^Arnold||1060 Showalter Dr^^BLACKSBURG^VA^24060|||19410701|F|P/F|SLF|705430824|20160101&#xd;IN1|1|123^test123|3080057|Test Insurance company|address line 1^address line 2^city^state^12345|ContactLName^ContactFName|0123456789|group576070482|groupName576070482|||20160630|20240819|||subLName^subFName|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||2|||||||||||||839963|987654111||||||DISABLED|F&#xd;IN1|1|Z11|3080057|MEDICARE|address line 1^address line 2^city^state^12345||(601)936-0105|||||20160101|20170101|||Hemp^Ivan|Self|19410701|1060 Showalter Dr^^BLACKSBURG^VA^24060|||1|||||||||||||839963|351079594||||||DISABLED|F&#xd;TXA|1||TX|||||||||test||||test||||AD&#xd;OBX|1|TX|||I am testing Hl7Doc&#xd;OBX|2|TX|||This is some sample&#xd;</content>
                </sent>
                <response>
                    <encrypted>false</encrypted>
                    <channelId>c30aafa2-4da4-417b-a037-0e43e1905782</channelId>
                    <messageId>1061241</messageId>
                    <metaDataId>1</metaDataId>
                    <contentType>RESPONSE</contentType>
                    <content>
            &lt;response&gt;
              &lt;status&gt;SENT&lt;/status&gt;
              &lt;message&gt;{
              &amp;quot;status&amp;quot; : &amp;quot;success&amp;quot;,
              &amp;quot;message&amp;quot; : &amp;quot;Patient with id 60b0e51cd13c1c3cd095370d processed successfully&amp;quot;,
              &amp;quot;patientEpisodeId&amp;quot; : null
            }&lt;/message&gt;
          &lt;/response&gt;</content>
                    <dataType>RAW</dataType>
                </response>
                <responseMapContent>
                    <encrypted>false</encrypted>
                    <content class="map">
                        <entry>
                            <string>d1</string>
                            <response>
                                <status>SENT</status>
                                <message>
                  {
                    &quot;status&quot; : &quot;success&quot;,
                    &quot;message&quot; : &quot;Patient with id 60b0e51cd13c1c3cd095370d processed successfully&quot;,
                    &quot;patientEpisodeId&quot; : null
                }</message>
                            </response>
                        </entry>
                    </content>
                </responseMapContent>
                <processingErrorContent>
                    <encrypted>false</encrypted>
                </processingErrorContent>
                <postProcessorErrorContent>
                    <encrypted>false</encrypted>
                </postProcessorErrorContent>
                <responseErrorContent>
                    <encrypted>false</encrypted>
                </responseErrorContent>
                <errorCode>0</errorCode>
                <sendAttempts>1</sendAttempts>
                <sendDate>
                    <time>1622205720418</time>
                    <timezone>America/New_York</timezone>
                </sendDate>
                <responseDate>
                    <time>1622205724910</time>
                    <timezone>America/New_York</timezone>
                </responseDate>
                <chainId>1</chainId>
                <orderId>1</orderId>
            </connectorMessage>
        </entry>
    </connectorMessages>
</message>
`;
