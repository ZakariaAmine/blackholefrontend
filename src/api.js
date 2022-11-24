const api = {
  rootUrl: '/',
  // baseUrl: 'http://95.216.85.81:5000/api', //mock data base folder
  // imgUrl: "http://95.216.85.81:5000/uploads/",
  baseUrl: 'https://blackhole-backend.herokuapp.com/api',
  imgUrl: 'https://blackhole-backend.herokuapp.com/uploads/',
  user: '/users',
  collection: '/collections',
  utils: '/utils'
}

export default api;

export const getAvatar = (data) => {
  return (data && data.avatar) ? (api.imgUrl + data.avatar) : "/img/avatar.png";
}