<template>
  <div id="create-project__container">
    <div id="create-project__content">
      <div class="content-left">
        <h1 id="title">{{ $t('project.create.create') }}</h1>
        <div class="swiper create-project-swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <div id="left-content" class="info-col">
                <div id="logo-input">
                  <div id="img-outer">
                    <b-img id="logo" :src="logoRemote || logo"></b-img>
                  </div>
                  <div id="logo-text"
                       class="d-flex flex-column align-items-start justify-content-between">
                    <div class="d-flex flex-column align-items-start">
                      <span class="subtitle-text">
                        {{ $t('project.create.logo') }}
                      </span>
                      <span class="detail-text">
                      {{ $t('project.create.upload') }}
                      </span>
                    </div>
                    <div>
                      <label class="upload-button d-flex align-items-center"
                             :class="{'disabled' : logoUploading}" for="logoInput">
                        {{ $t('project.create.chooseF') }}
                        <b-spinner v-if="logoUploading" small class="ml-2"></b-spinner>
                      </label>
                      <input id="logoInput"
                             :disabled="logoUploading"
                             accept=".jpg, .jpeg, .png, .gif"
                             type="file" style="width: 0.1px; opacity: 0.01; "
                             @change="inputChange"/>
                    </div>
                  </div>
                </div>
                <span class="subtitle-text" id="banner-title">{{ $t('project.create.banner') }}
                </span>
                <span class="detail-text">{{ $t('project.create.imgType') }}</span>
                <div id="banner-outer">
                  <b-img :src="bannerRemote || banner" id="banner-img">
                  </b-img>
                </div>
                <div>
                  <label class="upload-button" for="bannerInput"
                         :class="{'disabled': bannerUploading}">
                    {{ $t('project.create.chooseF') }}
                    <b-spinner v-if="bannerUploading" small class="ml-2"></b-spinner>
                  </label>
                  <input id="bannerInput"
                         accept=".jpg, .jpeg, .png, .gif"
                         :disabled="bannerUploading"
                         type="file" style="width: 0.1px; opacity: 0.01; "
                         @change="bannerChange"/>
                </div>
                <span class="subtitle-text top-8">
                  {{ $t('project.create.social') }}
                </span>
                <span class="input-title">
                  {{ $t('project.create.twitter') }}
                </span>
                <b-input class="input-blank" :placeholder="$t('user.edit.ttP')" v-model="twitter">
                </b-input>
                <span class="input-title">
                  {{ $t('project.create.ins') }}
                </span>
                <b-input class="input-blank" :placeholder="$t('user.edit.insP')" v-model="ins">
                </b-input>
                <span class="input-title">
                  {{ $t('project.create.facebook') }}
                </span>
                <b-input
                  class="input-blank" :placeholder="$t('user.edit.fbP')" v-model="facebook">
                </b-input>
              </div>
              <b-button variant="primary" @click="tapNext" class="next-button top-8">
                {{ $t('v11.next') }}
              </b-button>
            </div>
            <div class="swiper-slide">
              <div id="right-content" class="info-col">
                <span id="account-title" class="subtitle-text">
                  {{ $t('project.create.accountI') }}
                </span>
                <span class="input-title">
                  {{ $t('project.create.mainnet') }}
                </span>
                <MarketDropdown
                  class="dropdown"
                  :options="networks"
                  v-model="selectedNet"
                  @input="networkChange">
                </MarketDropdown>
                <span class="input-title">
                  {{ $t('project.create.projectN') }}
                </span>
                <b-input
                  :state="nameState"
                  class="input-blank" :placeholder="$t('project.create.nameD')" v-model="name">
                </b-input>
                <span class="input-title">
                  {{ $t('project.create.home') }}
                </span>
                <b-input
                  :state="homepageState"
                  class="input-blank" :placeholder="$t('project.create.homeD')"
                  v-model="homepage">
                </b-input>
                <span class="input-title">
                  {{ $t('project.create.desc') }}
                </span>
                <b-textarea
                  :state="descriptionState"
                  class="input-blank space-input" :placeholder="$t('project.create.descD')"
                  v-model="description"
                >
                </b-textarea>
                <span class="d-flex align-items-center justify-content-between
                contract-input-title"
                >
                  <span>
                  {{ $t('project.create.contract') }}
                  <IconHelp
                    class="iconHelp"
                    id="contractAddressHelp"
                  ></IconHelp>
                    <b-popover target="contractAddressHelp" triggers="hover focus"
                               placement="bottom">
                      <span class="contract-desc">
                        {{$t('v11.contractAddressTip')}}
                      </span>
                    </b-popover>
                </span>
                <span @click="tapReloadContract">
                  <IconReload class="icon-reload"></IconReload>
                </span>
                </span>
                <b-input
                  :state="contractAddressState"
                  class="input-blank" :placeholder="$t('project.create.contractD')"
                  v-model="contractAddress"
                  @input="contractAddressInput"
                >
                </b-input>
                <span class="token-type-text"
                      v-if="tokenType.length > 0
                       && coinSymbol.length > 0
                        && !isLoadingSymbol">{{tokenType}}</span>
                <span class="contract-error" v-if="symbolErrorMessage.length > 0">
                  {{symbolErrorMessage}}
                </span>
                <span class="input-title" v-if="coinSymbol.length > 0 && !isLoadingSymbol">
                  {{ $t('v11.voteName') }}
                  <IconHelp
                    class="iconHelp"
                    id="voteNameHelp"
                  ></IconHelp>
                  <b-popover target="voteNameHelp"
                             triggers="hover focus"
                             placement="bottom">
                    <span class="contract-desc">
                        {{ $t('v11.voteNameTip') }}
                    </span>
                  </b-popover>
                </span>
                <b-input
                  v-if="coinSymbol.length > 0 && !isLoadingSymbol"
                  :state="voteNameState"
                  class="input-blank" :placeholder=" $t('v11.enterYourVoteName')"
                  v-model="voteName"
                >
                </b-input>
                <span class="w-100 py-5 d-flex align-items-center justify-content-center"
                      v-if="isLoadingSymbol"
                >
                  <b-spinner v-if="isLoadingSymbol"></b-spinner>
                </span>
                <span class="input-title ratio-input-title"
                      v-if="coinSymbol.length > 0 && !isLoadingSymbol"
                      :class="{show: coinSymbol.length > 0}">
                  {{ $t('v11.mappingRatio') }}
                  <IconHelp
                      class="iconHelp"
                      id="voteRatioHelp"
                    ></IconHelp>
                  <b-popover target="voteRatioHelp"
                             triggers="hover focus"
                             placement="bottom">
                    <span class="contract-desc">
                        {{ $t('v11.voteRatioTip') }}
                    </span>
                  </b-popover>
                </span>
                <div class="ratio-input__outer" v-if="!isLoadingSymbol">
                  <div class="ratio-input__content"
                       v-if="coinSymbol.length > 0"
                       :class="{show: coinSymbol.length > 0}">
                    <div
                      class="left-content
                     d-flex flex-column align-items-center justify-content-between"
                      :class="{'flex-column-reverse': ratioIsReverse}"
                    >
                      <span class="ratio-coin">{{coinSymbol}}</span>
                      <span class="ratio-change-button" @click="tapChange" style="cursor: pointer;">
                      <IconChange class="change-icon"></IconChange>
                    </span>
                      <span class="ratio-coin">{{ voteName + ' ' + $t('v11.votes') }}</span>
                    </div>
                    <div class="preset-ratio-item"
                         :class="{selected: ratioSelected === index}"
                         v-for="(item, index) in presetRatios" :key="index"
                         @click="tapRatioItem(index)"
                    >
                      <span>{{item.top}}</span>
                      <span>:</span>
                      <span>{{item.bottom}}</span>
                    </div>
                    <div class="ratio-input-item" @click="tapRatioInput"
                         :class="{selected: ratioSelected === -1}">
                      <span>1</span>
                      <span>:</span>
                      <span>{{ratioShowValue}}</span>
                      <b-form-input type="range" min="0" max="10" v-model="ratioSlideValue"
                                    step="1">
                      </b-form-input>
                    </div>
                  </div>
                </div>

                <b-button variant="primary" @click="tapNext" class="next-button top-8">
                  {{ $t('v11.next') }}
                </b-button>
              </div>
            </div>
            <div class="swiper-slide">
              <div class="info-col">
                <edit-project-rule v-model="ruleInfo" @input="ruleInfoChange"></edit-project-rule>
                <b-button
                  @click="tapSubmitButton"
                  id="submit-button"
                  variant="primary"
                  :disabled="!canSubmit"
                  class="create-button"
                  pill>{{
                    $t('project.create.createP')
                  }}
                </b-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right">
        <a-p-stepper class="steps-components"
                     @change="changeStep"
                     :steps="steps"
                     :current-step="currentPage"></a-p-stepper>
      </div>
    </div>
    <HomeFooter></HomeFooter>
  </div>
