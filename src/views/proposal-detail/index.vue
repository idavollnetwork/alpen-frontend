<template>
  <div id="proposal-container">
    <div id="proposal-content" v-if="proposalInfo !== null">
      <div id="proposal-contentLeft">
        <div id="proposal-titleContent">
          <p id="proposal-title">{{proposalInfo ? proposalInfo.title : ''}}</p>
          <div class="d-flex align-items-center justify-content-end title-right">
            <ProposalStateBox :status="proposalInfo.status"></ProposalStateBox>
            <b-button class="ml-4 p-0" variant="link" pill @click="tapReport">
              <IconReportRed class="report-icon"></IconReportRed>
            </b-button>
          </div>
        </div>

        <div id="proposal-detail">
          {{proposalInfo ? proposalInfo.body : ''}}
          <div class="images-container" v-viewer="viewerOptions">
            <b-img class="image"
                   v-for="(item, index) in proposalInfo.images"
                   :key="index"
                   :src="item.src"
                   :alt="item.name"
            ></b-img>
          </div>
        </div>
        <div id="proposal-Vote-mobile" class="proposal-rightCard d-block d-md-none" v-if="isOpen">
          <span id="proposal-voteTitle-mobile">{{ $t('vote2') }}</span>
          <div class="option-item"
               v-for="item in proposalInfo.optionInfoVos"
               :key="item.id"
               @click="selectVote(item)"
               :class="{selected : selectedVote.indexOf(item) !== -1}"
          >
            <span class="option-item__title">
              {{item.body}}
            </span>
            <span class="option-item__number">
              {{$t('proposal.detail.current') + " " + item.userVoteNum}}
            </span>
          </div>
          <b-button variant="primary" pill id="voteButton"
                    @click="tapVote"
                    :disabled="selectedVote.length === 0 || isCheckingBalance"
          >
            <b-spinner v-if="isCheckingBalance"></b-spinner>
            {{ isCheckingBalance ? '' : $t('proposal.detail.vote')}}
          </b-button>
        </div>
        <FundraisingDetailCard :proposal-info="proposalInfo"></FundraisingDetailCard>
        <div id="proposal-contentDetail"
        >
          <div id="proposal-dTop">
            <span id="proposal-dTop-title">{{$t('proposal.detail.currentR')}}</span>
            <a :href="proposalInfo.resultIpfsUrl">
              <IvButton
                v-if="proposalInfo.status === 2"
                :outline="true"
                type="gray"
                :circle="true">
                {{$t('proposal.detail.download')}}
                <span id="share-icon">
                <IconShare></IconShare>
              </span>
              </IvButton>
            </a>
          </div>
          <div class="proposal-chart"
               v-for="item in proposalInfo.optionInfoVos"
               :key="item.id">
            <span class="proposal-chartTitle">
              <span class="title-name">{{item.body}}</span>
              <span class="title-value">{{item.voteRatio}}%</span>
            </span>
            <b-progress class="progressBar" :value="item.voteRatio" :max="100"></b-progress>
          </div>
          <div
            class="d-flex flex-column flex-md-row align-items-start
             align-items-md-center justify-content-md-between d-title-outer
             w-100">
            <span id="proposal-dTitle2">{{$t('proposal.detail.voteD')}}</span>
            <span id="totalVotes-text">{{ $t('total_voters') + totalVoters }}</span>
          </div>
          <b-table
            :fields="tableFields"
            :items="voteList"
            responsive
            class="record-table"
            borderless
          >
            <template #cell(user)="row">
              <span class="d-flex align-items-center justify-content-start i-title"
                    @click="tapUser(row)">
                <b-img
                  class="i-icon"
                  rounded="circle"
                  alt="icon"
                  :src="row.item.userPictures"
                  blank-color="#ffffff"
                ></b-img>
                <span class="i-address">{{ addressFilter(row.item.userAddress) }}</span>
              </span>
            </template>
            <template #cell(choicesBody)="row">
              <span class="i-options">{{ row.item.choicesBody }}</span>
            </template>
            <template #cell(time)="row">
              <span class="i-time">{{ row.item.time }}</span>
            </template>
            <template #cell(validVoteNum)="row">
              <span class="i-votes">{{ row.item.validVoteNum }}</span>
            </template>
          </b-table>
          <div style="width: 100%; display: flex; justify-content: center; padding-top: 40px">
            <MoreButton v-if="!noMore" :loading="isLoadingList" @click="tapMore"></MoreButton>
            <span
              v-else
              style="font-size: 14px; font-family: 'Poppins-Bold', 'BAli'; opacity: 0.3;"
            >{{$t('proposal.detail.nomore')}}</span>
          </div>
        </div>
      </div>
      <div id="proposal-contentRight">
        <div
          id="social-container"
          class="proposal-rightCard d-flex align-items-center justify-content-between"
        >
          <div @click="copyLink">
            <icon-share-gray id="link-icon"></icon-share-gray>
            <b-tooltip target="link-icon" triggers="hover">
              {{$t('proposal.detail.copyL')}}
            </b-tooltip>
          </div>
          <b-img id="kakao-icon" :src="talkIcon" @click="tapKakao"></b-img>
          <b-tooltip target="kakao-icon" triggers="hover">
            {{$t('proposal.detail.shareK')}}
          </b-tooltip>
          <b-img id="fb-icon" :src="fbIcon" @click="tapFbButton"></b-img>
          <b-tooltip target="fb-icon" triggers="hover">
            {{$t('proposal.detail.shareF')}}
          </b-tooltip>
          <a class="twitter-share-button"
             :href="twitterHref" target="_blank">
            <b-img id="icon-tw" :src="twIcon"></b-img>
          </a>
          <b-tooltip target="icon-tw" triggers="hover">
            {{$t('proposal.detail.shareT')}}
          </b-tooltip>
        </div>
        <FundraisingInfoCard></FundraisingInfoCard>
        <div id="proposal-Vote" class="proposal-rightCard d-none d-md-block" v-if="isOpen">
          <span id="proposal-voteTitle">{{ $t('vote2') }}</span>
          <div class="option-item"
               v-for="item in proposalInfo.optionInfoVos"
               :key="item.id"
               @click="selectVote(item)"
               :class="{selected : selectedVote.indexOf(item) !== -1}"
          >
            <span class="option-item__title">
                          {{item.body}}
            </span>
            <span class="option-item__number">
              {{$t('proposal.detail.current') + ' ' + item.userVoteNum}}
            </span>
          </div>
          <b-button variant="primary" pill id="voteButton"
                    @click="tapVote"
                    :disabled="selectedVote.length === 0 || isCheckingBalance"
          >
            <b-spinner v-if="isCheckingBalance"></b-spinner>
            {{ isCheckingBalance ? '' : $t('proposal.detail.vote')}}
          </b-button>
        </div>
        <div id="proposal-Information"
             class="proposal-rightCard"
        >
          <span id="proposal-Information__title">{{$t('proposal.detail.info')}}</span>
          <router-link class="w-100" :to="'/project-detail/' + proposalInfo.projectInfoVo.code">
            <ProposalUserItem
              class="user-item"
              :title="$t('v11.project')"
              :icon="proposalInfo.projectInfoVo ? proposalInfo.projectInfoVo.icon : ''"
              :name="proposalInfo.projectInfoVo ? proposalInfo.projectInfoVo.name : ''"
              :detail="proposalInfo.projectInfoVo ? proposalInfo.projectInfoVo.description : ''"
            ></ProposalUserItem>
          </router-link>

          <router-link
            class="w-100"
            :to="proposalInfo.usersInfoVo
             ? '/user-center/' + proposalInfo.usersInfoVo.address
             : ''">
            <ProposalUserItem
              class="user-item"
              :title="$t('market.home.owner')"
              :icon="proposalInfo.usersInfoVo ? proposalInfo.usersInfoVo.pictures : ''"
              :name="proposalInfo.usersInfoVo ? proposalInfo.usersInfoVo.name : ''"
              :detail="userAddress"
            ></ProposalUserItem>
          </router-link>
          <div id="proposal-information__valueList">
            <span class="value-info">
              <span class="value-title">
                {{$t('proposal.detail.countdown')}}
              </span>
              <span class="value-info">
                {{ countDownTime }}
              </span>
            </span>
            <span class="value-info">
              <span class="value-title">
                {{$t('proposal.detail.ipfs')}}
              </span>
              <span class="value-info">
                {{ ipfsHash }}
              </span>
            </span>
            <span class="value-info">
              <span class="value-title">
                 {{$t('proposal.detail.voteT')}}
              </span>
              <span class="value-info">
                {{
                  proposalInfo.choicesType === 1
                    ? $t('project.detail.singleC')
                    : $t('proposal.item.choiceM')
                }}
              </span>
            </span>
            <span class="value-info">
              <span class="value-title">
                {{ $t('v11.rule') }}
              </span>
              <span class="value-info">
                {{
                  ruleText
                }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <HomeFooter></HomeFooter>
    <VoteModal @didInputVote="inputVote"
               :selected="selectedVote"
               :unit="proposalInfo.projectInfoVo.voteToken || proposalInfo.coin"
               :decimals="proposalInfo.decimals"
               :threshold="proposalInfo.threshold || '0'"
               :rule="proposalInfo.rule"
               :proposal-info="proposalInfo"
               :vote-ratio="parseInt((proposalInfo.projectInfoVo.mapping || '1'), 10)"
               ref="voteModal"></VoteModal>
    <ReportModal
      ref="reportModal"
      :type="'2'"
      :project-id="proposalInfo.id + ''"
      @result="reportRes">
    </ReportModal>
  </div>
</template>
<script>
import IvButton from '@/components/IVButton/index.vue';
import IconShare from '@/components/icons/IconShare.vue';
import ProposalUserItem from '@/views/proposal-detail/proposal-user-item.vue';
import VoteModal from '@/views/modals/VoteModal.vue';
import ToastMixin from '@/mixins/toast-mixin';
import { voteData } from '@/components/modal-container/modal-data';
import { fetchProposalDetail, proposalVoteList, vote } from '@/common/api/proposal-repository';
import ProposalMixin from '@/mixins/proposalMixin';
import { ellipsisThree } from '@/common/filter';
import { calculateTimeStr } from '@/common/tools';
import web3Manager from '@/common/web3/web3';
import IconShareGray from '@/components/icons/IconShareGray.vue';
import talkIcon from '@/assets/img/icon-talk.png';
import fbIcon from '@/assets/img/icon-fb.png';
import twIcon from '@/assets/img/icon-twitter.png';
import insIcon from '@/assets/img/icon-ins.png';
import ProposalStateBox from '@/components/proposal-state-box.vue';
import HomeFooter from '@/views/space-home/home-footer.vue';
import MoreButton from '@/components/more-button.vue';
import InfiniteScrollMixin from '@/mixins/infinite-scroll-mixin';
import WrongNetMixin from '@/mixins/wrongNetMixin';
import IconReportRed from '@/components/icons/IconReportRed.vue';
import ReportModal from '@/components/ReportModal.vue';
import ProposalVoteMixin from '@/mixins/proposal/proposal-vote-mixin';
import FundraisingInfoCard from '../../components/FundraisingInfoCard.vue';
import FundraisingDetailCard from '../../components/FundraisingDetailCard.vue';

export default {
  name: 'ProposalDetail',
  components: {
    FundraisingDetailCard,
    FundraisingInfoCard,
    ReportModal,
    IconReportRed,
    // WrongNetModal,
    MoreButton,
    HomeFooter,
    ProposalStateBox,
    IconShareGray,
    VoteModal,
    ProposalUserItem,
    IconShare,
    IvButton,
  },
  mixins: [ToastMixin, ProposalMixin, InfiniteScrollMixin, WrongNetMixin, ProposalVoteMixin],
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isCheckingBalance: false,
      proposalInfo: {
        images: '',
        body: '',
        projectInfoVo: {
        },
      },
      currentPage: 1,
      voteList: [],
      busy: false,
      selectedVote: [],
      talkIcon,
      fbIcon,
      twIcon,
      insIcon,
      totalVoters: 0,
      // 错误网络
      showWrongNet: false,
      viewerOptions: {
        inline: false,
        button: false,
        navbar: true,
        toolbar: false,
        movable: false,
        transition: false,
      },
    };
  },
  computed: {
    tableFields() {
      return [
        { key: 'user', label: this.$t('proposal.detail.address') },
        { key: 'choicesBody', label: this.$t('proposal.detail.options') },
        { key: 'time', label: this.$t('proposal.detail.time') },
        { key: 'validVoteNum', label: this.proposalInfo.projectInfoVo.voteToken || this.proposalInfo.coin },
      ];
    },
    ruleText() {
      let rule = '';
      if (this.proposalInfo.rule === 2) {
        rule = 'Address Count';
      } else {
        rule = `${this.proposalInfo.projectInfoVo.voteToken || this.proposalInfo.coin} Balance must >= ${this.proposalInfo.threshold}`;
      }
      return rule;
    },
    thresholdInfo() {
      return `${this.proposalInfo ? this.proposalInfo.threshold : '0'} ${
        this.proposalInfo.projectInfoVo.voteToken
          ? this.proposalInfo.projectInfoVo.voteToken : this.proposalInfo.coin}`;
    },
    userAddress() {
      return this.proposalInfo.usersInfoVo
        ? ellipsisThree(this.proposalInfo.usersInfoVo.address)
        : '';
    },
    ipfsHash() {
      return ellipsisThree(this.proposalInfo.ipfsHash);
    },
    countDownTime() {
      return calculateTimeStr(this.countdownSeconds);
    },
    countdownSeconds() {
      return this.$store.getters.countdownValues.proposalCountdown;
    },
    twitterHref() {
      return `https://twitter.com/intent/tweet?text=Check%20out%20this%20proposal%20on%20Alpen%20&url=${window.location.href}&original_referer=${window.location.href}`;
    },
    isOpen() {
      return this.proposalInfo.status === 1;
    },
  },
  methods: {
    tapReport() {
      this.$refs.reportModal.show();
    },
    modalHide() {
      this.showWrongNet = false;
    },
    tapUser(item) {
      this.push(`/user-center/${item.item.userAddress}`);
    },
    selectVote(item) {
      const index = this.selectedVote.indexOf(item);
      const temp = [...this.selectedVote];
      if (this.proposalInfo.choicesType === 1) { // 单选
        // 其他选项取消
        if (index === -1) {
          this.selectedVote = [item];
        }
      } else { // 多选
        // eslint-disable-next-line no-lonely-if
        if (index !== -1) {
          temp.splice(index, 1);
        } else {
          temp.push(item);
        }
        this.selectedVote = temp.sort((a, b) => a.serialCode - b.serialCode);
      }
    },
    copyLink() {
      this.$copyText(window.location.href).then(() => {
        this.successToast(this.$t('proposal.detail.copyS'));
      }, () => {
        this.errorToast(this.$t('proposal.detail.copyN'));
      });
    },
    addressFilter(address) {
      return ellipsisThree(address);
    },
    async tapVote() {
      this.isCheckingBalance = true;
      if (!this.$store.state.connect.isConnected) {
        this.$store.commit('connect', { should: true });
        this.isCheckingBalance = false;
        return;
      }
      // 判断数据,是否能投票
      if (this.proposalInfo.rule === 2) {
        // 每个地址一票, 只能选择一票
        if (this.selectedVote.length > 1) {
          this.errorToast('You only have 1 votes, please select 1 option');
          this.isCheckingBalance = false;
          return;
        }
      }
      try {
        const balance = await web3Manager
          .getBalance({
            address: this.$store.state.connect.address,
            contractAddress: this.proposalInfo.coinContract,
            net: this.proposalInfo.projectInfoVo.network,
          });
        this.$store.commit('updateUserInfo', {
          userInfo: {
            balance,
          },
        });
        this.userBalance = balance;
        this.$nextTick(() => {
          // 判断余额是否够投票
          if (this.balanceRemain <= 0) {
            this.errorToast("You don't have enough votes");
            this.isCheckingBalance = false;
            return;
          }
          this.$refs.voteModal.show();
          this.isCheckingBalance = false;
        });
      } catch (e) {
        this.isCheckingBalance = false;
        this.errorToast(e.message);
      }
    },
    async inputVote({ value }) {
      const loading = this.$showModal({
        type: 'metamask',
        data: voteData(),
      });
      try {
        loading.next();
        const arr = [];
        this.selectedVote.forEach((item, index) => {
          const num = value[index];
          arr.push({
            choice: item.serialCode,
            voteNum: num,
          });
        });
        const voteInfo = {
          timestamp: Math.round((new Date()).getTime()),
          project: this.proposalInfo.projectInfoVo.code,
          type: 'vote', // 投票
          payload: {
            proposal: this.proposalInfo.ipfsHash, // 提案哈希
            choices: arr,
          },
        };
        const text = JSON.stringify(voteInfo);
        const {
          msg,
          sig,
        } = await web3Manager.signData({ data: text });
        loading.next();
        await vote({
          address: this.$store.state.connect.address,
          msg,
          sig,
        });
        loading.next();
        loading.hide();
        this.selectedVote = [];
        this.loadData();
        this.currentPage = 1;
        this.loadList();
      } catch (e) {
        loading.hide();
        this.errorToast(e.message);
      }
    },
    tapMore() {
      this.isLoadingList = true;
      this.loadList();
    },
    async loadData() {
      try {
        const res = await fetchProposalDetail({ code: this.code });
        web3Manager.updateFetchWeb3(res.response.networkVo);
        this.proposalInfo = res.response;
        this.isLoading = false;
        this.currentNet = this.proposalInfo.projectInfoVo.network;
        this.$store.commit('addCountdownValues',
          {
            key: 'proposalCountdown',
            initializeValue: this.proposalInfo.countDown,
          });
        this.$nextTick(() => {
          // 初始化社交网络配置
          this.initialSocial();
        });
      } catch (e) {
        this.errorToast(e.message);
      }
    },
    async loadList() {
      const res = await proposalVoteList({
        proposal: this.code,
        currentPage: this.currentPage,
      });
      this.totalVoters = res.response.totalCount;
      if (res.response.dataList) {
        res.response.dataList.map((item) => {
          const temp = item;
          temp.user = {
            avatar: item.userPictures,
            address: item.userAddress,
          };
          return temp;
        });
      }
      this.voteList = this.handleData(res.response);
    },
    tapFbButton() {
      window.FB.ui({
        method: 'share',
        href: window.location.href,
        quote: this.$t('v11.checkOutThisProposalOnAlpen'),
        hashtag: '#alpen',
      }, () => {
      });
      // window.FB.ui({
      //   method: 'share',
      //   href: 'http://www.mytest.com/proposal-detail/QmUBp5mB6BhkLM6vV3TjCfcPruiHmkQNawvExg7PLcpWh9',
      //   quote: '测试 fb 分享',
      //   hashtag: '测试 fb tag',
      // }, (response) => {
      //   console.log(response);
      // });
    },
    tapKakao() {
      // 分享到 story
      // window.Kakao.Story.share({
      //   url: 'https://www.google.com',
      //   text: '测试发送 kakao story',
      // });
      // 分享到聊天
      window.Kakao.Link.sendDefault({
        objectType: 'text',
        text:
          this.$t('v11.checkOutThisProposalOnAlpen'),
        link: {
          mobileWebUrl:
            window.location.href,
          webUrl:
            window.location.href,
        },
      });
    },
    initialSocial() {
    },
    reportRes({ msg, success }) {
      if (success) {
        this.successToast(msg);
      } else {
        this.errorToast(msg);
      }
    },
  },
  beforeDestroy() {
    this.$store.commit('removeCountdownValue', 'proposalCountdown');
  },
  mounted() {
    this.loadData();
    this.loadList();
  },
  watch: {
    countdownSeconds(newVal) {
      if (newVal === 0) {
        this.proposalInfo.status = 2;
        this.loadData();
        this.loadList();
      }
    },
    code() {
      this.currentPage = 1;
      this.loadData();
      this.loadList();
    },
    '$store.state.connect.address': function (newVal) {
      if (newVal.length > 0) {
        this.loadData();
      }
    },
  },
};
</script>

