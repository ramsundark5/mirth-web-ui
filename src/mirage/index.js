import faker from 'faker';
import { createServer } from 'miragejs';
import { v4 as uuidv4 } from 'uuid';

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,
    routes() {
      this.namespace = 'api';
      this.post('users/_login', () => {
        return new Response(200, successLoginResponse);
      });
      this.get('channels/statuses', schema => {
        return new Response(200, allChannelStatuses());
      });
      this.get(
        'channels/abc-def-123/messages?includeContent=false&offset=0&limit=20',
        schema => {
          return schema.messages.all();
        },
      );
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

const allChannelStatuses = () => {
  let allList = [];
  for (let i = 0; i < 110; i++) {
    const response = channelStatusResponse(
      uuidv4(),
      faker.company.companyName(),
      1000 * Math.random(),
    );
    allList.push(response);
  }
  return allList;
};

const channelStatusResponse = (channelId, channelName, receivedCount) => `<list>
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
      <long>${receivedCount}</long>
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
          <long>${receivedCount}</long>
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
      <name>Source</name>
      <state>STARTED</state>
      <statistics class="linked-hash-map">
        <entry>
          <com.mirth.connect.donkey.model.message.Status>RECEIVED</com.mirth.connect.donkey.model.message.Status>
          <long>${receivedCount}</long>
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
      <name>${channelName} Destination 1</name>
      <state>STARTED</state>
      <statistics class="linked-hash-map">
        <entry>
          <com.mirth.connect.donkey.model.message.Status>RECEIVED</com.mirth.connect.donkey.model.message.Status>
          <long>${receivedCount}</long>
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
      <name>Source</name>
      <state>${channelName} Destination 2</state>
      <statistics class="linked-hash-map">
        <entry>
          <com.mirth.connect.donkey.model.message.Status>RECEIVED</com.mirth.connect.donkey.model.message.Status>
          <long>${receivedCount}</long>
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
</list>`;