</template>

<script>
import HomeFooter from '@/views/space-home/home-footer.vue';
import LogoBlank from '@/assets/img/logo-blank.png';
import MarketDropdown from '@/components/market-dropdown/index.vue';
import { uploadFile } from '@/common/api/user-repository';
import ToastMixin from '@/mixins/toast-mixin';
import Web3 from 'web3';
import { createProjectData } from '@/components/modal-container/modal-data';
import { createProject } from '@/common/api/space-repository';
import web3Manager from '@/common/web3/web3';
import APStepper from '@/components/stepper/index.vue';
import IconChange from '@/components/icons/IconChange.vue';
import IconHelp from '@/components/icons/IconHelp.vue';
import EditProjectRule from '@/views/project/edit-project-rule.vue';
import IconReload from '@/components/icons/IconReload.vue';

export default {
  name: 'create-project',
  components: {
    IconReload,
    EditProjectRule,
    IconHelp,
    IconChange,
    APStepper,
    MarketDropdown,
    HomeFooter,
  },
  mixins: [ToastMixin],
  data() {
    return {
      logo: LogoBlank,
      banner: LogoBlank,
      logoRemote: null,
      bannerRemote: null,
      logoUploading: false,
      bannerUploading: false,
      // 表单项目
      name: '',
      homepage: '',
      description: '',
      selectType: 'Ethereum',
      contractAddress: '',
      twitter: '',
      ins: '',
      facebook: '',
      steps: [
        this.$t('v11.projectInfo'),
        this.$t('v11.tokenInfo'),
        this.$t('v11.rule'),
      ],
      swiper: null,
      currentPage: 0,
      coinSymbol: '',
      ratioIsReverse: false,
      presetRatios: [
        { top: 1, bottom: 1 },
        { top: 1, bottom: 10 },
        { top: 1, bottom: 100 },
      ],
      ratioSelected: 0,
      ratioSlideValue: 0,
      isLoadingSymbol: false,
      voteName: '',
      ruleInfo: {
        ruleMemberSelected: true,
        members: [],
        threshold: '',
        ruleThresholdSelected: false,
      },
      symbolErrorMessage: '',
      tokenType: '',
      selectedNet: null,
    };
  },
  computed: {
    networks() {
      return this.$store.state.allNets;
    },
    ratioShowValue() {
      // eslint-disable-next-line no-restricted-properties
      return Math.pow(10, this.ratioSlideValue);
    },
    nameState() {
      return (this.name !== null && this.name.trim().length > 0);
    },
    homepageState() {
      return (this.homepage !== null && this.homepage.trim().length > 0);
    },
    descriptionState() {
      return (this.description !== null && this.description.trim().length > 0);
    },
    contractAddressState() {
      return (this.contractAddress !== null && Web3.utils.isAddress(this.contractAddress)
        && this.coinSymbol.length > 0);
    },
    voteNameState() {
      return this.voteName !== null && this.voteName.trim().length > 0;
    },
    canSubmit() {
      return this.nameState
        && this.homepageState
        && this.descriptionState
        && this.contractAddressState
        && this.voteNameState
        && this.logoRemote !== null && this.logoRemote.length > 0
        && this.bannerRemote !== null && this.bannerRemote.length > 0;
    },
    reader() {
      return new FileReader();
    },
    tokenRatios() {
      if (this.ratioSelected !== -1) {
        return this.ratioIsReverse ? {
          tokenRatio: this.presetRatios[this.ratioSelected].bottom,
          voteTokenRatio: this.presetRatios[this.ratioSelected].top,
        } : {
          tokenRatio: this.presetRatios[this.ratioSelected].top,
          voteTokenRatio: this.presetRatios[this.ratioSelected].bottom,
        };
      }
      const number = parseInt(this.ratioShowValue, 10);
      return this.ratioIsReverse ? {
        tokenRatio: number,
        voteTokenRatio: 1,
      } : {
        tokenRatio: 1,
        voteTokenRatio: number,
      };
    },
  },
  methods: {
    tapReloadContract() {
      if (this.contractAddress && Web3.utils.isAddress(this.contractAddress)) {
        this.symbolErrorMessage = '';
        this.contractAddressInput();
      } else {
        this.symbolErrorMessage = this.$t('v12.wrong_contract');
      }
    },
    ruleInfoChange() {
      this.$nextTick(() => {
        this.swiper.updateSize();
        this.swiper.updateAutoHeight();
      });
    },
    async contractAddressInput() {
      if (!(Web3.utils.isAddress(this.contractAddress))) {
        this.coinSymbol = '';
        this.symbolErrorMessage = this.$t('v12.wrong_contract');
        this.$nextTick(() => {
          this.swiper.updateAutoHeight(100);
          this.swiper.updateSize();
        });
        return;
      }
      this.isLoadingSymbol = true;
      try {
        const res = await web3Manager.fetchTokenType(this.contractAddress, this.selectType);
        if (res > 0) {
          this.tokenType = 'ERC20';
        } else {
          this.tokenType = 'ERC721';
        }
      } catch (e) {
        this.tokenType = 'ERC721';
      }
      try {
        this.coinSymbol = await web3Manager.getSymbol(this.contractAddress, this.selectType);
        this.$nextTick(() => {
          this.swiper.updateAutoHeight(100);
          this.swiper.updateSize();
          this.isLoadingSymbol = false;
        });
        this.symbolErrorMessage = '';
      } catch (e) {
        this.coinSymbol = '';
        this.symbolErrorMessage = this.$t('v12.wrong_contract');
        this.$nextTick(() => {
          this.swiper.updateAutoHeight(100);
          this.swiper.updateSize();
          this.isLoadingSymbol = false;
        });
      }
    },
    tapRatioItem(index) {
      this.ratioSelected = index;
    },
    tapRatioInput() {
      this.ratioSelected = -1;
    },
    /// 转换票数比例方向
    tapChange() {
      this.ratioIsReverse = !this.ratioIsReverse;
    },
    tapNext() {
      if (this.currentPage === 0) {
        if (!(this.logoRemote !== null && this.logoRemote.length > 0)) {
          this.errorToast(this.$t('v12.logo_error'));
          return;
        }
        if (!(this.bannerRemote !== null && this.bannerRemote.length > 0)) {
          this.errorToast(this.$t('v12.banner_error'));
          return;
        }
      } else if (this.currentPage === 1) {
        if (!this.nameState) {
          this.errorToast(this.$t('v12.name_error'));
          return;
        }
        if (!this.homepageState) {
          this.errorToast(this.$t('v12.homepage_error'));
          return;
        }
        if (!this.descriptionState) {
          this.errorToast(this.$t('v12.desc_error'));
          return;
        }
        if (!this.contractAddressState) {
          this.errorToast(this.$t('v12.contract_error'));
          return;
        }
        if (!this.voteNameState) {
          this.errorToast(this.$t('v12.vote_name_error'));
          return;
        }
      }
      this.currentPage += 1;
      this.swiper.slideTo(this.currentPage);
    },
    changeStep(index) {
      this.swiper.slideTo(index);
      this.currentPage = index;
    },
    initSwiper() {
      this.swiper = new window.Swiper('.create-project-swiper', {
        autoHeight: true,
        spaceBetween: 20,
        onlyExternal: true,
        noSwiping: true,
        calculateHeight: true,
        noSwipingClass: 'swiper-slide',
      });
    },
    async inputChange(event) {
      // 上传 logo
      this.logoUploading = true;
      try {
        const res = await uploadFile({ file: event.target.files[0] });
        this.logoUploading = false;
        this.logoRemote = res.response;
      } catch (e) {
        this.errorToast(e.message);
        this.logoUploading = false;
      }
    },
    async bannerChange(event) {
      this.bannerUploading = true;
      try {
        const res = await uploadFile({ file: event.target.files[0] });
        this.bannerUploading = false;
        this.bannerRemote = res.response;
      } catch (e) {
        this.errorToast(e.message);
        this.bannerUploading = false;
      }
    },
    networkChange(type) {
      this.selectType = type.name;
      // web3Manager 更新
      web3Manager.updateFetchWeb3(type);
      this.contractAddressInput();
    },
    async tapSubmitButton() {
      if (!this.$store.state.connect.isConnected) {
        this.errorToast(this.$t('connect.warning'));
        this.$store.commit('connect', { value: true });
        return;
      }
      if (this.ruleThresholdSelected && parseInt(this.threshold, 10) <= 0) {
        this.errorToast('Please input valid threshold number');
        return;
      }
      const members = [];
      // 这里成员不需要上传到后台,只需要添加到 json 中传给后台
      this.ruleInfo.members.forEach((address) => {
        if (address.length > 0) {
          members.push(address);
        }
      });
      const loading = this.$showModal({
        type: 'metamask',
        data: createProjectData(),
      });
      loading.next();
      const data = {
        about: '',
        banner: this.bannerRemote,
        coinContract: this.contractAddress,
        description: this.description,
        facebook: this.facebook,
        icon: this.logoRemote,
        ins: this.ins,
        name: this.name,
        network: this.selectType,
        memberOnly: this.ruleInfo.ruleMemberSelected ? 1 : 0,
        threshold: this.ruleInfo.ruleThresholdSelected ? this.ruleInfo.threshold : 0,
        twitter: this.twitter,
        webUrl: this.homepage,
        voteToken: this.voteName,
        ...this.tokenRatios,
        members,
      };
      const text = JSON.stringify(data);
      try {
        const {
          msg,
          sig,
        } = await web3Manager.signData({ data: text });
        loading.next();
        await createProject({
          address: this.$store.state.connect.address,
          msg,
          sig,
        });
        loading.next();
        loading.hide();
        this.successToast(this.$t('project.create.successC'));
        setTimeout(() => {
          this.push('/');
        }, 2000);
      } catch (e) {
        loading.hide();
        this.errorToast(e.message);
      }
      loading.next();
    },
  },
  mounted() {
    this.initSwiper();
  },
};
</script>