<style scoped lang="scss">
#proposal-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  #proposal-content {
    @include centered-view;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    margin: 12.267vw 0 10.667vw 0;
    @include media-breakpoint-up(md) {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      margin: 60px 0 40px 0;
    }
    #proposal-contentLeft {
      margin: 0 0 0 0;
      flex-grow: 0;
      @include media-breakpoint-up(md) {
        margin: 0 37px 0 0;
        flex-grow: 1;
      }
      #proposal-titleContent {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        width: 100%;
        margin-bottom: 6.67vw;
        @include media-breakpoint-up(md) {
          margin-bottom: 20px;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }
        #proposal-title {
          @include FontB;
          font-weight: bold;
          color: #23262F;
          text-align: left;
          max-width: 80%;
          margin: 0;
          font-size: 6.4vw;
          line-height: 9.33vw;
          @include media-breakpoint-up(md) {
            font-size: 48px;
            line-height: 56px;
          }
        }
        .title-right {
          margin-top: 4.6vw;
          @include media-breakpoint-up(md) {
            margin-top: 0;
          }
        }
        .report-icon {
          width: 6.67vw;
          height: 6.67vw;
          @include media-breakpoint-up(md) {
            width: 40px;
            height: 40px;
          }
        }
      }
      #proposal-detail {
        @include FontR;
        font-size: 20px;
        font-weight: 400;
        color: rgba(0,0,0,0.6);
        line-height: 30px;
        background: #F4F5F6;
        text-align: left;
        border-radius: 12px;
        word-wrap: break-word;
        line-break: normal;
        word-break: break-word;
        white-space: pre-line;
        padding: 3.733vw;
        @include media-breakpoint-up(md) {
          padding: 24px;
        }
      }
      #proposal-contentDetail {
        background: #FFFFFF;
        border-radius: 12px;
        border: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin-top: 10.667vw;
        @include media-breakpoint-up(md) {
          padding: 20px;
          border: 1px solid rgba(0,0,0,0.1);
          margin-top: 40px;
        }
        #proposal-dTop {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          width: 100%;
          @include media-breakpoint-up(md) {
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
          }
          #proposal-dTop-title {
            @include FontSB;
            font-size: 6.4vw;
            font-weight: 600;
            color: #23262F;
            line-height: 6.4vw;
            margin-bottom: 5.33vw;
            @include media-breakpoint-up(md) {
              font-size: 24px;
              line-height: 24px;
              margin-bottom: 0;
            }
          }
          #share-icon {
            margin-left: 12px;
          }
        }
        .proposal-chart {
          width: 100%;
          margin: 20px 0 20px 0;
          .proposal-chartTitle {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title-name, .title-value{
              @include FontSB;
              font-size: 14px;
              font-weight: 600;
              color: #000000;
              line-height: 21px;
              opacity: .3;
            }
          }
          .progressBar {
            margin: 10px 0 0 0;
            height: 10px;
            border-radius: 10px;
          }
        }
        .d-title-outer {
          margin: 20px 0 0 0;
        }
        #totalVotes-text {
          font-size: 3.73vw;
          font-weight: 600;
          margin: 5.33vw 0 0 0;
          opacity: 0.6;
          color: #000;
          flex-shrink: 0;
          @include media-breakpoint-up(md) {
            font-size: 14px;
            font-weight: 600;
            margin: 0;
          }
        }
        #proposal-dTitle2 {
          @include FontSB;
          font-size: 24px;
          font-weight: 600;
          color: #23262F;
          line-height: 24px;
          text-align: left;
          width: 100%;
        }
        #proposal-historyTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin: 20px 0 0 0;
          span {
            @include FontR;
            opacity: 0.3;
            font-size: 14px;
            font-weight: 400;
            color: #000000;
            line-height: 20px;
            width: 24%;
            min-width: 150px;
          }
          #history-address {
            text-align: left;
          }
          #history-votes {
            text-align: right;
          }
        }
        #proposal-historyList {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          overflow-x: auto;
          .proposal-historyItem {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 20px 0 0 0;
            .i-title {
              cursor: pointer;
              &:hover {
                opacity: 0.8;
              }
            }
            .i-icon {
              width: 40px;
              height: 40px;
            }
            span {
              @include FontR;
              font-size: 14px;
              font-weight: 400;
              color: #000000;
              line-height: 21px;
              opacity: 0.6;
              width: 24%;
              min-width: 150px;
            }
            .i-address {
              margin: 0 0 0 12px
            }
            .i-votes {
              text-align: right;
            }
          }
        }
      }
    }
    #proposal-contentRight {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      flex-shrink: 0;
      position: static;
      top: unset;
      margin-top: 10.667vw;
      @include media-breakpoint-up(md) {
        width: 390px;
        flex-shrink: 0;
        position: sticky;
        top: 140px;
        margin: 0;
      }
      #social-container {
        img {
          width: 8.86vw;
          height: 8.86vw;
          cursor: pointer;
          @include media-breakpoint-up(md) {
            width: 40px;
            height: 40px;
          }
        }
        #link-icon {
          width: 8.86vw;
          height: 8.86vw;
          cursor: pointer;
          @include media-breakpoint-up(md) {
            width: 40px;
            height: 40px;
          }
        }
      }

      .button-inner {
        @include FontSB;
        opacity: 0.3;
        margin: 0 0 0 40px;
        font-size: 14px;
        font-weight: 600;
        color: #000000;
        line-height: 20px;
      }
    }
  }
}

