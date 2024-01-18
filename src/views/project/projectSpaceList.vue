<template>
  <div class="projectSpaceList"
       ref="content">
    <div class="top">
      <div class="left">
        <div class="title">
          <span>{{ $t('project.list.title') }}</span>
          <span @click="createProjectSpace">{{ $t('project.list.create') }}</span>
        </div>
        <div class="d-flex align-items-center justify-content-center p-5" v-if="isLoading">
          <b-spinner></b-spinner>
        </div>
        <div
          class="left-cont-list"
          :class="item.acronym"
          :id="item.acronym"
          v-for="(item, index) in dataList.projectList"
          :key="'a' + index"
        >
          <!-- 左图片/内容 -->
          <div class="left-info">
            <img :src="item.icon"
                 alt
                 @click="to_projectDetail(item.code)" />
            <div class="right-txt">
              <div class="d-flex flex-column">
                <div class="title-txt"
                     @click="to_projectDetail(item.code)">
                  {{ item.name }}
                </div>
                <div class="num"
                     @click="to_projectDetail(item.code)">
                  {{ item.proposalNum + ' ' + $t('project.list.pp') }}
                </div>
              </div>
              <b-button
                class="btn"
                pill
                :variant="item.isFollow ? 'outline-secondary' : 'primary'"
                @click="isFollowBtn(item.isFollow, item.id)"
              >
                <span v-if="item.isFollow === false">{{ $t('project.list.follow') }}</span>
                <span v-else>{{ $t('project.list.unfollow') }}</span>
              </b-button>
            </div>
          </div>
          <!-- 右列表 -->
          <div class="right-list">
            <div
              class="wrap-cont"
              @click="to_proposalDetail(item1.ipfsHash)"
              v-for="(item1, index1) in item.proposalList"
              :key="'c' + index1"
            >
              <div
                class="circle"
                :class="{ circle_end: item1.status === 2 }"
              ></div>
              <div class="cont-txt">{{ item1.title }}</div>
            </div>
            <!-- 默认框 -->
            <div class="default-cont"
                 v-if="item.proposalList.length === 0">
              <div class="cont-txt">{{ $t('project.list.text1') }}</div>
              <div class="created_btn"
                   @click="toCreateProposal(item.code)">
                {{ $t('project.list.createP') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <!-- 右边字母排序 -->
        <ul class="right-cont">
          <a
            v-for="(item, index) in dataList.acronymList"
            :key="'b' + index"
            :index="0"
            :href="'#' + item"
            @click="href_link(item,index)"
            fixed="top"
          >
            <li :class="{ click_btn: changeColor === true && item === tab }">
              {{ item }}
            </li>
          </a>
        </ul>
      </div>
      <!-- </div> -->
    </div>
    <div class="footer">
      <HomeFooter></HomeFooter>
    </div>
  </div>
</template>
<script>
import {
  spaceList,
  followSpace,
  unfollowSpace,
} from '@/common/api/space-repository';

import ToastMixin from '@/mixins/toast-mixin';
import HomeFooter from '@/views/space-home/home-footer.vue';

export default {
  name: 'ProjectSpaceList',
  mixins: [ToastMixin],
  components: { HomeFooter },
  data() {
    return {
      tab: '',
      changeColor: false,
      dataList: [],
      FollowText: 'Follow',
      isLoading: false,
    };
  },
  computed: {},
  methods: {
    createProjectSpace() {
      this.push('/create-project/');
    },
    toCreateProposal(code) {
      this.push(`/initiate-proposal/${code}`);
    },
    to_projectDetail(code) {
      this.push(`/project-detail/${code}`);
    },
    to_proposalDetail(ipfsHash) {
      this.push(`/proposal-detail/${ipfsHash}`);
    },
    async getData() {
      this.isLoading = true;
      let res = null;
      res = await spaceList();
      this.dataList = res.response;
      const acrony = this.dataList.acronymList[0];
      this.tab = acrony;
      let index = '';
      let i;
      for (i = 0; i < this.dataList.projectList.length; i += 1) {
        if (index !== `id${this.dataList.projectList[i].acronym}`) {
          index = `id${this.dataList.projectList[i].acronym}`;
          this.dataList.projectList[i].elId = index;
        }
      }
      await this.$nextTick();
      this.changeColor = true;
      [this.tab] = this.dataList.acronymList;
      // this.href_link(acrony);
      this.initScroll();
      this.isLoading = false;
    },
    initScroll() {
      // this.scrolHeight = this.$refs.content.scrollHeight;
      // this.height = this.$refs.window.innerHeight;
      // this.scrolHeight = document.documentElement.scrollTop;
      this.doms = [];
      let tmp;
      for (let i = 0; i < this.dataList.acronymList.length; i += 1) {
        tmp = document.getElementById(`${this.dataList.acronymList[i]}`);
        this.doms.push({
          el: tmp,
          getBoundingClientRect: tmp.getBoundingClientRect().top,
        });
      }
      this.fn = this.scroll.bind(this);
      this.$refs.content.addEventListener('scroll', this.fn);
      // this.$refs.window.addEventListener('scroll', this.fn);
    },
    scroll() {
      if (this.stop) return;
      let i = 0;
      for (i = 0; i < this.doms.length; i += 1) {
        // console.log('滚动dom11111', this.doms[i].getBoundingClientRect);
        if (this.$refs.content.scrollTop
          <= this.doms[i].getBoundingClientRect) {
          this.tab = this.doms[i].el.id.replace(/^id/, '');
          break;
        }
      }
    },
    isFollowBtn(item, id) {
      if (item === false) {
        followSpace({ projectId: id })
          .then(() => {
            this.successToast(this.$t('project.list.success'));
            this.getData();
          })
          .catch((error) => {
            this.errorToast(error);
          });
      } else {
        unfollowSpace({ projectId: id })
          .then(() => {
            this.successToast(this.$t('project.list.success'));
            this.getData();
          })
          .catch((error) => {
            this.errorToast(error);
          });
      }
    },
    href_link(item, index) {
      this.stop = true;
      this.tab = item;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.stop = false;
      }, 1000);
      this.changeColor = true;
      if (index === 0) {
        this.$refs.content.scrollTop = 0;
        const target = document.getElementById(`${item}`);
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'bottom',
        });
      }
      const target = document.getElementById(`${item}`);
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      // if (this.dataList.acronymList[0]) {
      //   console.log(1111);
      //   document.getElementsByTagName('body')[0].scrollTop = 0;
      // } else {
      // }
    },
    onActivate(target) {
      console.log(
        'Received event: "bv::scrollspy::activate" for target ',
        target,
      );
    },
  },
  beforeDestroy() {
    this.$refs.content.removeEventListener('scroll', this.fn);
    document.getElementsByTagName('body')[0].style.height = '100%';
    document.getElementsByTagName('body')[0].style.overflow = 'inherit';
  },
  created() {
    document.getElementsByTagName('body')[0].style.height = '100vh';
    document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    // console.log('打印body高度', document.getElementsByTagName('body')[0].style.height);
    this.getData();
    this.$root.$on('bv::scrollspy::activate', this.onActivate);
  },
  mounted() {
  },
};
</script>
<style scoped
       lang="scss">
