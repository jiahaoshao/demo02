import axios from 'axios'

export function userInfo (username) {
  return axios({
    url: `/api/user/users/${username}`,
    method: 'post'
  })
}
export function userInfoSearch (username) {
  return axios({
    url: `/api/user/users/search/${username}`,
    method: 'post'
  })
}
export function SuccessSearch (username) {
  return axios({
    url: `/api/user/users/successSearch/${username}`,
    method: 'post'
  })
}
export function updateInformation (Information) {
  return axios({
    url: '/api/user/users/update',
    method: 'post',
    data: Information
  })
}
export function apply (requester, receiver) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/users/apply/${requester}/${receiver}`,
    method: 'post'
  })
}
export function change (receiver, requester) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/users/change/${requester}/${receiver}`,
    method: 'post'
  })
}
export function Success (receiver, requester) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/users/success/${requester}/${receiver}`,
    method: 'post'
  })
}
export function SendMessage (requester, receiver, message) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/users/send/${requester}/${receiver}`,
    method: 'post',
    data: message
  })
}

export function SearchMessage (requester, receiver) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/users/searchMessage/${requester}/${receiver}`,
    method: 'post'
  })
}

export function allGroups () {
  return axios({
    url: '/api/user/users/allGroups',
    method: 'post'
  })
}

export function enterGroups (name, groupName) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/enterGroups/${name}/${groupName}`,
    method: 'post'
  })
}

export function personalGroups (name) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/personalGroups/${name}`,
    method: 'post'
  })
}

export function sendPosts (name, posts) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/sendPosts/${name}`,
    method: 'post',
    data: posts
  })
}

export function getPosts (groupId) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/getPosts/${groupId}`,
    method: 'post'
  })
}

export function updatePosts (postId, tips, tipss) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/updatePosts/${postId}/${tips}/${tipss}`,
    method: 'post'
  })
}

export function submitComments (postId, name, comments) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/submitComments/${postId}/${name}`,
    method: 'post',
    data: comments
  })
}

export function searchComments (postId) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/searchComments/${postId}`,
    method: 'post'
  })
}

export function searchGroupsUser (groupId) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/searchGroupsUser/${groupId}`,
    method: 'post'
  })
}

export function searchTogether (username) {
  return axios({
    // eslint-disable-next-line no-template-curly-in-string
    url: `/api/user/searchTogether/${username}`,
    method: 'post'
  })
}
