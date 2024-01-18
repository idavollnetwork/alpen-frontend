<template>
  <div class="projectInfo">
    <div class="info-wrap">
      <div class="left-content">
        <div class="icon">
          <img :src="memberData.icon" alt="">
        </div>
        <div class="title-cont">
          <span class="title-name">{{ memberData.name }}</span>
          <span class="more-button" id="moreButton">
            <IconMoreOutline></IconMoreOutline>
          </span>
          <b-popover target="moreButton" triggers="focus hover" placement="bottom">
            <div class="edit-popover d-flex flex-column align-items-stretch">
              <router-link :to="'/edit-project/' + code" class="popover-item"
                           v-if="role === 1">
                <BIconPencil></BIconPencil>
                {{ $t('v11.editInformation') }}
              </router-link>
              <span class="report-button popover-item" style="cursor: pointer"
                    @click="tapReport"
              >
                <b-icon-exclamation-triangle></b-icon-exclamation-triangle>
                  {{ $t('v11.reportDao') }}
              </span>
            </div>
          </b-popover>
        </div>
        <div class="link" @click="to_link('webUrl')">
          {{ memberData.webUrl }}
        </div>
        <div class="imgs">
          <img src="@/assets/icon1.png" alt="" @click="to_link('twitter')">
          <img src="@/assets/icon3.png" alt="" @click="to_link('ins')">
          <img src="@/assets/icon2.png" alt="" @click="to_link('facebook')">
        </div>
        <div class="cont-txt">
          {{ memberData.description }}
        </div>
        <div class="t-info">
          <div class="t-title">
            {{ $t('project.info.vote') }}
          </div>
          <div class="t-txt">
            <!-- Ethereum Mainnet -->
            {{ memberData.network }}
          </div>
        </div>
        <div class="t-info">
          <div class="t-title">
            {{ $t('project.info.threshold') }}
          </div>
          <p class="t-txt">
            {{ proposalRule }}
          </p>
        </div>
        <!-- <div class="t-info">
            <div class="t-title">
                  Strategy
            </div>
            <div class="t-txt">
                  erc20-balance-of
            </div>
        </div> -->
        <!-- <div class="t-info"  style="margin-bottom:0">
            <div class="t-title">
                  Strategy
            </div>
            <div class="t-txt">
                poap
            </div>
        </div> -->
      </div>
      <div class="right-content">
        <div class="right-line">
          <div class="header-wrap">
            <div class="title-txt-cont">
              <div class="title-txt">{{ $t('people') }}</div>
            </div>
          </div>
          <div class="list-cont">
            <div class="cont-info" @click="to_userCenter(item.userAddress)"
                 v-for="(item ,index) in memberList" :key="'a'+index">
              <div class="left">
                <div class="head-img">
                  <img :src="item.pictures" alt="">
                </div>
                <div class="addrees">
                  {{ item.userName || item.shortAddress }}
                </div>
              </div>
              <span class="time-text">2020-11-11</span>
            </div>
            <b-button class="all-button" pill variant="outline-secondary"
                      :to="`/edit-project-member/${this.code}`"
            >
                {{ $t('v11.viewAll') }}
            </b-button>
          <!-- 普通成员 -->
<!--          <div class="list-cont">-->
<!--            <div class="name">-->
<!--              {{ $t('project.edit.member') }}-->
<!--            </div>-->
<!--            <div class="cont-info" @click="to_userCenter(item.userAddress)"-->
<!--                 v-for="(item ,index) in memberList" :key="'a'+index">-->
<!--              <div class="left">-->
<!--                <div class="head-img">-->
<!--                  <img :src="item.pictures" alt="">-->
<!--                </div>-->
<!--                <div class="addrees">-->
<!--                  {{ item.addressTreated }}-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="right">-->
<!--                <IconClickShow/>-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </div>
    <div id="footer-content">
      <HomeFooter></HomeFooter>
    </div>
    <ReportModal
      ref="reportModal"
      :type="'1'"
      :project-id="memberData ? memberData.id + '' : ''"
      @result="reportRes">
    </ReportModal>
  </div>
</template>
<script>
import { findRole, spaceDetail, spaceMemberList } from '@/common/api/space-repository';
import { ellipsisThree } from '@/common/filter';
import HomeFooter from '@/views/space-home/home-footer.vue';
import IconMoreOutline from '@/components/icons/IconMoreOutline.vue';
import { BIconPencil, BIconExclamationTriangle } from 'bootstrap-vue';
import ReportModal from '@/components/ReportModal.vue';
import ToastMixin from '@/mixins/toast-mixin';

