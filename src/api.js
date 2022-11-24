const api = {
  rootUrl: '/',
  // baseUrl: 'http://95.216.85.81:5000/api', //mock data base folder
  // imgUrl: "http://95.216.85.81:5000/uploads/",
  baseUrl: 'https://blackholebackend.vercel.app:5006/api',
  imgUrl: 'https://blackholebackend.vercel.app:5006/uploads/',
  user: '/users',
  collection: '/collections',
  utils: '/utils'
}

export default api;

export const getAvatar = (data) => {
  return (data && data.avatar) ? (api.imgUrl + data.avatar) : "/img/avatar.png";
}