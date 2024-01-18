<template>
  <div class="follow-card" @click="tapItem">
    <b-skeleton-wrapper :loading="item.loading" class="w-100">
      <template #loading>
        <b-row align-h="center" class="justify-content-start">
          <b-col cols="1">
            <b-skeleton type="avatar" size="88px"></b-skeleton>
          </b-col>
          <b-col class="ml-4">
            <b-skeleton type="text" width="100px" height="30px"></b-skeleton>
            <b-skeleton type="text" width="100px"></b-skeleton>
            <b-skeleton type="button"></b-skeleton>
          </b-col>
        </b-row>
      </template>

      <div class="left-content">
        <b-avatar
          variant="info"
          :src="item.icon"
          datasrc="img"
          class="avatar"
        />
        <div class="info-content">
          <div class="info-up">
            <span class="user-name">{{item.name}}</span>
            <span class="follows">
            {{item.proposalNum + $t('search.proposal') + item.proposalNum > 0 ? 's' : ''}}
          </span>
          </div>
          <iv-button
            :circle="true"
            :type="isFollow ? 'gray' : 'blue'"
            :outline="!!isFollow"
            class="follow-button"
            @click="tapFollow"
          >
            {{isFollow ? $t('search.unfollow') : $t('search.follow')}}
          </iv-button>
        </div>
      </div>
      <div class="right-content">
        <div
          v-for="aItem in resItem.proposalList" :key="aItem.id" class="proposal-item"
          @click.stop="tapProposal(aItem)">
          <span
            class="dot"
            :class="{'blue': aItem.status === 1, 'gray': aItem.status !== 1}"></span>
          <span class="detail">{{aItem.title}}</span>
        </div>
      </div>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
import IvButton from '@/components/IVButton/index.vue';
import { followSpace, unfollowSpace } from '@/common/api/space-repository';

export default {
  name: 'SearchProjectCard',
  components: { IvButton },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  mounted() {
    this.isFollow = this.item.isFollow;
  },
  data() {
    return {
      isFollow: false,
    };
  },
  computed: {
    resItem() {
      if (!this.item.proposalList || this.item.proposalList.length <= 4) {
        return this.item;
      }
      const aItem = this.item;
      aItem.proposalList = aItem.proposalList.splice(0, 4);
      return aItem;
    },
  },
  methods: {
    tapProposal(aItem) {
      this.push(`/proposal-detail/${aItem.ipfsHash}`);
      this.$nextTick(() => {
        this.$store.commit('clearSearch');
      });
    },
    tapItem() {
      this.push(`/project-detail/${this.item.code}`);
      this.$store.commit('didInput', { value: '' });
      this.$nextTick(() => {
        this.$store.commit('clearSearch');
      });
    },
    async tapFollow() {
      if (!this.$store.state.connect.isConnected) {
        this.$store.commit('connect', { should: true });
        return;
      }
      if (this.isFollow) {
        await unfollowSpace({ projectId: this.item.id });
        this.isFollow = false;
      } else {
        await followSpace({ projectId: this.item.id });
        this.isFollow = true;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.follow-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  overflow: hidden;
  padding: 5.33vw 0;
  @include media-breakpoint-up(md) {
    align-items: center;
    flex-direction: row;
    padding: 48px 0 32px 0;
  }
  .left-content {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    flex-grow: 0;
    .avatar {
      width: 13.33vw;
      height: 13.33vw;
      @include media-breakpoint-up(md) {
        width: 88px;
        height: 88px;
      }
    }
    .info-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      flex-grow: 1;
      margin: 0 0 0 3.47vw;
      @include media-breakpoint-up(md) {
        align-items: flex-start;
        flex-direction: column;
        margin: 0 0 0 20px;
        flex-grow: 0;
      }
      .info-up {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        .user-name {
          @include FontM;
          color: #000000;
          font-size: 4.7vw;
          line-height: 6.4vw;
          @include media-breakpoint-up(md) {
            font-size: 16px;
            line-height: 24px;
          }
        }
        .follows {
          @include FontR;
          color: #000000;
          opacity: 0.3;
          font-size: 3.2vw;
          line-height: 5.33vw;
          @include media-breakpoint-up(md) {
            font-size: 12px;
            line-height: 20px;
          }
        }
      }
      .follow-button {
        padding: 1.67vw 5.33vw;
        font-size: 3.2vw;
        @include media-breakpoint-up(md) {
          padding: 5px 23px;
          font-size: 14px;
        }
      }
    }
  }
  .right-content {
    flex-grow: 1;
    overflow: auto;
    max-width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(41vw, 1fr));
    grid-gap: 1.8vw;
    margin-top: 5.33vw;
    @include media-breakpoint-up(md) {
      max-width: 760px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 0;
      grid-gap: 0;
    }
    .proposal-item {
      background: #F4F5F6;
      flex-shrink: 0;
      width: 41vw;
      height: 22.4vw;
      margin-left: 0;
      padding: 3.2vw;
      border-radius: 3.2vw;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      @include media-breakpoint-up(md) {
        width: 170px;
        height: 88px;
        margin-left: 20px;
        padding: 12px;
        border-radius: 12px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 10px;
        &.blue {
          background: #037AFF;
        }
        &.gray {
          background: #C2C2C2;
        }
      }
      .detail {
        text-align: left;
        @include FontSB;
        font-weight: 600;
        color: #000000;
        margin: 12px 0 0 0;
        font-size: 3.2vw;
        line-height: 4.8vw;
        @include ellipsisText(2);
        @include media-breakpoint-up(md) {
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
