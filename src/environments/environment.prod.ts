export const environment = {
  production: true,
  title: 'Dice Town Online',
  apiUrl: 'http://ec2-34-240-42-153.eu-west-1.compute.amazonaws.com:80/api/v1/',
  socketUrl: 'http://ec2-34-240-42-153.eu-west-1.compute.amazonaws.com:3001/api/v1/',
  socketPath: '/websockets',
  alertSocketNamespace: 'alerts',
  chatSocketNamespace: 'chat',
  gameSocketNamespace: 'game',
  lobbySocketNamespace: 'lobby'
};
