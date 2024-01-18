import Vue from 'vue';
import VueRouter from 'vue-router';
import SpaceHome from '@/views/space-home/index.vue';
import store from '@/store/index';

Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    name: 'Home',
    component: SpaceHome,
  },
  {
    path: '/project-detail/:code',
    name: 'ProjectDetail',
    component: () => import(/* webpackChunkName: "project-detail" */'@/views/project-detail/index.vue'),
    props: true,
  },
  {
    path: '/proposal-detail/:code',
    name: 'ProposalDetail',
    component: () => import(/* webpackChunkName: "proposal-detail" */'@/views/proposal-detail/index.vue'),
    props: true,
  },
  {
    path: '/project-info/:code',
    name: 'ProjectInfo',
    component: () => import(/* webpackChunkName: "project-info" */'@/views/project/projectInfo.vue'),
    props: true,
  },
  {
    path: '/edit-project/:code',
    name: 'EditProjectProfile',
    component: () => import(/* webpackChunkName: "edit-project" */ '@/views/project/edit-project-page.vue'),
    props: true,
  },
  {
    path: '/project-space-list',
    name: 'ProjectSpaceList',
    component: () => import(/* webpackChunkName: "project-space-list" */'@/views/project/projectSpaceList.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "project-space-list" */'@/views/project/test.vue'),
  },
  {
    path: '/create-project',
    name: 'CreateProject',
    component: () => import(/* webpackChunkName: "create-project" */ '@/views/project/create-project.vue'),
  },
  {
    path: '/initiate-proposal/:code',
    name: 'InitiateProposal',
    component: () => import(/* webpackChunkName: "initiate-proposal" */'@/views/proposal-detail/InitiateProposal.vue'),
    props: true,
  },
  {
    path: '/initiate-investment-proposal/:code',
    name: 'InitiateInvestmentProposal',
    component: () => import(/* webpackChunkName: "initiate-proposal" */'@/views/proposal-detail/InitialInvestmentProposal.vue'),
    props: true,
  },
  {
    path: '/proposal-list',
    name: 'ProposalList',
    component: () => import(/* webpackChunkName: "proposal-list" */'@/views/proposal-list/index.vue'),
  },
  {
    path: '/user-center/:address',
    name: 'UserCenter',
    component: () => import(/* webpackChunkName: "user-center" */'@/views/user-center/index.vue'),
    props: true,
    redirect: '/user-center/:address/proposal',
    children: [
      {
        path: 'proposal',
        name: 'UserCenterProposal',
        component: () => import(/* webpackChunkName: "user-proposal" */ '@/views/user-center/proposal/index.vue'),
        props: true,
        redirect: '/user-center/:address/proposal/owned',
        children: [
          {
            path: 'owned',
            name: 'UserProposalOwned',
            component: () => import(/* webpackChunkName: "user-proposal-owned" */ '@/views/user-center/proposal/owned.vue'),
            props: true,
          },
          {
            path: 'joined',
            name: 'UserProposalJoined',
            component: () => import(/* webpackChunkName: "user-proposal-joined" */ '@/views/user-center/proposal/joined.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'attention',
        name: 'UserAttention',
        component: () => import(/* webpackChunkName: "user-attention" */ '@/views/user-center/attention/index.vue'),
        props: true,
        redirect: 'attention/space',
        children: [
          {
            path: 'space',
            name: 'UserAttentionSpace',
            component: () => import(/* webpackChunkName: "user-proposal-owned" */ '@/views/user-center/attention/space.vue'),
            props: true,
          },
          {
            path: 'users',
            name: 'UserAttentionUsers',
            component: () => import(/* webpackChunkName: "user-proposal-joined" */ '@/views/user-center/attention/users.vue'),
            props: true,
          },
          {
            path: 'followers',
            name: 'UserAttentionFollowers',
            component: () => import(/* webpackChunkName: "user-proposal-joined" */ '@/views/user-center/attention/followers.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'space',
        name: 'UserProjectSpace',
        component: () => import(/* webpackChunkName: "user-project-space" */ '@/views/user-center/project/index.vue'),
        props: true,
        redirect: 'space/create',
        children: [
          {
            path: 'create',
            name: 'UserCreatedProject',
            component: () => import(/* webpackChunkName: "user-project-created" */ '@/views/user-center/project/create.vue'),
            props: true,
          },
          {
            path: 'manage',
            name: 'UserManageProject',
            component: () => import(/* webpackChunkName: "user-project-created" */ '@/views/user-center/project/manage.vue'),
            props: true,
          },
        ],
      },
      {
        path: 'action',
        name: 'UserAction',
        component: () => import(/* webpackChunkName: "user-attention" */ '@/views/user-center/action/index.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/edit-profile/:address',
    name: 'editProfile',
    component: () => import(/* webpackChunkName: "user-center" */'@/views/user-center/edit-profile.vue'),
    props: true,
  },
  {
    path: '/edit-project-member/:code',
    name: 'editProject',
    component: () => import(/* webpackChunkName: "edit-member" */'@/views/project/edit-project-member.vue'),
    props: true,
  },
  {
    path: '/add-project-member/:code',
    name: 'AddMember',
    component: () => import(/* webpackChunkName: "add-member" */ '@/views/project/add-member-page.vue'),
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

Vue.prototype.push = (location) => {
  // 前进
  router.push(location);
};

Vue.prototype.pop = () => {
  // 后退
  router.back();
};

router.beforeEach((to, from, next) => {
  store.commit('clearSearch');
  next();
});

router.afterEach(() => {
  document.querySelector('html').scrollTo({ top: 0 });
  document.querySelector('body').scrollTo({ top: 0 });
});

export default router;