#proposal-voteTitle-mobile, #proposal-voteTitle {
  @include FontSB;
  font-weight: 600;
  color: #23262F;
  font-size: 6.4vw;
  line-height: 6.4vw;
  @include media-breakpoint-up(md) {
    line-height: 24px;
    font-size: 24px;
  }
}

.proposal-rightCard {
  background: #FFFFFF;
  border-radius: 12px;
  width: 100%;
  box-shadow: none;
  margin: 0 0 20px 0;
  border: none;
  padding: 1.87vw 3.2vw;
  @include media-breakpoint-up(md) {
    padding: 24px 20px;
    box-shadow: 0 0 64px #1F2F462d;
  }
  .option-button {
    box-shadow: 0 0 64px #1F2F462d;
    padding: 20px;
    margin: 20px 0 0 0;
    width: 100%;
  }
  #voteButton {
    margin: 5.3vw 0 0 0;
    width: 100%;
    height: 12vw;
    font-size: 4.8vw;
    @include media-breakpoint-up(md) {
      margin: 20px 0 0 0;
      font-size: 18px;
      height: 60px;
    }
  }
  &#proposal-Vote-mobile {
    margin-top: 10.667vw;
    padding: 0;
    box-shadow: none;
  }
}

#proposal-Information {
  margin: 20px 0 0 0;
  padding: 25px 20px;
  border: 1px solid #0000002d;
  @include media-breakpoint-up(md) {
    border: none;
    padding: 25px 20px;
  }
  #proposal-Information__title {
    font-size: 6.4vw;
    @include FontSB;
    font-weight: 600;
    color: #23262F;
    line-height: 6.4vw;
    @include media-breakpoint-up(md) {
      line-height: 24px;
      font-size: 24px;
    }
  }
  .user-item {
    margin: 40px 0 0 0;
  }
  #proposal-information__valueList {
    display: grid;
    grid-template-columns: 100%;
    margin: 40px 0 0 0;
    grid-row-gap: 40px;
    grid-column-gap: 20px;
    .value-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      .value-title {
        @include FontM;
        font-weight: 500;
        color: #000000;
        opacity: 0.3;
        font-size: 3.73vw;
        line-height: 4.5vw;
        @include media-breakpoint-up(md) {
          font-size: 13px;
          line-height: 19px;
        }
      }
      .value-info {
        @include FontR;
        font-weight: 400;
        color: #000000;
        opacity: 0.6;
        font-size: 4.8vw;
        line-height: 6.4vw;
        @include media-breakpoint-up(md) {
          line-height: 27px;
          font-size: 18px;
        }
      }
    }
  }
}

