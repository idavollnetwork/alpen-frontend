import request from '@/common/request';
import {
  searchUserUrl, userLoginUrl, userUpdate,
  userInfoUrl, userProposalOwnedUrl,
  userProposalJoinedUrl,
  userAttentionProjectUrl,
  userActionURL, userAttentionUsersUrl, userFollowersUrl,
  followUserUrl,
  unfollowUserUrl,
  uploadFileUrl,
  updateUserBannerUrl, userProjectUrl,
} from '@/common/api/url-manager';

/**
 * 用户信息
 * @param address
 * @returns {AxiosPromise}
 */
export function fetchUserInfo({ address }) {
  return request({
    method: 'get',
    url: userInfoUrl + address,
  });
}

/**
 * 登录
 * @param address
 * @param msg
 * @param sig
 * @returns {AxiosPromise}
 */
export function login({ address, msg, sig }) {
  console.log(msg, sig);
  return request({
    method: 'post',
    url: userLoginUrl,
    data: {
      address,
      msg,
      sig,
    },
  });
}

/**
 * 修改用户信息
 * @param facebook
 * @param ins
 * @param name
 * @param pictures
 * @param socialList
 * @param twitter
 * @returns {AxiosPromise}
 */
export function userUpdateInfo({
  email, facebook, ins, name, pictures, socialList, twitter,
}) {
  return request({
    method: 'post',
    url: userUpdate,
    data: {
      email,
      facebook,
      ins,
      name,
      pictures,
      socialList,
      twitter,
    },
  });
}

/**
 * 搜索用户
 * @param currentPage
 * @param pageSize
 * @param keyword
 * @returns {AxiosPromise}
 */
export function searchUser({ currentPage, pageSize = 20, keyword }) {
  return request({
    method: 'get',
    url: searchUserUrl,
    params: {
      search: keyword,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 用户拥有的提案
 * @param currentPage
 * @param pageSize
 * @param address
 * @returns {*}
 */
export function fetchUserProposalOwned({ currentPage, pageSize = 20, address }) {
  return request({
    method: 'get',
    url: userProposalOwnedUrl,
    params: {
      address,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 用户参与的提案
 * @param currentPage
 * @param pageSize
 * @param address
 * @returns {*}
 */
export function fetchUserProposalJoined({ currentPage, pageSize = 20, address }) {
  return request({
    method: 'get',
    url: userProposalJoinedUrl,
    params: {
      address,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 用户关注的项目
 * @param currentPage
 * @param pageSize
 * @param address
 * @returns {*}
 */
export function fetchUserProjectFollowed({ currentPage, pageSize = 20, address }) {
  return request({
    method: 'get',
    url: userAttentionProjectUrl,
    params: {
      address,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 用户关注的人
 * @param currentPage
 * @param pageSize
 * @param address
 * @returns {*}
 */
export function fetchUserFollowedUsers({ currentPage, pageSize = 20, address }) {
  return request({
    method: 'get',
    url: userAttentionUsersUrl,
    params: {
      address,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 用户粉丝
 * @param currentPage
 * @param pageSize
 * @param address
 * @returns {*}
 */
export function fetchUserFollowers({ currentPage, pageSize = 20, address }) {
  return request({
    method: 'get',
    url: userFollowersUrl,
    params: {
      address,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 用户的动作列表
 * @param currentPage
 * @param pageSize
 * @param address
 * @returns {*}
 */
export function fetchUserActions({ currentPage, pageSize = 20, address }) {
  return request({
    method: 'get',
    url: userActionURL,
    params: {
      address,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 关注用户
 * @param address
 * @returns {*}
 */
export function followUser({ address }) {
  return request({
    method: 'post',
    url: followUserUrl,
    data: {
      address,
    },
  });
}

/**
 * 取消关注用户
 * @param address
 * @returns {*}
 */
export function unfollowUser({ address }) {
  return request({
    method: 'post',
    url: unfollowUserUrl,
    data: {
      address,
    },
  });
}

/**
 * 上传文件
 * @param file
 * @returns {*}
 */
export function uploadFile({ file }) {
  const param = new FormData();
  param.append('file', file);
  return request({
    method: 'post',
    url: uploadFileUrl,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: param,
  });
}

/**
 * 修改用户背景图
 * @param url
 * @returns {*}
 */
export function updateUserBanner({ url }) {
  return request({
    method: 'post',
    url: updateUserBannerUrl,
    data: {
      imgUrl: url,
    },
  });
}

/**
 * 查询与用户有关的项目空间
 * @param type
 * @param address
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function fetchUserProject({
  type, address, currentPage, pageSize = 10,
}) {
  let role = 1;
  switch (type) {
    case 'create':
      role = 1;
      break;
    case 'manage':
      role = 2;
      break;
    default:
      role = 3;
      break;
  }
  return request({
    method: 'get',
    url: userProjectUrl,
    params: {
      address,
      role,
      currentPage,
      pageSize,
    },
  });
}
