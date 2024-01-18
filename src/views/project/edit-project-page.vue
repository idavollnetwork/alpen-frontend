<template>
  <div id="edit-project__container">
    <div id="edit-project__content">
      <span id="title-text">{{$t('project.editP.title')}}</span>
      <div id="edit-project__inner">
        <div id="left-content">
          <div class="swiper edit-swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="form-page">
<!--                  头像/banner 输入-->
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
<!--                  <span id="project-info-title" class="project-info-title">-->
<!--                    {{$t('project.editP.projI')}}</span>-->
                  <span id="project-name-title" class="info-title">
                    {{$t('project.editP.projN')}}
                  </span>
                  <b-form-input
                    id="project-name-input"
                    v-model="projectInfo.name"
                    class="info-input"
                    disabled
                  >
                  </b-form-input>
                  <span id="project-website-title" class="info-title">
                  {{$t('project.editP.website')}}
                  </span>
                  <b-form-input
                    class="info-input"
                    id="project-website-input"
                    disabled
                    v-model="projectInfo.webUrl"></b-form-input>
                  <span id="bio-title" class="info-title">{{$t('project.editP.bio')}}</span>
                  <b-form-textarea
                    class="info-input"
                    id="project-bio-input"
                    v-model="editInfo.description"
                  ></b-form-textarea>
                  <edit-project-rule v-model="ruleInfo" @input="ruleInfoChange" class="w-100 mt-5">
                  </edit-project-rule>
                  <b-button variant="primary" class="next-button" pill
                            @click="tapNext"
                  >
                    {{ $t('v11.next1') }}
                  </b-button>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="form-page">
                  <span class="project-info-title">{{ $t('user.edit.social') }}</span>
                  <span class="info-title" id="twitter-title">{{$t('project.editP.twitter')}}</span>
                  <b-form-input
                    id="threshold-input"
                    class="info-input" v-model="editInfo.twitter"></b-form-input>
                  <span class="info-title" id="ins-title">{{$t('project.editP.ins')}}</span>
                  <b-form-input
                    class="info-input"
                    id="threshold-input" v-model="editInfo.ins"></b-form-input>
                  <span class="info-title" id="fb-title">{{$t('project.editP.facebook')}}</span>
                  <b-form-input
                    class="info-input"
                    id="threshold-input" v-model="editInfo.facebook"></b-form-input>
                  <div class="bottom-button">
                    <b-overlay
                      :show="updating"
                      opacity="0.6"
                      spinner-small
                    >
                      <b-button
                        id="update-button"
                        pill
                        variant="primary"
                        :disabled="updating"
                        @click="tapUpdateButton"
                      >{{$t('project.editP.updateP')}}</b-button>
                    </b-overlay>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="right-content">
          <a-p-stepper :steps="steps"
                       class="stepper"
                       :current-step="currentStep" @change="stepChange">
          </a-p-stepper>
        </div>
      </div>
    </div>
    <HomeFooter></HomeFooter>
  </div>
</template>

<script>
import Vue from 'vue';
import { spaceDetail, updateProjectInfo } from '@/common/api/space-repository';
import ToastMixin from '@/mixins/toast-mixin';
import HomeFooter from '@/views/space-home/home-footer.vue';
import APStepper from '@/components/stepper/index.vue';
import EditProjectRule from '@/views/project/edit-project-rule.vue';
import LogoBlank from '@/assets/img/logo-blank.png';
import { uploadFile } from '@/common/api/user-repository';

export default {
  name: 'edit-project-page',
  components: { EditProjectRule, APStepper, HomeFooter },
  props: {
    code: {
      type: String,
      default() {
        return '';
      },
    },
  },
  mixins: [ToastMixin],
  mounted() {
    this.loadData();
    this.initSwiper();
  },
  data() {
    return {
      logo: LogoBlank,
      banner: LogoBlank,
      logoRemote: null,
      bannerRemote: null,
      logoUploading: false,
      bannerUploading: false,
      projectInfo: {},
      editInfo: {},
      updating: false,
      currentStep: 0,
      swiper: null,
      ruleInfo: {
        ruleMemberSelected: true,
        members: [],
        threshold: '',
        ruleThresholdSelected: false,
      },
    };
  },
  computed: {
    steps() {
      return [
        'Project Info', 'Social',
      ];
    },
  },
  methods: {
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
    ruleInfoChange(value) {
      this.ruleInfo = value;
      this.$nextTick(() => {
        this.swiper.updateSize();
        this.swiper.updateAutoHeight();
      });
    },
    stepChange(step) {
      this.swiper.slideTo(step);
      this.currentStep = step;
    },
    tapNext() {
      this.currentStep += 1;
      this.swiper.slideTo(this.currentStep);
    },
    initSwiper() {
      this.swiper = new window.Swiper('.edit-swiper', {
        autoHeight: true,
        spaceBetween: 20,
        onlyExternal: true,
        noSwiping: true,
        calculateHeight: true,
        noSwipingClass: 'swiper-slide',
      });
    },
    tapRule(index) {
      this.editInfo.rule = index;
    },
    async loadData() {
      const res = await spaceDetail({ code: this.code });
      this.projectInfo = res.response;
      Object.keys(this.projectInfo).forEach((key) => {
        Vue.set(this.editInfo, key, this.projectInfo[key]);
      });
      Vue.set(this.ruleInfo, 'ruleMemberSelected', this.editInfo.memberOnly === 1);
      Vue.set(this.ruleInfo, 'ruleThresholdSelected', parseInt(this.editInfo.threshold, 10) > 0);
      Vue.set(this.ruleInfo, 'threshold', this.editInfo.threshold);
    },
    async tapUpdateButton() {
      this.updating = true;
      try {
        const info = {
          code: this.editInfo.code,
          description: this.editInfo.description,
          facebook: this.editInfo.facebook,
          ins: this.editInfo.ins,
          twitter: this.editInfo.twitter,
          memberOnly: this.ruleInfo.ruleMemberSelected ? 1 : 0,
          threshold: this.ruleInfo.ruleThresholdSelected ? this.ruleInfo.threshold : 0,
        };
        if (this.logoRemote && this.logoRemote.length > 0) {
          info.icon = this.logoRemote;
        }
        if (this.bannerRemote && this.bannerRemote.length > 0) {
          info.banner = this.bannerRemote;
        }
        await updateProjectInfo({
          info,
        });
        this.updating = false;
        this.successToast(this.$t('project.editP.success'));
        setTimeout(() => {
          this.push(`/project-info/${this.code}`);
        }, 500);
      } catch (e) {
        this.updating = false;
        this.errorToast(e.message);
      }
    },
  },
};
</script>

