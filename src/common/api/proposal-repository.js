import request from '@/common/request';
import {
  voteUrl,
  createVoteUrl,
  proposalInfoUrl,
  proposalVoteListUrl,
  homeProposalIndexUrl,
  openProposalUrl,
  projectProposalListUrl, searchProposalUrl,
} from '@/common/api/url-manager';

/**
 * 投票
 * @param address   地址
 * @param msg       消息
 * @param sig       签名
 * @param version   版本
 * @returns {*}
 */
export function vote({
  address, msg, sig,
}) {
  return request({
    url: voteUrl,
    method: 'post',
    data: {
      address, msg, sig,
    },
  });
}

/**
 * 提案投票列表
 * @param proposalCode  提案 code
 * @param currentPage
 * @param pageSize
 */
export function proposalVoteList({ proposal, currentPage, pageSize = 20 }) {
  return request({
    url: proposalVoteListUrl,
    method: 'get',
    params: {
      proposal,
      currentPage,
      pageSize,
    },
  });
}

/**
 * 创建提案
 * @param msg
 * @param sig
 * @param version
 * @returns {AxiosPromise}
 */
export function createProposal({ msg, sig, version }) {
  return request({
    url: createVoteUrl,
    method: 'post',
    data: {
      address: localStorage.getItem('address'),
      msg,
      sig,
      version,
    },
  });
}

/**
 * 查看提案详情
 * @param hash
 * @returns {AxiosPromise}
 */
export function fetchProposalDetail({ code }) {
  return request({
    url: proposalInfoUrl,
    method: 'get',
    params: {
      code,
    },
  });
}

/**
 * 项目空间首页
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function homeProposalList({ currentPage, pageSize }) {
  return request({
    url: homeProposalIndexUrl,
    method: 'get',
    params: {
      currentPage,
      pageSize,
    },
  });
}

/**
 * 开放提案列表
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function fetchOpenProposalList({ currentPage, pageSize = 20 }) {
  return request({
    url: openProposalUrl,
    method: 'get',
    params: {
      currentPage,
      pageSize,
    },
  });
}

/**
 * 项目空间提案列表
 * @param projectCode  项目空间 code
 * @param currentPage
 * @param pageSize
 * @param optionType    选项类型：1、单选 2、多选
 * @param sortType      排序 1、新-旧 2旧-新
 * @param status        状态：0、待开始 1、进行中 2、已结束
 */
export function fetchProjectProposalList({
  project, currentPage, pageSize = 20, optionType, sortType, status,
}) {
  return request({
    url: projectProposalListUrl,
    method: 'get',
    params: {
      project, currentPage, pageSize, optionType, sortType, status,
    },
  });
}

/**
 * 搜索提案
 * @param currentPage
 * @param pageSize
 * @param keyword
 * @returns {AxiosPromise}
 */
export function searchProposal({ currentPage, pageSize = 20, keyword }) {
  return request({
    method: 'get',
    url: searchProposalUrl,
    params: {
      search: keyword,
      currentPage,
      pageSize,
    },
  });
}
