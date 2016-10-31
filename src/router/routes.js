import SongsContainer from '../containers/SongsContainer.vue';

const routes = [
  {
    path: '/songs',
    name: 'songs',
    alias: '/',
    component: resolve => resolve(SongsContainer),
  },
  {
    path: '/songs/:id',
    name: 'songDetail',
  },
  {
    path: '/me',
    children: [
      {
        path: 'stream',
        name: 'stream',
      },
      {
        path: 'likes',
        name: 'likes',
      },
      {
        path: 'playlists/:id',
        name: 'playlists',
      },
    ],
  },
  {
    path: '/users/:id',
    name: 'userDetail',
  },
];

export default routes;
