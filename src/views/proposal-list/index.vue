<template>
  <div id="proposal-list__container">
    <div id="proposal-list__content">
      <span id="proposal-list__title">{{$t('proposal.list.title')}}</span>
      <div id="proposal-list">
        <ProposalItem
          class="proposal-item"
          v-for="item in proposalList"
          :key="item.id"
          :item="item"
          @click="tapProposal(item)"
        >
        </ProposalItem>
      </div>
    </div>
    <MoreButton v-if="!noMore" @click="tapMore" :loading="isLoading"></MoreButton>
    <span
      v-else
      style="font-size: 14px; font-family: 'Poppins-Bold', 'BAli'; opacity: 0.3;"
    >{{$t('proposal.list.nomore')}}</span>
    <HomeFooter></HomeFooter>
  </div>
</template>

<script>
import ProposalItem from '@/views/space-home/proposal-item.vue';
import { fetchOpenProposalList } from '@/common/api/proposal-repository';
import MoreButton from '@/components/more-button.vue';
import HomeFooter from '@/views/space-home/home-footer.vue';
import InfiniteScrollMixin from '@/mixins/infinite-scroll-mixin';

export default {
  name: 'ProposalList',
  components: { HomeFooter, MoreButton, ProposalItem },
  mixins: [InfiniteScrollMixin],
  data() {
    return {
      currentPage: 1,
      proposalList: [],
    };
  },
  methods: {
    tapMore() {
      this.loadData();
    },
    async loadData() {
      this.isLoading = true;
      const res = await fetchOpenProposalList({ currentPage: this.currentPage });
      this.proposalList = this.handleData(res.response);
    },
    tapProposal(item) {
      this.push(`/proposal-detail/${item.ipfsHash}`);
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped lang="scss">
#proposal-list__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  #proposal-list__content {
    @include centered-view;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    margin: 13.33vw 0 13vw 0;
    @include media-breakpoint-up(md) {
      margin: 43px 0 40px 0;
    }
    #proposal-list__title {
      @include FontB;
      font-size: 6.4vw;
      font-weight: bold;
      color: #23262F;
      line-height: 12.8vw;
      text-align: left;
      @include media-breakpoint-up(md) {
        line-height: 48px;
        font-size: 30px;
      }
    }
    #proposal-list {
      margin-top: 6.67vw;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
      grid-gap: 5.87vw;
      @include media-breakpoint-up(md) {
        grid-template-columns: repeat(auto-fill, minmax(413px, 1fr));
        grid-gap: 40px;
        margin-top: 43px;
      }
      .proposal-item {
        border: 2px solid rgba(0,0,0,0.1);
        border-radius: 3.2vw;
        @include media-breakpoint-up(md) {
          border-radius: 12px;
        }
      }
    }
  }
}
</style>