<style scoped lang="scss">

#create-project__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  #create-project__content {
    @include centered-view;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-start;
    @include media-breakpoint-up(md) {
      flex-direction: row;
      justify-content: space-between;
    }

    #title {
      @include FontM;
      font-weight: 500;
      color: #000000;
      font-size: 6.4vw;
      line-height: 1.46;
      margin: 12.26vw 0 0 0;
      @include media-breakpoint-up(md) {
        font-size: 48px;
        line-height: 56px;
        margin: 48px 0 0 0;
      }
    }

    .info-col {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: flex-start;
      width: 100%;
      padding: 3px;
      @include media-breakpoint-up(md) {
      }
    }

    #left-content {
      #logo-input {
        display: flex;
        align-items: stretch;
        margin-top: 8.533vw;
        @include media-breakpoint-up(md) {
          margin-top: 0;
        }
        #logo-text {
          margin: 0 0 0 2.67vw;
          @include media-breakpoint-up(md) {
            margin: 0 0 0 32px;
          }
        }

        #img-outer {
          border: 1px solid #0000002d;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 26.67vw;
          width: 26.67vw;
          height: 26.67vw;
          flex-shrink: 0;
          @include media-breakpoint-up(md) {
            border-radius: 128px;
            width: 128px;
            height: 128px;
          }
        }

        #logo {
          object-fit: cover;
          max-width: 100%;
          max-height: 100%;
        }
      }

      #banner-title {
        margin: 15vw 0 0 0;
        @include media-breakpoint-up(md) {
          margin: 48px 0 0 0;
        }
      }

      #banner-outer {
        width: 100%;
        border-radius: 3.2vw;
        border: 1px solid #0000001f;
        height: 48vw;
        margin: 4.267vw 0 0 0;
        background-color: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        @include media-breakpoint-up(md) {
          height: 125px;
          margin: 20px 0 0 0;
          border-radius: 12px;
        }

        #banner-img {
          object-fit: cover;
          max-width: 100%;
          max-height: 100%;
        }
      }

      #banner-button {
        margin: 5.067vw 0 0 0;
        max-width: 150px;
        font-size: 3.73vw;
        @include FontB;
        color: black;
        @include media-breakpoint-up(md) {
          margin: 32px 0 0 0;
          max-width: 150px;
          font-size: 14px;
        }
      }

      #account-title {
        margin: 24.8vw 0 0 0;
        font-size: 4.267vw;
        @include FontSB;
        font-weight: 600;
        color: #23262F;
        line-height: 6.4vw;
        @include media-breakpoint-up(md) {
          line-height: 24px;
          margin: 80px 0 0 0;
          font-size: 16px;
        }
      }
    }

    #right-content {
      //margin-left: 0;
      margin-top: 11.46vw;
      @include media-breakpoint-up(md) {
        //margin-left: 40px;
        margin-top: 0;
      }

      #submit-button {
        margin: 7.73vw 0 0 0;
        max-width: 170px;
        font-size: 3.73vw;
        color: #FCFCFD;
        @include FontM;
        padding: 2.67vw 5vw;

        &:disabled {
          cursor: not-allowed;
        }

        @include media-breakpoint-up(md) {
          margin: 80px 0 0 0;
          max-width: 170px;
          font-size: 16px;
          padding: 6px 18px;
        }
      }
    }
  }
}

