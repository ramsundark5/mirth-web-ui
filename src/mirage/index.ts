import { createServer, Model } from 'miragejs';

export function makeServer({ environment = 'test' }) {
  return createServer({
    environment,

    models: {
      channelStatuses: Model,
      channelMessages: Model,
    },
    seeds(server) {
      server.create('channelMessage', {});
    },

    routes() {
      this.namespace = 'api';
      this.get('users/_login');
      this.get('channels/statuses');
      this.get(
        'channels/abc-def/messages?includeContent=false&offset=0&limit=20',
      );
    },
  });
}
