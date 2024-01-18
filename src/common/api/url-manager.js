const host = process.env.VUE_APP_URL_HOST;

const voteUrl = `${host}/proposal/vote/start`; // 投票
const proposalVoteListUrl = `${host}/proposal/vote/pageList`; // 提案列表
const createVoteUrl = `${host}/proposal/create`; // 创建提俺
const proposalInfoUrl = `${host}/proposal/findInfo`; // 提案详情
const homeProposalIndexUrl = `${host}/proposal/indexTop`; // 项目空间首页
const openProposalUrl = `${host}/proposal/openPageList`; // 开放的提案页面
const projectProposalListUrl = `${host}/proposal/pageList`; // 项目列表

const userInfoUrl = `${host}/user/getInfo/`; // 用户信息
const userLoginUrl = `${host}/user/login`; // 用户登录
const userUpdate = `${host}/user/update`; // 用户登录

const projectSpaceUserList = `${host}/project/member/pageList`; // 项目空间成员
const projectSpaceDetailUrl = `${host}/project/code/`; // 项目空间详情
const projectSpaceListUrl = `${host}/project/findList`; // 项目空间列表
const projectSpaceAddMemberUrl = `${host}/project/member/add`; // 项目空间添加成员
const projectSpaceDeleteMemberUrl = `${host}/project/member/delete`; // 项目空间删除成员
const projectSpaceUpdateMemberUrl = `${host}/project/member/updateRole`; // 项目空间修改成员
const projectSpaceFindRoleUrl = `${host}/project/member/findRole`; // 项目空间获取成员权限

const projectSpaceHomeTopUrl = `${host}/project/indexTop`; // 项目空间首页
const projectSpaceFollowUrl = `${host}/project/follow/add`; // follow
const projectSpaceUnfollowUrl = `${host}/project/follow/cancel`; // unfollow

const updateProjectInfoUrl = `${host}/project/update`; // 更新项目空间信息
const createProjectUrl = `${host}/project/add`; // 创建项目空间

const fetchContributorUrl = `${host}/project/contributors/pageList`;

/// search
const searchProjectUrl = `${host}/project/search`;
const searchUserUrl = `${host}/user/search`;
const searchProposalUrl = `${host}/proposal/search`;

/// 个人中心
const userProposalOwnedUrl = `${host}/personal/proposal/owned`;
const userProposalJoinedUrl = `${host}/personal/proposal/participation`;
const userAttentionUsersUrl = `${host}/personal/attention/users`;
const userAttentionProjectUrl = `${host}/personal/attention/project`;
const userFollowersUrl = `${host}/personal/attention/followers`;
const userActionURL = `${host}/personal/action`;
const followUserUrl = `${host}/user/follow/add`;
const unfollowUserUrl = `${host}/user/follow/cancel`;
const updateUserBannerUrl = `${host}/user/updateBackImg`;
const userProjectUrl = `${host}/personal/project/list`;

/// 首页
const fetchProjectDataUrl = `${host}/index/statistics`;

// 上传文件
const uploadFileUrl = `${host}/upload/postFile`;

const reportOptionsUrl = `${host}/report/type`;
const reportUrl = `${host}/report/add`;

const allNetUrl = `${host}/network/findList`;

export {
  voteUrl,
  proposalVoteListUrl,
  createVoteUrl,
  proposalInfoUrl,
  homeProposalIndexUrl,
  openProposalUrl,
  projectProposalListUrl,
  userInfoUrl,
  userLoginUrl,
  projectSpaceUserList,
  projectSpaceDetailUrl,
  projectSpaceListUrl,
  projectSpaceHomeTopUrl,
  projectSpaceFollowUrl,
  projectSpaceUnfollowUrl,
  searchProjectUrl,
  searchUserUrl,
  searchProposalUrl,
  userUpdate,
  userProposalOwnedUrl,
  userProposalJoinedUrl,
  userAttentionUsersUrl,
  userAttentionProjectUrl,
  userFollowersUrl,
  userActionURL,
  followUserUrl,
  unfollowUserUrl,
  uploadFileUrl,
  updateUserBannerUrl,
  projectSpaceAddMemberUrl,
  projectSpaceFindRoleUrl,
  projectSpaceDeleteMemberUrl,
  projectSpaceUpdateMemberUrl,
  updateProjectInfoUrl,
  createProjectUrl,
  reportOptionsUrl,
  reportUrl,
  userProjectUrl,
  fetchContributorUrl,
  fetchProjectDataUrl,
  allNetUrl,
};
