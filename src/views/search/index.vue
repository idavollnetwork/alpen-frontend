<template>
  <div id="search-res-page">
    <div id="search-res-content">
      <p
        id="title-text"
      >
      {{$t('search.desc')}} <span id="name-text">{{filter}}</span></p>
      <div id="spaceList" v-if="filter === 'Space'">
        <SearchProjectCard v-for="item in spaceList" :key="item.id" :item="item">
        </SearchProjectCard>
<!--        <ProjectItem v-for="item in spaceList" :key="item.id" :item="item"></ProjectItem>-->
      </div>
      <div id="userList" v-else-if="filter === 'User'">
        <user-item v-for="item in userList" :key="item.id" :item="item"></user-item>
      </div>
      <div id="proposalList" v-else>
        <ProposalItem
          class="proposal-item"
          v-for="item in proposalList" :key="item.id" :item="item"
          @click="tapProposal(item)"
        >
        </ProposalItem>
      </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import ProposalItem from '@/views/space-home/proposal-item.vue';
import { searchProposal } from '@/common/api/proposal-repository';
import throttle from 'lodash/throttle';
import UserItem from '@/views/search/User-item.vue';
import { searchUser } from '@/common/api/user-repository';
import SearchProjectCard from '@/views/search/search-project-card.vue';
import { searchProject } from '@/common/api/space-repository';

let that;

export default {
  name: 'SearchResultPage',
  components: { SearchProjectCard, UserItem, ProposalItem },
  computed: {
    ...mapState({
      isBlur: (state) => state.search.isBlur,
      isFocus: (state) => state.search.isFocus,
      inputValue: (state) => state.search.inputValue,
      filter: (state) => state.search.filter,
    }),
  },
  methods: {
    search: throttle(() => {
      switch (that.filter) {
        case 'User':
          that.fetchUser();
          break;
        case 'Space':
          that.fetchProject();
          break;
        case 'Proposal':
          that.fetchProposal();
          break;
        default:
          break;
      }
    }, 200),
    async fetchUser() {
      const res = await searchUser({
        currentPage: this.currentPage,
        keyword: this.inputValue,
      });
      this.userList = res.response.dataList;
    },
    async fetchProject() {
      const res = await searchProject({
        currentPage: this.currentPage,
        keyword: this.inputValue,
      });
      this.spaceList = res.response.projectList;
    },
    async fetchProposal() {
      const res = await searchProposal({
        currentPage: this.currentPage,
        keyword: this.inputValue,
      });
      this.proposalList = res.response.dataList;
    },
    tapProposal(item) {
      this.push(`/proposal-detail/${item.ipfsHash}`);
    },
  },
  data() {
    return {
      spaceList: [],
      userList: [],
      proposalList: [],
      currentPage: 1,
    };
  },
  watch: {
    inputValue(newVal) {
      if (newVal.length > 0) {
        this.search();
      } else {
        this.clear();
      }
    },
    filter() {
      this.search();
    },
  },
  mounted() {
    that = this;
    if (this.inputValue.length > 0) {
      this.search();
    }
  },
};
</script>

<style scoped lang="scss">
#search-res-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: auto;
  @include media-breakpoint-up(md) {
  }
  #search-res-content {
    margin: 21.33vw 0 0 0;
    padding: 0 8vw;
    @include media-breakpoint-up(md) {
      margin: 80px 0 0 0;
      padding: 0 30px;
    }
    @include centered-view;
    #title-text {
      @include FontR;
      font-weight: 400;
      color: #23262F;
      margin-top: 15.2vw;
      line-height: 1.4;
      font-size: 6.4vw;
      @include media-breakpoint-up(md) {
        margin-top: 70px;
        line-height: 48px;
        font-size: 30px;
      }
      #name-text {
        @include FontB;
      }
    }
    #proposalList {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
      grid-gap: 5.33vw;
      @include media-breakpoint-up(md) {
        grid-template-columns: repeat(auto-fill, minmax(413px, 1fr));
        grid-gap: 40px;
      }
      .proposal-item {
        border: 1px solid rgba(0,0,0,0.1);
      }
    }
    #userList {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(285px, 1fr));
      grid-column-gap: 0;
      grid-row-gap: 6.67vw;
      margin-top: 9.67vw;
      @include media-breakpoint-up(md) {
        margin-top: 50px;
        grid-row-gap: 70px;
      }
    }
  }
}
</style>
