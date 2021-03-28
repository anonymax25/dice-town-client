export const environment = {
  production: true,
  title: 'Dice Town Online',
  apiUrl: 'http://ec2-34-254-173-6.eu-west-1.compute.amazonaws.com/api/v1/',
  socketUrl: 'http://ec2-34-254-173-6.eu-west-1.compute.amazonaws.com:3001/api/v1/',
  socketPath: '/websockets',
  alertSocketNamespace: 'alerts',
  chatSocketNamespace: 'chat',
  gameSocketNamespace: 'game',
  lobbySocketNamespace: 'lobby'
};