<style scoped lang="scss">

#edit-project__container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  #edit-project__content {
    @include centered-view;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    #title-text {
      @include FontB;
      font-size: 6.4vw;
      color: #000000;
      line-height: 8vw;
      margin: 12.26vw 0 0 0;
      @include media-breakpoint-up(md) {
        margin: 32px 0 0 0;
        font-size: 48px;
        line-height: 56px;
      }
    }
    #edit-project__inner {
      width: 100%;
      margin: 0 0 0 0;
      display: flex;
      flex-direction: column-reverse;
      align-items: stretch;
      justify-content: flex-start;
      @include media-breakpoint-up(md) {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        margin: 0 0 0 0;
      }
      #left-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        margin: 0;
        width: 100%;
        flex-grow: 0;
        @include media-breakpoint-up(md) {
          margin: 0 40px 0 0;
          width: unset;
          max-width: 50%;
          flex-grow: 1;
        }
        #project-icon {
          width: 18.667vw;
          height: 18.667vw;
          border-radius: 18.667vw;
          object-fit: cover;
          @include media-breakpoint-up(md) {
            width: 98px;
            height: 98px;
            border-radius: 98px;
          }
        }
        #project-name {
          font-size: 30px;
          @include FontSB;
          font-weight: 600;
          color: #23262F;
          line-height: 30px;
          margin: 2.4vw 0 0 0;
          @include media-breakpoint-up(md) {
            font-size: 30px;
            @include FontSB;
            font-weight: 600;
            color: #23262F;
            line-height: 30px;
            margin: 20px 0 0 0;
          }
        }
        #project-homepage {
          @include FontM;
          font-size: 14px;
          font-weight: 500;
          color: #000000;
          line-height: 21px;
          margin: 10px 0 0 0;
        }
        #project-info-title {
        }
        #project-name-title {
          margin: 6.67vw 0 0 0;
          @include media-breakpoint-up(md) {
            margin: 32px 0 0 0;
          }
        }
        #rule-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin: 3.2vw 0 0 0;
          @include media-breakpoint-up(md) {
            margin: 12px 0 0 0;
          }
          :nth-child(1) {
            margin-right: 6.67vw;
            @include media-breakpoint-up(md) {
              margin-right: 30px;
            }
          }
          button {
            @include FontM;
            font-weight: 500;
            color: #000000;
            line-height: 4.6vw;
            border-width: 2px;
            font-size: 3.4vw;
            &:hover {
              color: white;
            }
            @include media-breakpoint-up(md) {
              font-size: 14px;
              line-height: 24px;
              border-width: 2px;
            }
          }
        }
      }
      #right-content {
        width: 100%;
        flex-grow: 0;
        margin: 0;
        display: flex;
        align-items: center;
        @include media-breakpoint-up(md) {
          width: auto;
        }
      }
    }
  }
}

.bottom-button {
  margin: 80px 0 0 0;
  border-radius: 80px;
  overflow: hidden;
}
#update-button {
  padding: 3.2vw 4.3vw;
  font-size: 3.73vw;
  line-height: 3.73vw;
  @include media-breakpoint-up(md) {
    padding: 16px 25px;
    @include FontM;
    font-size: 16px;
    color: #FCFCFD;
    line-height: 16px;
  }
}

.project-info-title {
  @include FontSB;
  font-size: 16px;
  font-weight: 600;
  color: #23262F;
  line-height: 24px;
}

.info-title {
  @include FontB;
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  line-height: 12px;
  margin: 32px 0 0 0;
}

.info-input {
  @include FontM;
  border: 1px solid #E6E8EC;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0,0,0,0.6);
  line-height: 24px;
  width: 100%;
  min-height: 48px;
  margin: 12px 0 0 0;
  &:disabled {
    background-color: transparent;
    color: rgba(0,0,0,0.3);
    cursor: not-allowed;
  }
}
.stepper {
  width: 100%;
}

.edit-swiper {
  width: 100%;
}

.form-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin: 11.6vw 0 0 0;
  @include media-breakpoint-up(md) {
    margin: 57px 0 0 0;
  }
}

.next-button {
  width: 170px;
  margin-top: 10.667vw;
}

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

</style>