export default {
  name: 'ProjectInfo',
  components: {
    IconMoreOutline,
    HomeFooter,
    ReportModal,
    BIconPencil,
    BIconExclamationTriangle,
  },
  mixins: [ToastMixin],
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: false,
      a: false,
      memberData: {},
      memberList: [],
      administrators: 1,
      members: 2,
      administratorsList: [],
      edit_show: false,
      pageSize: 100,
      memberAddress: [],
      adminAddress: [],
      role: -1,
    };
  },
  computed: {
    proposalRule() {
      let rule = '';
      if (this.memberData !== 'undefined' && parseInt(this.memberData.threshold, 10) > 0) {
        rule += `Token Balance >=${this.memberData.threshold} ${this.memberData.coin}\n`;
      }
      if (this.memberData.memberOnly === 1) {
        rule += ' Member Only';
      }
      return rule;
    },
  },
  methods: {
    tapReport() {
      this.$refs.reportModal.show();
    },
    reportRes({ msg, success }) {
      if (success) {
        this.successToast(msg);
      } else {
        this.errorToast(msg);
      }
    },
    to_link(val) {
      if (val === 'twitter') {
        window.open(this.memberData.facebook);
      } else if (val === 'ins') {
        window.open(this.memberData.ins);
      } else if (val === 'facebook') {
        window.open(this.memberData.facebook);
      } else if (val === 'webUrl') {
        window.open(this.memberData.webUrl);
      }
    },
    to_userCenter(item) {
      this.push(`/user-center/${item}`);
    },
    edit_member() {
      this.push(`/edit-project-member/${this.code}`);
    },
    getMemberData() {
      spaceDetail({ code: this.code })
        .then((res) => {
          this.memberData = res.response;
          this.memberData.twitter = res.response.twitter;
          this.memberData.ins = res.response.ins;
          this.memberData.facebook = res.response.facebook;
          if (res.response.memberRole === 1 || res.response.memberRole === 2) {
            this.edit_show = true;
          } else {
            this.edit_show = false;
          }
          if (res.response.rule === 1) {
            this.memberData.rule = this.$t('project.info.ruleN');
          } else if (res.response.rule === 2) {
            this.memberData.rule = this.$t('project.info.ruleM');
          }
        })
        .catch(() => {
        });
      findRole({
        project: this.code,
        address: this.$store.state.connect.address,
      }).then((res) => { this.role = res.response; });
    },
    async getMemberList() {
      const res = await spaceMemberList({
        project: this.code,
        role: '',
        pageSize: 15,
        currentPage: this.currentPage,
      }).then(this.handleAddress);
      if (res.response.dataList) {
        const list = res.response.dataList;
        if (this.currentPage === 1) {
          this.memberList = list;
        } else {
          this.memberList = this.memberList.concat(list);
        }
      }
    },
    handleAddress(data) {
      if (data.response.dataList) {
        data.response.dataList.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          item.shortAddress = ellipsisThree(item.userAddress);
        });
      }
      return data;
    },
  },
  mounted() {
    this.getMemberData();
    this.getMemberList();
  },
};
</script>
<style scoped lang="scss">
.projectInfo {
  .list-cont-b {
    margin-bottom: 32px;
  }

  .info-wrap {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    @include centered-view;
    margin: 123px auto;
    margin-bottom: 0;
    @include media-breakpoint-up(md) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
    }
    .left-content {
      text-align: left;
      position: relative;
      width: 100%;
      margin-right: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
      @include media-breakpoint-up(md) {
        width: 30%;
        margin-right: 38px;
        padding: 40px 31px 28px 32px;
        box-shadow: 0 0 25px rgba(31, 47, 70, 0.12);
        border-radius: 16px;
      }
      .icon {
        width: 18.667vw;
        height: 18.667vw;
        margin-bottom: 20px;
        @include media-breakpoint-up(md) {
          width: 98px;
          height: 98px;
          margin-bottom: 20px;
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }

      .title-cont {
        position: relative;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-name {
          font-size: 6.4vw;
          @include FontSB;
          font-weight: 600;
          @include media-breakpoint-up(md) {
            font-size: 30px;
          }
        }
        .more-button {
          cursor: pointer;
        }
        img {
          position: absolute;
          right: 0;
          cursor: pointer;
        }
      }

      .link {
        font-size: 3.73vw;
        @include FontM;
        font-weight: 500;
        color: #000000;
        margin-bottom: 6.67vw;
        cursor: pointer;
        @include media-breakpoint-up(md) {
          font-size: 14px;
          margin-bottom: 20px;
          cursor: pointer;
        }
      }

      .imgs {
        margin-bottom: 6.67vw;
        @include media-breakpoint-up(md) {
          margin-bottom: 20px;
        }
        img {
          margin-right: 26px;
          cursor: pointer;
        }
      }

      .cont-txt {
        font-size: 3.73vw;
        font-family: "PingFangSC-Medium";
        font-weight: 500;
        color: rgba(0, 0, 0, 0.3);
        margin-bottom: 12.26vw;
        @include media-breakpoint-up(md) {
          margin-bottom: 40px;
          font-size: 14px;
        }
      }

      .t-info {
        margin-bottom: 3.73vw;
        @include media-breakpoint-up(md) {
          margin-bottom: 21px;
        }
        .t-title {
          font-size: 3.2vw;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.3);
          margin-bottom: 2.67vw;
          @include FontB;
          @include media-breakpoint-up(md) {
            margin-bottom: 10px;
            font-size: 14px;
          }
        }

        .t-txt {
          font-size: 4.26vw;
          @include FontR;
          font-weight: 400;
          color: #000000;
          white-space: pre-wrap;
          @include media-breakpoint-up(md) {
            font-size: 16px;
          }
        }
      }
    }

    .right-content {
      flex: 1;
      margin-top: 25.8vw;
      //background: #f4f5f6;
      @include media-breakpoint-up(md) {
        margin-top: 0;
        background: transparent;
      }
      .right-line {
        border: none;
        max-height: 100%;
        overflow-y: auto;
        border-radius: 0;
        padding: 0;
        @include media-breakpoint-up(md) {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 21px 20px 27px 20px;
        }
      }
      .header-wrap {
        position: relative;
        .title-txt-cont {
          .title-txt {
            text-align: left;
            font-size: 24px;
            font-weight: bold;
            color: #23262F;
            margin-bottom: 25px;
            @include media-breakpoint-up(md) {
              font-size: 24px;
              margin-bottom: 25px;
            }
          }

          .btn {
            border-radius: 90px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            font-size: 3.2vw;
            @include FontB;
            font-weight: 600;
            color: #000000;
            text-align: center;
            position: absolute;
            top: 0;
            right: 0;
            padding: 1.87vw 4.8vw;
            @include media-breakpoint-up(md) {
              border-radius: 90px;
              font-size: 16px;
              padding: 11px 25px;
            }
          }
        }

        .txt {
          font-size: 14px;
          font-family: "PingFangSC-Medium";
          font-weight: 500;
          color: #000000;
          margin: 20px 0 30px 0;
          text-align: left;
        }
      }

      .list-cont {
        background: transparent;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .name {
          text-align: left;
          font-size: 18px;
          @include FontSB;
          font-weight: 600;
          color: #23262F;
          margin-bottom: 19px;
        }
        .cont-info {
          width: 100%;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:last-child {
            margin-bottom: 32px;
          }

          &:hover {
            background: #F4F5F6;
          }

          #svgs {
            fill: #007AFF !important;
          }

          text-align: left;
          padding: 10px 0 10px 0;

          .left {
            text-align: left;

            .head-img {
              display: inline-block;
              width: 40px;
              height: 40px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
              }
            }

            .addrees {
              display: inline-block;
              font-size: 14px;
              @include FontR;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.6);
              margin-left: 13px;
            }
          }
        }

        .right {
          position: absolute;
          right: 19px;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  #footer-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
}

.edit-popover {
  font-size: 3.73vw;
  line-height: 4.26vw;
  @include FontM;
  @include media-breakpoint-up(md) {
    font-size: 14px;
    line-height: 20px;
  }
  a {
    color: black;
  }
  .popover-item {
    height: 50px;
    display: flex;
    align-items: center;
    grid-gap: 10px;
    color: rgba(0,0,0,0.6);
    &:nth-child(1) {
      border-bottom: 1px solid rgba(0,0,0,0.3);
    }
  }
}

</style>
