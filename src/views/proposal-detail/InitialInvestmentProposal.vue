<template>
  <div class="initiateProposal">
    <b-overlay :show="isLoading">
      <div class="title">{{ $t('proposal.create.title') }}</div>
      <div class="error_wrap" v-if="error_show">
        <div class="error-inner">
          <span>
            {{ $t('proposal.create.warning', [getData.threshold, getData.coin]) }}
          </span>
        </div>
      </div>
      <div class="container-wrap">
        <div class="left-cont input-content">
          <div class="swiper create-proposal-swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="form-page-1">
                  <div class="left-title">
                    {{ $t('proposal.create.create') }}
                  </div>
                  <div class="input-wrap">
                    <div class="name">
                      {{ $t('proposal.create.question') }}
                    </div>
                    <input class="data-input"
                           type="text"
                           v-model="getData.title"
                           :placeholder="$t('pleaseDescribeYourQuestion')">
                  </div>
                  <div class="input-wrap">
                    <div class="name">
                      {{ $t('proposal.create.suggestion') }}
                    </div>
                    <div class="data-input">
                      <textarea v-model="getData.body"
                                class="description-input"
                                id=""
                                :placeholder="$t('pleaseElaborateYourSuggestions')"></textarea>
                      <div class="pic-input-content">
                        <div class="pic-button" v-for="(item, index) in images" :key="index"
                             :class="{add: item.src.length === 0}"
                        >
                          <b-img class="image" v-if="item.src.length > 0" :src="item.src"
                                 :alt="item.name"
                          >
                          </b-img>
                          <div @click="tapAddImage"
                               class="icon" v-else>
                            +
                          </div>
                          <button class="delete-button"
                                  @click="tapDeleteImage(index)"
                                  v-if="item.src.length > 0">
                            <b-icon-x-circle-fill
                              class="delete-icon"></b-icon-x-circle-fill>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <b-button class="next-button"
                            pill
                            variant="primary"
                            @click="tapNextButton"
                  >
                    {{ $t('v11.next1') }}
                  </b-button>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="middle-cont input-content">
                  <div class="left-title">
                    {{ $t('proposal.create.proposalS') }}
                  </div>
                  <div class="input-wrap">
                    <div class="name">
                      {{ $t('chooseMainnet') }}
                    </div>
                    <AvatarSelector :options="chains"
                                    v-model="selectedChain"
                    ></AvatarSelector>
                  </div>
                  <div class="input-wrap">
                    <div class="name">
                      {{ $t('fundraisingAddress') }}
                    </div>
                    <input class="data-input"
                           type="text"
                           v-model="fundAddress">
                  </div>
                  <div class="input-wrap">
                    <div class="name">
                      {{ $t('choostTokne') }}
                    </div>
                    <AvatarSelector :options="tokens"
                                    v-model="selectedToken"
                    ></AvatarSelector>
                  </div>
                  <div class="input-wrap">
                    <div class="name">
                      {{ $t('proposal.create.start') }}
                    </div>
                    <div class="time_input">
                      <div>
                        <date-picker size="large" :default-value="new Date()"
                                     v-model="start_time"
                                     class="startDate"
                                     :placeholder="$t('setStartTime')"
                                     @open="openbtn(1)"
                                     @close="closeBtn(1)"
                                     :disabled-date="minStarDate" :disabled-time="minStarDate2"
                                     confirm type="datetime"
                                     value-type='format' format="YYYY-MM-DD HH:mm"/>
                      </div>
                      <IconArrowOutline :class="{rotate: isOpen}"
                                        color="rgba(0,0,0,0.2)"
                                        class="icon-arrow"
                      />
                    </div>
                    <div class="input-wrap">
                      <div class="name">
                        {{ $t('proposal.create.end') }}
                      </div>
                      <div class="time_input">
                        <div>
                          <date-picker
                            v-model="end_time" class="startDate" :placeholder="$t('setEndTime')"
                            @open="openbtn(2)" @close="closeBtn(2)"
                            confirm type="datetime" value-type='format'
                            :default-value="defaultEndTime"
                            :disabled-date="minEndDate" :disabled-time="minEndDate2"
                            :disabled="start_time === ''"
                            format="YYYY-MM-DD HH:mm"/>
                        </div>
                        <IconArrowOutline :class="{rotate: isOpen_end}"
                                          color="rgba(0,0,0,0.2)"
                                          class="icon-arrow"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="input-wrap" v-show="ruleSelected === 1">
                    <div class="name">
                      {{ $t('proposal.create.minimum') }}
                      <IconHelp
                        class="iconHelp"
                        id="thresholdHelp"
                      ></IconHelp>
                      <b-popover target="thresholdHelp" triggers="hover focus"
                                 placement="bottom">
                          <span class="contract-desc">
                            {{ $t('proposal.create.desc') }}
                          </span>
                      </b-popover>
                    </div>
                    <div class="input-wrap-choice input-wrap-choice-div">
                      <input class="data-input" type="text"
                             placeholder="0" v-model="getData.threshold">
                      <div>{{ projectInfo.voteToken || projectInfo.coin }}</div>
                    </div>
                    <div class="name b-txt">
                      {{ $t('proposal.create.desc1', [this.getData.threshold]) }}
                    </div>
                  </div>
                  <b-button class="release-button"
                            @click="release_btn"
                            variant="primary" pill
                            :disabled="error_show || !canPublish">
                    {{ $t('proposal.create.publish') }}
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="right-cont">
          <a-p-stepper
            @change="changeStep"
            :steps="steps" :current-step="currentStep"></a-p-stepper>
        </div>
      </div>
      <div id="footer-content">
        <HomeFooter></HomeFooter>
      </div>
    </b-overlay>

    <b-modal id="modalShow" :title="$t('proposal.create.confirm')"
             v-model="modalShow" hide-footer hide-header centered>
      <div class="title-cont">
        <div class="title">{{ $t('proposal.create.confirm') }}</div>
        <img class="title-img" src="@/assets/delete_model.png" alt="" @click="delete_model">
      </div>
      <div class="publish-btn" @click="tapButton">{{ $t('proposal.create.publish') }}</div>
      <div class="cancle-btn" @click="delete_model">{{ $t('proposal.create.cancel') }}</div>
    </b-modal>
    <ImageInputModal v-model="showPicInputModal"
                     @didadd="didAddImage"
    ></ImageInputModal>
  </div>
