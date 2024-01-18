import request from '@/common/request';
import {
  projectSpaceDetailUrl,
  projectSpaceFollowUrl,
  projectSpaceHomeTopUrl,
  projectSpaceListUrl,
  projectSpaceUnfollowUrl,
  projectSpaceUserList,
  searchProjectUrl,
  projectSpaceAddMemberUrl,
  projectSpaceFindRoleUrl,
  projectSpaceDeleteMemberUrl,
  projectSpaceUpdateMemberUrl,
  updateProjectInfoUrl,
  createProjectUrl,
  reportOptionsUrl,
  reportUrl,
  fetchContributorUrl,
  fetchProjectDataUrl,
  allNetUrl,
} from '@/common/api/url-manager';

const host = process.env.VUE_APP_URL_HOST;

/**
 * 项目空间成员列表
 * @param project           项目 id
 * @param role                角色成员角色 1、管理员 2、普通成员
 * @param currentPage
 * @param pageSize
 * @param address
 * @returns {AxiosPromise}
 */
export function spaceMemberList({
  project, role, currentPage, pageSize, address,
}) {
  return request({
    method: 'get',
    url: projectSpaceUserList,
    params: {
      project,
      role,
      currentPage,
      pageSize,
      address,
    },
  });
}

/**
 * 项目空间详情
 * @param code
 * @returns {AxiosPromise}
 */
export function spaceDetail({ code }) {
  return request({
    method: 'get',
    url: projectSpaceDetailUrl + code,
  });
}

/**
 * 项目空间列表
 * @returns {AxiosPromise}
 */
export function spaceList() {
  return request({
    method: 'get',
    url: projectSpaceListUrl,
  });
}

/**
 * 项目空间列表Top10
 * @returns {AxiosPromise}
 */
export function spaceListTop() {
  return request({
    method: 'get',
    url: projectSpaceHomeTopUrl,
  });
}

/**
 * follow
 * @param projectId
 * @returns {AxiosPromise}
 */
export function followSpace({ projectId }) {
  return request({
    url: projectSpaceFollowUrl,
    method: 'post',
    data: {
      projectId,
    },
  });
}

/**
 * unfollow
 * @param projectId
 * @returns {AxiosPromise}
 */
export function unfollowSpace({ projectId }) {
  return request({
    url: projectSpaceUnfollowUrl,
    method: 'post',
    data: {
      projectId,
    },
  });
}

// 项目空间添加成员
/**
 * unfollow
 * @param address
 * @param projectCode
 * @param userAddress
 * @param role
 * @returns {AxiosPromise}
 */
export function addMember({
  address, projectCode, userAddress, role = 3,
}) {
  return request({
    url: projectSpaceAddMemberUrl,
    method: 'post',
    data: {
      address,
      projectCode,
      userAddress,
      role,
    },
  });
}

// 项目空间删除成员
/**
 * unfollow
 * @param address
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteMember({ address, id }) {
  return request({
    url: projectSpaceDeleteMemberUrl,
    method: 'post',
    data: {
      address,
      id,
    },
  });
}

// 项目空间删除成员
/**
 * unfollow
 * @param address
 * @param id
 * @param role
 * @returns {AxiosPromise}
 */
export function updateMember({ address, id, role }) {
  return request({
    url: projectSpaceUpdateMemberUrl,
    method: 'post',
    data: {
      address,
      id,
      role,
    },
  });
}

/**
 * 获取成员权限
 * @param code
 * @returns {AxiosPromise}
 */
export function findRole({ project, address }) {
  return request({
    method: 'get',
    url: projectSpaceFindRoleUrl,
    params: {
      project,
      address,
    },
  });
}

/**
 * 搜索项目
 * @param currentPage
 * @param pageSize
 * @param keyword
 * @returns {AxiosPromise}
 */
export function searchProject({ currentPage, pageSize = 20, keyword }) {
  return request({
    method: 'get',
    url: searchProjectUrl,
    params: {
      value: keyword,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 更新项目信息
 * @param info
 * @returns {AxiosPromise}
 */
export function updateProjectInfo({ info }) {
  return request({
    method: 'post',
    url: updateProjectInfoUrl,
    data: {
      ...info,
    },
  });
}

/**
 * 创建项目空间
 * @param data
 * @returns {AxiosPromise}
 */
export function createProject({ address, msg, sig }) {
  return request({
    method: 'post',
    url: createProjectUrl,
    data: {
      address, msg, sig,
    },
  });
}

/**
 * 获取举报类型列表
 * @returns {AxiosPromise}
 */
export function fetchReportOptions() {
  return request({
    method: 'get',
    url: reportOptionsUrl,
  });
}

/**
 * 举报
 * @param service
 * @param serviceId
 * @param typeId
 * @param content
 * @returns {AxiosPromise}
 */
export function addReport({
  service, serviceId, typeId, content,
}) {
  return request({
    method: 'post',
    url: reportUrl,
    data: {
      service, serviceId, typeId, content,
    },
  });
}

/**
 * 获取贡献排行榜
 * @param code
 * @param sortType
 * @param sortField
 * @returns {AxiosPromise}
 */
export function fetchProjectContributors({
  code,
  sortType,
  sortField,
}) {
  return request({
    method: 'get',
    url: fetchContributorUrl,
    params: {
      projectCode: code,
      currentPage: 1,
      pageSize: 15,
      sortType,
      sortField,
    },
  });
}

/**
 * 获取首页数据栏数据
 * @returns {AxiosPromise}
 */
export function fetchProjectData() {
  return request({
    method: 'get',
    url: fetchProjectDataUrl,
  });
}

/**
 * 获取所有网络配置
 * @returns {AxiosPromise}
 */
export function fetchAllNet() {
  return request({
    method: 'get',
    url: allNetUrl,
  });
}

export function fetchSupportChains() {
  return request({
    method: 'get',
    url: `${host}/supportChain/findList`,
  });
}