.projectSpaceList {
  width: 100%;
  overflow-y: auto;
  height: calc(100vh - 21.33vw);
  @include media-breakpoint-up(md) {
    height: calc(100vh - 80px);
  }

  .show {
    width: 20px;
    height: 20px;
    background: #0179ff;
    border-radius: 100%;
    font-size: 14px;
    @include FontSB;
    font-weight: 600;
    color: #ffffff;
  }

  .click_btn {
    background: rgba(1, 121, 255, 1) !important;
    color: #ffffff !important;
  }

  li {
    list-style: none;
  }

  .content {
  }

  .top {
    width: 100%;
    display: flex;
    position: relative;
    max-width: 1380px;
    padding: 0 8vw 0 8vw;
    margin: 0 auto;
    @include media-breakpoint-up(md) {
      padding: 0 30px 0 30px;
    }

    .left {
      width: 98%;

      .title {
        padding: 13.33vw 0 12.267vw 0;
        @include media-breakpoint-up(md) {
          padding: 43px 0 16px 0;
        }
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        span:nth-child(1) {
          @include FontB;
          font-weight: bold;
          color: #23262f;
          text-align: left;
          font-size: 6.4vw;
          @include media-breakpoint-up(md) {
            font-size: 30px;
          }
        }

        span:nth-child(2) {
          @include FontM;
          background: #3772ff;
          border-radius: 8vw;
          font-size: 2.67vw;
          font-weight: 500;
          color: #ffffff;
          height: 8vw;
          line-height: 8vw;
          text-align: center;
          cursor: pointer;
          padding: 0 2.6vw;
          @include media-breakpoint-up(md) {
            border-radius: 16px;
            font-size: 12px;
            height: 30px;
            line-height: 30px;
            padding: 0 14px;
          }
        }
      }

      .left-cont-list {
        width: 90%;

        &:nth-child(1) {
          padding-top: 0;
        }

        display: flex;
        flex-direction: column;
        padding: 5.33vw 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        @include media-breakpoint-up(md) {
          padding: 48px 0 32px 0;
          flex-direction: row;
        }

        .left-info {
          display: flex;
          flex: 0 0 0;
          cursor: pointer;
          @include media-breakpoint-up(md) {
            flex: 0 0 256px;
          }

          img {
            flex: 0 0 13.33vw;
            width: 13.33vw;
            height: 13.33vw;
            margin-right: 1.87vw;
            border-radius: 100%;
            @include media-breakpoint-up(md) {
              flex: 0 0 88px;
              width: 88px;
              height: 88px;
              margin-right: 20px;
            }
          }

          .right-txt {
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            @include media-breakpoint-up(md) {
              flex-direction: column;
              align-items: flex-start;
            }

            .title-txt {
              @include FontM;
              font-weight: 500;
              color: #000000;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              font-size: 4.267vw;
              @include media-breakpoint-up(md) {
                font-size: 16px;
                width: 148px;
              }
            }

            .num {
              font-size: 3.2vw;
              @include FontM;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.3);
              @include media-breakpoint-up(md) {
                font-size: 12px;
              }
            }

            .btn {
              //background: #3772ff;
              //border-radius: 90px;
              font-size: 3.2vw;
              font-weight: bold;
              //color: #ffffff;
              padding: 1.867vw 5.867vw 1.867vw 6.133vw;
              margin-top: 0;
              @include FontB;
              @include media-breakpoint-up(md) {
                padding: 7px 0px;
                margin-top: 14px;
                width: 82px;
                border-radius: 90px;
                font-size: 12px;
              }
            }
          }
        }

        .right-list {
          width: 100%;
          // grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(48%, 1fr));
          grid-gap: 1.87vw;
          margin-left: 0;
          margin-top: 5.33vw;
          @include media-breakpoint-up(md) {
            display: flex;
            grid-gap: 20px;
            margin-left: 40px;
            margin-top: 0;
          }

          .default-cont {
            flex: 48% 0;
            @include media-breakpoint-up(md) {
              flex: 170px 0;
            }

            .cont-txt {
              color: rgba(0, 0, 0, 0.3);
              font-size: 3.73vw;
              @include FontSB;
              font-weight: 600;
              @include media-breakpoint-up(md) {
                font-size: 14px;
              }
            }

            .created_btn {
              background: #3772ff;
              border-radius: 16px;
              font-size: 3.2vw;
              @include FontSB;
              font-weight: 600;
              color: #ffffff;
              height: unset;
              line-height: unset;
              text-align: center;
              margin-top: 2.13vw;
              cursor: pointer;
              padding: 1.867vw 0;
              width: 100%;
              @include media-breakpoint-up(md) {
                width: unset;
                padding: unset;
                border-radius: 16px;
                font-size: 14px;
                line-height: 32px;
                height: 32px;
                margin-top: 16px;
              }
            }
          }

          .wrap-cont {
            padding: 3.2vw;
            background: #f4f5f6;
            border-radius: 12px;
            flex-grow: 1;
            flex-shrink: 0;
            flex-wrap: wrap;
            cursor: pointer;
            @include media-breakpoint-up(md) {
              flex: 170px 0;
              border-radius: 12px;
              padding: 12px 11px;
            }

            .circle {
              width: 10px;
              height: 10px;
              background: #037aff;
              border-radius: 100%;

              &.circle_end {
                background: lightgray;
              }
            }

            .cont-txt {
              @include FontSB;
              font-weight: 600;
              color: #000000;
              text-align: left;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              font-size: 3.2vw;
              margin-top: 3.73vw;
              @include media-breakpoint-up(md) {
                margin-top: 13px;
                font-size: 14px;
              }
            }
          }

          .default_cont {
            background: rgba(244, 245, 246, 1) !important;
          }

          .default_circle {
            border: 1px solid rgba(0, 0, 0, 0.25) !important;
            background: rgba(244, 245, 246, 1) !important;
          }

          .default_txt {
            color: rgba(0, 0, 0, 0.3) !important;
          }
        }
      }
    }

    .right {
      width: 2%;
      //   background: rebeccapurple;
      height: 100vh;
      position: sticky;
      top: 155px;
      //    position: absolute;
      ul {
        padding: 0;
      }

      //   display: flex;
      //   align-items: flex-end;
      a {
        font-size: 14px;
        font-family: "PingFangSC-Semibold";
        font-weight: 600;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.3);
        text-decoration: none;
      }

      li {
        width: 20px;
        height: 20px;
        border-radius: 20px;
        background-color: transparent;
        color: rgba(0, 0, 0, 0.3);
        text-align: center;
        font-weight: 600;
        margin-bottom: 5px;
      }
    }
  }

  .footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin: 0 auto;
  }
}
</style>