.dropdown {
  margin: 12px 0 0 0;
}

.buttons {
  margin: 2.13vw 0 0 0;
  @include FontM;
  font-size: 3.2vw;
  font-weight: 500;
  line-height: 4.267vw;

  :nth-child(2) {
    margin: 0 0 0 6.1vw;
  }

  @include media-breakpoint-up(md) {
    margin: 12px 0 0 0;
    font-size: 14px;
    line-height: 24px;
    :nth-child(2) {
      margin: 0 0 0 30px;
    }
  }

  button {
    font-size: 3.2vw;
    @include media-breakpoint-up(md) {
      font-size: 12px;
    }
  }
}

.subtitle-text {
  @include FontSB;
  font-size: 4.27vw;
  font-weight: 600;
  color: #000000;
  line-height: 6.4vw;
  @include media-breakpoint-up(md) {
    line-height: 24px;
    font-size: 16px;
  }
}

.top-8 {
  margin-top: 80px;
}

.detail-text {
  @include FontR;
  font-size: 2.93vw;
  font-weight: 400;
  color: #000000;
  opacity: 0.3;
  margin: 0.267vw 0 0 0;
  @include media-breakpoint-up(md) {
    margin: 10px 0 0 0;
    font-size: 12px;
  }
}

.input-title {
  @include FontB;
  font-weight: bold;
  color: #0000004D;
  margin: 7.73vw 0 0 0;
  font-size: 3.2vw;
  line-height: 3.2vw;
  @include media-breakpoint-up(md) {
    line-height: 12px;
    font-size: 12px;
    margin: 32px 0 0 0;
  }
}

