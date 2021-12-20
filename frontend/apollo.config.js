module.exports = {
  client: {
    service: {
      name: 'Spiritum Duo',
      url: '/api/graphql/',
    },
    excludes: ['**/__generated__/**', '**/schema.graphql'],
  },
};
