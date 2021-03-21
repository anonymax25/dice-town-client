export const environment = {
  production: false,
  title: 'Dice Town Online',
  apiUrl: 'http://localhost:3000/api/v1/',
  socketUrl: 'http://localhost:3001/api/v1/',
  socketPath: '/websockets',
  alertSocketNamespace: 'alerts',
  chatSocketNamespace: 'chat',
  gameSocketNamespace: 'game',
  lobbySocketNamespace: 'lobby'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