</template>
<script>
// import MarketDropdown from '@/components/market-dropdown/index.vue';
import IconArrowOutline from '@/components/icons/IconArrowOutline.vue';
import { createProposal } from '@/common/api/proposal-repository';
import { spaceDetail } from '@/common/api/space-repository';
import web3Manager from '@/common/web3/web3';
import ToastMixin from '@/mixins/toast-mixin';
import { createData } from '@/components/modal-container/modal-data';
import HomeFooter from '@/views/space-home/home-footer.vue';
import WrongNetMixin from '@/mixins/wrongNetMixin';
import Web3 from 'web3';
import APStepper from '@/components/stepper/index.vue';
import IconHelp from '@/components/icons/IconHelp.vue';
import InitProposalImageMixin from '@/views/proposal-detail/mixins/init-proposal-image-mixin';
import { BIconXCircleFill } from 'bootstrap-vue';
import ImageInputModal from '@/views/proposal-detail/modals/image-input-modal.vue';
import AvatarSelector from '../../components/AvatarSelector.vue';

export default {
  name: 'InitialInvestmentProposal',
  components: {
    AvatarSelector,
    ImageInputModal,
    IconHelp,
    APStepper,
    // WrongNetModal,
    // MarketDropdown,
    IconArrowOutline,
    HomeFooter,
    BIconXCircleFill,
  },
  mixins: [ToastMixin, WrongNetMixin, InitProposalImageMixin],
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      chains: [
        { name: 'ETH', img: 'https://zhouxiaofei-image.oss-cn-hangzhou.aliyuncs.com/201909141845530.jpg' },
        { name: 'MAP', img: 'https://zhouxiaofei-image.oss-cn-hangzhou.aliyuncs.com/201909141845530.jpg' },
        { name: 'BSC', img: 'https://zhouxiaofei-image.oss-cn-hangzhou.aliyuncs.com/201909141845530.jpg' },
        { name: 'KLAYTN', img: 'https://zhouxiaofei-image.oss-cn-hangzhou.aliyuncs.com/201909141845530.jpg' },
      ],
      selectedChain: null,
      fundAddress: '',
      tokens: [
        { name: 'USDT', img: 'https://zhouxiaofei-image.oss-cn-hangzhou.aliyuncs.com/201909141845530.jpg' },
        { name: 'USDC', img: 'https://zhouxiaofei-image.oss-cn-hangzhou.aliyuncs.com/201909141845530.jpg' },
      ],
      selectedToken: null,
      ruleSelected: 0,
      swiper: null,
      steps: [
        'Details',
        'Settings',
      ],
      currentStep: 0,
      isLoading: false,
      questionShow: false,
      thresholdBalance: '0',
      date: new Date(),
      disabled_btn: false,
      isOpen_end: false,
      isOpen: false,
      error_show: false,
      value: '',
      start_time: '',
      end_time: '',
      selected: '',
      getData: {
        timestamp: parseInt((new Date()).getTime() / 1000, 10), // 当前时间戳
        isMember: '',
        rule: '',
        proposalNum: '',
        decimals: '',
        coin: '',
        project: '', // 项目标识 code
        title: '', // 提案标题
        type: '', // 提案选项类型 Single Selection 单一   Multiple Selection  多选
        body: '',
        choices: [], // 提案选项,
        startTime: '', // 开始时间
        endEnd: '', // 结束时间
        threshold: '', // 是否投票限制 0为不限制
        strategies: { // 策略
          name: '', // 代笔符号
          address: '', // 代笔合约地址
        },
      },
      projectInfo: {
        voteToken: null,
      },
      checked: false,
      modalShow: false,
      num: 1,
      sendData: {
        coin: '',
        project: '', // 项目标识 code
        type: '', // proposal 签名  vote 投票
        title: '', // 提案标题
        body: '',
        choices: [], // 提案选项,
        startTime: '', // 开始时间
        endEnd: '', // 结束时间
        threshold: '', // 是否投票限制 0为不限制
        strategies: { // 策略
          name: '', // 代笔符号
          address: '', // 代笔合约地址
        },
      },
      choices: [
        '',
        '',
      ],
      balanceNumber: '',
      defaultEndTime: '',
      number: '',
      balance: 0,
    };
  },
  computed: {
    // 是否可以发布
    canPublish() {
      if (this.choices.length === 2) {
        for (let i = 0; i < this.choices.length; i += 1) {
          if (this.choices[i] === '') {
            return false;
          }
        }
      }
      return !(this.getData.title === ''
        || this.getData.body === ''
        || !this.selectedOption
        || this.start_time === '' || this.end_time === ''
        || (this.ruleSelected === 1 && this.getData.threshold === ''));
    },
  },
  watch: {
    currentValue(val) {
      if ((!this.range && val) || (this.range && val[0] && val[1])) {
        this.$emit('input', val);
      }
    },
    start_time() {
      const Time = new Date(this.start_time);
      let hh = Time.getHours();
      let
        mm = Time.getMinutes();
      this.end_time = '';
      if (mm === 59) {
        hh += 1;
        mm = 0;
      } else {
        mm += 1;
      }
      this.defaultEndTime = new Date(new Date().setHours(hh, mm, 0, 0));
    },
    '$store.state.connect.address': function (newVal) {
      if (newVal.length > 0) {
        this.getMemberData();
      }
    },
    '$store.state.connect.isConnected': function (newVal) {
      if (newVal === true && this.getData.strategies.address !== undefined) {
        this.getMemberData();
      }
    },
  },
  methods: {
    changeStep(index) {
      this.currentStep = index;
      this.swiper.slideTo(this.currentStep);
    },
    tapRuleButton(index) {
      this.ruleSelected = index;
      this.$nextTick(() => {
        this.swiper.updateSize();
        this.swiper.updateAutoHeight();
      });
    },
    tapNextButton() {
      // if ()
      this.currentStep += 1;
      this.swiper.slideTo(this.currentStep);
    },
    initSwiper() {
      this.swiper = new window.Swiper('.create-proposal-swiper', {
        autoHeight: true,
        spaceBetween: 20,
        onlyExternal: true,
        noSwiping: true,
        calculateHeight: true,
        noSwipingClass: 'swiper-slide',
      });
    },
    modalHide() {
      this.showWrongNet = false;
    },
    closeBtn(val) {
      if (val === 1) {
        this.isOpen = false;
      } else if (val === 2) {
        this.isOpen_end = false;
      }
    },
    openbtn(val) {
      if (val === 1) {
        this.isOpen = true;
      } else if (val === 2) {
        this.isOpen_end = true;
      }
    },
    handleVal(x, y) {
      console.log('x', x);
      console.log('y', y);
    },
    a({
      type,
      value,
      src,
    }) {
      console.log('点击弹出', {
        type,
        value,
        src,
      });
    },
    time_btn(e, y) {
      console.log('选择事件', e);
      console.log('选择事件yy', y);
    },
    onSelected(ymd) {
      this.start_time = ymd;
    },
    onContext(ctx) {
      this.start_time = ctx.selectedYMD;
    },
    delete_model() {
      this.modalShow = false;
    },
    release_btn() {
      if (this.error_show || !this.canPublish) {
        return;
      }
      // 判断是否连接钱包
      if (!this.$store.state.connect.isConnected) {
        this.$store.commit('connect', { should: true });
        return;
      }
      this.modalShow = true;
    },

    async tapButton() {
      if (!this.$store.state.connect.isConnected) {
        this.$store.commit('connect', { should: true });
        return;
      }
      this.modalShow = false;
      const loading = this.$showModal({
        type: 'metamask',
        data: createData(),
      });
      loading.next();
      const choices = [];
      this.choices.forEach((item) => {
        if (item.trim().length > 0) {
          choices.push(item);
        }
      });
      loading.next();
      const images = this.imagesToUpload();
      const proposal = {
        timestamp: this.getData.timestamp, // 当前时间戳
        project: this.getData.strategies.code, // 项目标识 code
        type: 'proposal', // proposal 签名  vote 投票
        payload: {
          title: this.getData.title.replace(/^\s+|\s+$/g, ''), // 提案标题
          // 提案选项类型 Single Selection 单一   Multiple Selection  多选
          type: this.selectedOption.name,
          body: this.getData.body.replace(/^\s+|\s+$/g, ''),
          images,
          choices,
          startTime: Math.floor(new Date(this.start_time).getTime() / 1000),
          endTime: Math.floor(new Date(this.end_time).getTime() / 1000),
          threshold: this.ruleSelected === 1 ? this.getData.threshold : 0, // 是否投票限制 0为不限制
          tokenInfo: { // 策略
            token: this.getData.coin, // 代笔符号
            address: this.getData.strategies.address, // 代笔合约地址
          },
          rule: this.ruleSelected === 1 ? 'vote count' : 'address count',
        },
      };
      try {
        const text = JSON.stringify(proposal);
        const {
          msg,
          sig,
        } = await web3Manager.signData({ data: text });
        console.log('签名', msg);
        await createProposal({
          msg: text,
          sig,
          version: 0,
        })
          .then(() => {
            this.getData.title = '';
            this.getData.body = '';
            this.getData.threshold = '';
            this.start_time = '';
            this.end_time = '';
            this.checked = false;
            this.modalShow = false;
            loading.next();
            loading.hide();
            this.successToast(this.$t('proposal.create.success'));
            this.push('/proposal-list');
          });
      } catch (e) {
        // TODO: 不知道为啥要清空
        // this.getData.title = '';
        // this.getData.body = '';
        // this.choices = ['', ''];
        // this.getData.threshold = '';
        // this.start_time = '';
        // this.end_time = '';
        this.checked = false;
        this.modalShow = false;
        loading.next();
        loading.hide();
        this.errorToast(e.message);
      }
    },
    getMemberData() {
      this.isLoading = true;
      spaceDetail({ code: this.code })
        .then((res) => {
          this.projectInfo = res.response;
          this.isLoading = false;
          this.getData.strategies.name = res.response.name;
          this.getData.strategies.address = res.response.coinContract;
          this.getData.strategies.code = res.response.code;
          this.getData.isMember = res.response.isMember;
          this.getData.rule = res.response.rule;
          this.getData.decimals = res.response.decimals;
          this.getData.coin = res.response.coin;
          this.currentNet = res.response.network;
          // rule=1(持票数量),rule=2成员列表
          // 1 是否是持仓数量
          // 2 是否是成员
          // rule=1就跟htreshold判断(最小持币数比较)；
          // rule=2手跟isMember判断(是否是成员,ture/false);成员有权限
          web3Manager.updateFetchWeb3(res.response.networkVo);
          if (res.response.coinContract) {
            web3Manager.getBalance({
              address: localStorage.getItem('address'),
              contractAddress: res.response.coinContract,
              net: this.currentNet,
            })
              .then((aRes) => {
                this.balance = Web3.utils.fromWei(`${aRes}`);
                if (parseFloat(this.balance, 10) < res.response.threshold) {
                  this.error_show = true;
                } else if (res.response.memberOnly === 1 && res.response.isMember === true) {
                  this.error_show = false;
                }
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    minStarDate(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    minStarDate2(date) {
      const Time = new Date();
      const hh = Time.getHours();
      const
        mm = Time.getMinutes();
      return date < new Date(new Date().setHours(hh < 10 ? Number(`0${hh}`) : hh, mm < 10 ? Number(`0${mm}`) : mm, 0, 0));
    },
    minEndDate(date) {
      const today = new Date(this.start_time);
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    minEndDate2(date) {
      return date < this.defaultEndTime;
    },
  },
  mounted() {
    this.getMemberData();
    this.initSwiper();
  },
};
</script>
<style scoped lang="scss">
@import "../../../node_modules/bootstrap/scss/mixins";
@import "../../../node_modules/bootstrap/scss/functions";
@import "../../../node_modules/bootstrap/scss/variables";

::v-deep .title-cont {
  margin: 0 0 38px 0 !important;
  position: relative;
}

::v-deep .title-img {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
}

::v-deep .title {
  font-size: 6.4vw;
  @include FontM;
  font-weight: 500;
  color: #000000;
  @include media-breakpoint-up(md) {
    font-size: 24px;
  }
}

::v-deep .my-txt {
  font-size: 16px;
  @include FontR;
  font-weight: 400;
  color: #23262F;
  line-height: 24px;
  margin-bottom: 40px;
}

::v-deep .cancle-btn {
  height: 48px;
  border-radius: 90px;
  border: 2px solid #E6E8EC;
  font-size: 16px;
  @include FontR;
  font-weight: 400;
  color: #23262F;
  text-align: center;
  line-height: 49px;
  margin: 0 auto;
  cursor: pointer;
}

::v-deep .modal-header {
  border: none !important;
}

::v-deep .modal-body {
  padding: 32px 32px 40px 32px !important;
  border-radius: 20px;
}

::v-deep .modal-content {
  border-radius: 20px;
}

::v-deep .form-control {
  &::-webkit-input-placeholder {
    font-size: 14px !important;
    font-family: "Poppins-Medium";
    font-weight: 500 !important;
    // color: #23262F!important;
  }
}

::v-deep .el-icon-date:before {
  content: '' !important;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 16px !important;
}

::v-deep .el-input__inner {
  height: 48px !important;
  border-radius: 12px !important;
  width: 100%;

  &::-webkit-input-placeholder {
    font-size: 14px;
    @include FontM;
    font-weight: 500;
    color: #23262F;
  }
}

.rotate {
  transform: rotateZ(180deg) !important;
}

.error_wrap {
  width: 100%;
  padding: 0 8vw 0 8vw;
  margin: 44px auto;
  border-radius: 9px;
  @include media-breakpoint-up(md) {
    width: 100%;
    max-width: 1380px;
    padding: 0 30px 0 30px;
    margin: 44px auto;
  }

  .error-inner {
    background: #FFF3F3;
    border: 1px solid #F6A3A3;
    text-align: start;
    border-radius: 9px;
    padding: 3.2vw;
    @include media-breakpoint-up(md) {
      padding: 0 16px 0 18px;
    }
  }

  span {
    @include FontSB;
    font-weight: 600;
    color: #FE8B8B;
    text-align: start;
    font-size: 4.8vw;
    @include media-breakpoint-up(md) {
      font-size: 16px;
      line-height: 55px;
    }
  }
}

.initiateProposal {
  // display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  // padding-bottom:220px;
  #footer-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }

  input {
    outline: none;
  }

  .input-wrap {
    width: 100%;
  }

  .time_input {
    position: relative;
    @include FontM;
    font-size: 14px;
    font-weight: 500;
    color: #23262F;
    line-height: 24px;
    margin-bottom: 10px;

    ::v-deep .mx-input:disabled, .mx-input.disabled {
      border: 1px solid #F4F5F6 !important;
      background: #F4F5F6 !important;
    }

    .startDate {
      width: 100px;
    }

    ::v-deep .mx-datepicker svg {
      width: 0 !important;
    }

    ::v-deep .mx-datepicker {
      width: 100% !important;
    }

    ::v-deep .mx-input {
      font-size: 14px !important;
      font-family: "Poppins-Medium" !important;
      font-weight: 500 !important;
      color: #23262F !important;
      height: 48px !important;
      padding-top: 8px !important;
      outline: none;
      border: 1px rgba(0, 0, 0, 0.1) solid !important;
      border-radius: 12px !important;
      -webkit-box-shadow: none !important;

      &::-webkit-input-placeholder {
        font-size: 14px;
        @include FontM;
        font-weight: 500;
        color: #23262F;
      }
    }

    ::v-deep #date-picker-end__value_ {
      font-size: 14px !important;
      font-family: "Poppins-Medium" !important;
      font-weight: 500 !important;
      color: #23262F !important;
      height: 48px;
      padding-top: 14px;
      outline: none;
    }

    ::v-deep #date-picker-start__outer_ {
      border-radius: 12px;
    }

    ::v-deep #date-picker-start {
      padding: 0;
      width: 10px;
    }

    ::v-deep #date-picker-end__outer_ {
      border-radius: 12px;
    }

    ::v-deep #date-picker-end {
      padding: 0;
      width: 10px;
    }

    svg {
      width: 20px;
      position: absolute;
      height: 100%;
      right: 10px;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s linear;
      transform: rotateZ(0);
    }
  }

  .title {
    @include FontSB;
    font-weight: 600;
    color: #23262F;
    text-align: left;
    width: 100%;
    max-width: 1380px;
    margin: 0px auto;
    font-size: 6.4vw;
    padding: 8vw 8vw 0 8vw;
    @include media-breakpoint-up(md) {
      padding: 43px 30px 0 30px;
      font-size: 48px;
    }
  }

  .container-wrap {
    display: flex;
    margin: 40px auto;
    @include centered-view;
    flex-direction: column-reverse;
    justify-content: space-between;
    @include media-breakpoint-up(md) {
      flex-direction: row;
    }

    .input-content {
      .left-title {
        font-size: 4.8vw;
        @include FontSB;
        font-weight: 600;
        color: #23262F;
        margin-bottom: 6.4vw;
        @include media-breakpoint-up(md) {
          font-size: 16px;
          margin-bottom: 33px;
        }
      }

      .input-wrap {
        position: relative;
        margin-bottom: 32px;
        width: 100%;

        &::-webkit-input-placeholder {
          color: rgba(0, 0, 0, 0.3);
          font-size: 14px;
          @include FontM;
          font-weight: 500;
        }

        ::v-deep .option__title {
          font-size: 14px !important;
          font-family: "Poppins-Medium" !important;
          font-weight: 500 !important;
          color: #23262F !important;
        }

        textarea {
          outline: none;
          width: 100%;
          height: 120px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding-left: 16px;
          padding-top: 12px;
        }

        .title-name {
          span {
            font-size: 16px;
            @include FontM;
            font-weight: 500;
            color: #23262F;
          }
        }

        .switch-btn {
          position: absolute;
          top: 0;
          right: 0;
        }

        .name {
          font-size: 3.73vw;
          @include FontM;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.3);
          margin-bottom: 12px;
          @include media-breakpoint-up(md) {
            font-size: 14px;
          }
        }

        .data-input {
          font-size: 3.733vw;
          font-weight: 500;
          font-stretch: normal;
          font-style: normal;
          line-height: 1.71;
          letter-spacing: normal;
          color: #000;
          @include media-breakpoint-up(md) {
            font-size: 14px;
          }
        }

        .b-txt {
          margin-top: 10px;
          margin-bottom: 0 !important;
        }

        input {
          width: 100%;
          height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding-left: 16px;
        }

        .input-wrap-choice {
          position: relative;

          img {
            cursor: pointer;
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0, -50%);
            margin-right: 8px;
          }

          div {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translate(0, -50%);
            margin-right: 8px;
            font-size: 14px;
            @include FontSB;
            font-weight: 600;
            color: #23262F;
          }
        }

        .input-wrap-choice-div {
          & > input::-webkit-input-placeholder {
            font-size: 14px;
            @include FontM;
            font-weight: 500;
            color: #777E91;
          }
        }
      }

      .a-btn {
        min-width: 170px;
        max-width: 200px;
        border-radius: 90px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        line-height: 6.4vw;
        font-size: 4.26vw;
        @include FontSB;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.6);
        @include media-breakpoint-up(md) {
          border-radius: 90px;
          line-height: 34px;
          font-size: 16px;
        }

        img {
          margin-left: 11px;
        }
      }
    }

    .left-cont {
      text-align: left;
      width: 100%;
      margin-right: 0;
      @include media-breakpoint-up(md) {
        max-width: 50%;
      }
    }

    .middle-cont {
      text-align: left;
      width: 100%;
      margin-right: 0;
      margin-top: 10.67vw;
      @include media-breakpoint-up(md) {
        width: 100%;
        margin-top: 0;
      }
    }

    .right-cont {
      .btn_prohibit {
        background: #F4F5F6 !important;
        color: rgba(0, 0, 0, 0.2) !important;
      }
    }
  }
}