.option-item {
  cursor: pointer;
  width: 100%;
  border: 2px solid #E6E8EC;
  border-radius: 12vw;
  margin-top: 4vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3.2vw 3.73vw;
  @include media-breakpoint-up(md) {
    padding: 10px 26px;
    margin-top: 20px;
    border-radius: 60px;
    height: 60px;
  }
  &.selected {
    border: 2px solid #3772FF;
  }
  .option-item__title {
    @include FontSB;
    font-size: 3.2vw;
    font-weight: 600;
    color: #000000;
    line-height: 3.2vw;
    max-width: 70%;
    @include ellipsisText(2);
    @include media-breakpoint-up(md) {
      line-height: 21px;
      font-size: 14px;
    }
  }
  .option-item__number {
    @include FontSB;
    font-size: 3.73vw;
    font-weight: 600;
    color: #000000;
    line-height: 4vw;
    opacity: 0.3;
    @include media-breakpoint-up(md) {
      line-height: 20px;
      font-size: 14px;
    }
  }
}

.i-title {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
}
.i-icon {
  width: 40px;
  height: 40px;
}
.i-address, .i-votes,.i-options, .i-time {
  @include FontR;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  width: 24%;
  min-width: 150px;
  height: 100%;
  line-height: 100%;
  white-space: nowrap;
  opacity: 0.6;
}
.i-address {
  margin: 0 0 0 12px;
}
.i-votes {
  text-align: right;
  opacity: 0.6;
}

::v-deep table td {
  vertical-align: inherit;
  padding: 10px 20px 10px 0;
}

::v-deep table th {
  padding: 10px 10px 10px 0;
  font-size: 14px;
  @include FontM;
  color: #000000;
  line-height: 20px;
  opacity: 0.3;
}

::v-deep table thead, tbody {
  white-space: nowrap;
}

.record-table {
  margin-top: 20px;
}

.images-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin: 5.33vw 0 0 0;
  grid-gap: 2.67vw;
  @include media-breakpoint-up(md) {
    margin-top: 20px;
    grid-gap: 10px;
  }
  .image {
    margin: 10px 0 0 0;
    width: 36vw;
    height: 37vw;
    border-radius: 12px;
    object-fit: cover;
    @include media-breakpoint-up(md) {
      margin: 10px 0 0 0;
      width: 100px;
      height: 100px;
    }
  }
}

</style>