.contract-input-title {
  @include FontB;
  font-weight: bold;
  color: #0000004D;
  margin: 7.73vw 0 0 0;
  font-size: 3.2vw;
  line-height: 3.2vw;
  @include media-breakpoint-up(md) {
    line-height: 12px;
    font-size: 12px;
    margin: 32px 0 0 0;
  }
}

.input-blank {
  @include FontM;
  margin: 3.2vw 0 0 0;
  font-size: 3.73vw;
  font-weight: bold;
  color: #000000;
  line-height: 3.2vw;
  border-radius: 3.2vw;
  height: 12.8vw;
  &::-webkit-input-placeholder {
    color: #0000004d;
  }
  @include media-breakpoint-up(md) {
    margin: 12px 0 0 0;
    font-size: 12px;
    line-height: 12px;
    height: 48px;
    border-radius: 12px;
  }
}

.upload-button {
  margin: 5.33vw 0 0 0;
  max-width: 150px;
  font-size: 3.2vw;
  @include FontB;
  color: black;
  border-radius: 8vw;
  padding: 1.87vw 3.2vw;
  border: 1px solid #0000002d;
  cursor: pointer;
  @include media-breakpoint-up(md) {
    border-radius: 40px;
    padding: 10px 18px;
    margin: 32px 0 0 0;
    max-width: 150px;
    font-size: 14px;
  }

  &.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.space-input {
  min-height: 100px;
}

.steps-components {
  top: 21.33vw;
  margin-top: 10.33vw;
  position: static;
  @include media-breakpoint-up(md) {
    position: sticky;
    top: 128px;
    margin-top: 48px;
  }
}
.content-left {
  @include media-breakpoint-up(md) {
    max-width: 50%;
  }
}
.create-project-swiper {
  margin-top: 10.667vw;
  @include media-breakpoint-up(md) {
    margin-top: 80px;
  }
}

.next-button {
  border-radius: 200px;
  min-width: 150px;
  max-width: 170px;
  @include media-breakpoint-up(md) {
    border-radius: 200px;
    min-width: 150px;
    max-width: 170px;
  }
}

.ratio-input-title {
  opacity: 0;
  &.show {
    opacity: 1;
  }
}

.ratio-input__outer {
  width: 100%;
  overflow-x: auto;
}

.ratio-input__content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  opacity: 0;
  &.show {
    opacity: 1;
  }
  & > div {
    flex-shrink: 0;
  }
  margin-top: 5.33vw;
  grid-gap: 5.33vw;
  padding-bottom: 4vw;
  @include media-breakpoint-up(md) {
    grid-gap: 20px;
    margin-top: 20px;
  }
  .left-content {
    .ratio-change-button {
      padding: 7.2vw 0;
      @include media-breakpoint-up(md) {
        padding: 27px 0;
      }
    }
    .ratio-coin {
      color: #0000004d;
      @include FontM;
      font-size: 3.2vw;
      @include media-breakpoint-up(md) {
        font-size: 12px;
      }
    }
  }
  .preset-ratio-item, .ratio-input-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border: solid 2px #0004;
    color: #23262f4d;
    cursor: pointer;
    width: 13.33vw;
    height: 37.33vw;
    font-size: 3.73vw;
    padding: 2.67vw 4.5vw;
    border-radius: 1.6vw;
    @include media-breakpoint-up(md) {
      height: 140px;
      width: 50px;
      padding: 9px 20px;
      border-radius: 6px;
      @include FontM;
      font-size: 14px;
      font-weight: 500;
      line-height: 1.71;
    }
    &.selected {
      border: solid 2px #3772ff;
      color: #23262f;
    }
  }
  .ratio-input-item {
    flex-grow: 1;
    width: unset;
  }
}

.iconHelp {
  margin-left: 3.2vw;
  @include media-breakpoint-up(md) {
    margin-left: 10px;
  }
}

::v-deep .popover-body {
  background: #f4f5f6;
  opacity: 0.6;
  @include FontM;
  font-size: 14px;
  color: #000;
}

.rule-title {
  display: flex;
  justify-content: space-between;
}

.action-button {
  max-width: 170px;
}
.create-button {
  margin-top: 5.33vw;
  max-width: 170px;
  @include media-breakpoint-up(md) {
    max-width: 170px;
    margin-top: 20px;
  }
}

.icon-reload {
  width: 20px;
  height: 20px;
}

.contract-error {
  font-size: 12px;
  @include FontR;
  color: red;
  margin: 10px 0 0 0;
}

.token-type-text {
  font-size: 16px;
  @include FontB;
  color: #0000007b;
  margin: 10px 0 0 0;
  width: 100%;
  text-align: end;
}

</style>