.form-page-1 {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  margin-right: 0;
  margin-top: 5.33vw;
  @include media-breakpoint-up(md) {
    margin-top: 20px;
  }

  .next-button {
    width: 170px;
    color: white !important;
    margin-top: 5.33vw;
    @include media-breakpoint-up(md) {
      margin-top: 20px;
    }
  }
}

.form-page-2 {
}

.publish-btn {
  height: 48px;
  background: #3772FF !important;
  border-radius: 90px;
  font-size: 16px;
  @include FontR;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 49px;
  text-align: center;
  margin: 8px auto;
  cursor: pointer;
}

.release-button {
  color: white !important;
  width: 170px;
  margin-bottom: 20px;
}

.select-buttons {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 5.33vw;
  grid-gap: 3.73vw;
  @include media-breakpoint-up(md) {
    margin-top: 20px;
    grid-gap: 14px;
  }

  .select-buttons {
    width: 45%;
  }
}
.description-input {
  min-height: 300px;
  z-index: 0;
}
.pic-input-content {
  width: 100%;
  display: flex;
  grid-gap: 10px;
  flex-wrap: wrap;
  .pic-button {
    width: 100px;
    height: 100px;
    position: relative;
    flex-shrink: 0;
    &.add:hover {
      cursor: pointer;
      opacity: 0.8;
    }
    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      &:hover {
        opacity: 0.8;
      }
    }
    .icon {
      width: 100%;
      height: 100%;
      opacity: 0.8;
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      line-height: 100px;
      font-size: 54px;
      font-weight: 400;
      display: flex;
      justify-content: center;
      color: rgba(0, 0, 0, 0.2);
    }
    .delete-button {
      padding: 10px 10px 10px 10px;
      background: transparent;
      position: absolute;
      outline: none;
      border: none;
      box-shadow: none;
      top: -15px;
      right: -15px;
      .delete-icon {
        color: rgba(0, 0, 0, 0.6);
        width: 25px;
        height: 25px;
        background: white;
        border-radius: 20px;
        &:hover {
          color: var(--danger);
        }
      }
    }
  }
}

</style>
