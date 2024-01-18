<template>
  <div class="projectSpaceList">
    <!-- <div style="height:80px;"></div> -->
    <div class="wrap">
      <div class="list">
        <div class="left-cont" style="position: relative">
          <!-- 右边字母排序 -->
          <ul class="right-cont">
            <a
              v-for="(item, index) in dataList.acronymList"
              :key="'b' + index"
              :index="0"
              :href="'#' + item"
              @click="href_link(item)"
              fixed="top"
            >
              <li :class="{ click_btn: changeColor === true && item === tab }">
                {{ item }}
              </li>
            </a>
          </ul>
          <!-- 列表 -->
          <div class="scroll" ref="content">
            <div class="scroll_p">
            <div class="title">
              <span>Project Space</span>
              <span @click="createProjectSpace">Create project space</span>
            </div>
            <div
              class="left-cont-list"
              :class="item.acronym"
              :id="item.elId"
              v-for="(item, index) in dataList.projectList"
              :key="'a' + index"
            >
              <!-- 左图片/内容 -->
              <div class="left-info">
                <img
                  :src="item.icon"
                  alt
                  @click="to_projectDetail(item.code)"
                />
                <div class="right-txt">
                  <div class="title-txt" @click="to_projectDetail(item.code)">
                    {{ item.name }}
                  </div>
                  <div class="num" @click="to_projectDetail(item.code)">
                    {{ $t('proposal1', {proposalNum: item.proposalNum}) }}
                  </div>
                  <div
                    class="btn"
                    :class="{ follow_btn: item.isFollow === true }"
                    @click="isFollowBtn(item.isFollow, item.id)"
                  >
                    <span v-if="item.isFollow === false">{{ $t('follow') }}</span>
                    <span v-else>{{ $t('user.unfollow') }}</span>
                  </div>
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
                  <div class="default-cont" v-if="item.proposalList.length==0">
                    <div class="cont-txt">
                      {{ $t('project.list.text1') }}
                    </div>
                    <div
                      class="created_btn"
                      @click="toCreateProposal(item.code)">Create proposal </div>
                  </div>
              </div>
             </div>
            </div>
            <div id="footer-content">
              <HomeFooter></HomeFooter>
            </div>
          </div>
        </div>
      </div>
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
    },
    initScroll() {
      this.height = this.$refs.content.clientHeight;
      this.scrolHeight = this.$refs.content.scrollHeight;
      // this.height = this.$refs.window.innerHeight;
      // this.scrolHeight = document.documentElement.scrollTop;
      this.doms = [];
      let tmp;
      for (let i = 0; i < this.dataList.acronymList.length; i += 1) {
        tmp = document.getElementById(`id${this.dataList.acronymList[i]}`);
        this.doms.push({
          el: tmp,
          offsetTop: tmp.offsetTop,
        });
      }
      this.fn = this.scroll.bind(this);
      this.$refs.content.addEventListener('scroll', this.fn);
      console.log('kkk', this.height);
      // this.$refs.window.addEventListener('scroll', this.fn);
    },
    scroll() {
      if (this.stop) return;
      let i = 0;
      for (i = 0; i < this.doms.length; i += 1) {
        if (this.$refs.content.scrollTop <= this.doms[i].offsetTop) {
          this.tab = this.doms[i].el.id.replace(/^id/, '');
          break;
        }
      }
    },
    isFollowBtn(item, id) {
      if (item === false) {
        followSpace({ projectId: id })
          .then(() => {
            this.successToast('success');
            this.getData();
          })
          .catch((error) => {
            this.errorToast(error);
          });
      } else {
        unfollowSpace({ projectId: id })
          .then(() => {
            this.successToast('success');
            this.getData();
          })
          .catch((error) => {
            this.errorToast(error);
          });
      }
    },
    href_link(item) {
      this.stop = true;
      this.tab = item;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.stop = false;
      }, 1000);
      this.changeColor = true;
      const target = document.getElementById(`id${item}`);
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    // document.getElementsByTagName('body')[0].style.height = '100vh';
    // document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    this.getData();
    this.$root.$on('bv::scrollspy::activate', this.onActivate);
  },
  mounted() {},
};
</script>
<style scoped lang="scss">
.projectSpaceList {
  position: relative;
  margin-top: 0px !important;
  li {
    list-style: none;
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
  .title {
    padding: 43px 0 16px 0;
    span:nth-child(1){
      font-size: 30px;
      @include FontB;
      font-weight: bold;
      color: #23262f;
      text-align: left;
      // margin:43px 0 16px 0;
    }
    span:nth-child(2){
      @include FontM;
      background: #3772FF;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      color: #FFFFFF;
      height: 30px;
      line-height: 32px;
      text-align: center;
      margin-top: 16px;
      cursor: pointer;
      padding: 0 14px;
      float: right;
    }
  }
  .follow_btn {
    background: #ffffff !important;
    color: #000000 !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
  }
  .circle_end {
    background: #c2c2c2 !important;
  }
  .wrap {
    position: relative;
    // display: flex;
    align-items: flex-start;
    justify-content: center;
    .list {
      display: flex;
      position: relative;
    }
    .left-cont {
      width: 100%;
      position: relative;
      padding-top: 80px;
      height: 100vh;
      box-sizing: border-box;
      .scroll {
        height: 100%;
        overflow: auto;
        width: 100vw;
        .scroll_p{
          width: 100%;
          max-width: 1380px;
          padding: 0 30px 0 30px;
          margin: 0 auto;
        }
      }
      .left-cont-list {
        width: 90%;
        &:nth-child(1) {
          padding-top: 0;
        }
        display: flex;
        padding: 48px 0 32px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        .left-info {
          display: flex;
          flex: 0 0 256px;
          cursor: pointer;
          img {
            flex: 0 0 88px;
            width: 88px;
            height: 88px;
            border-radius: 100%;
            margin-right: 20px;
          }
          .right-txt {
            flex: 1;
            .title-txt {
              font-size: 16px;
              @include FontM;
              font-weight: 500;
              color: #000000;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              width: 148px;
            }
            .num {
              font-size: 12px;
              @include FontM;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.3);
            }
            .btn {
              background: #3772ff;
              border-radius: 90px;
              font-size: 12px;
              font-family: "DMSans-Bold";
              font-weight: bold;
              color: #ffffff;
              padding: 7px 0px;
              margin-top: 14px;
              width: 82px;
            }
          }
        }
        .right-list {
          width: 100%;
          display: flex;
          // grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          grid-column-gap: 20px;
          margin-left: 40px;
          .default-cont{
            flex: 170px 0;
            .cont-txt{
              color: rgba(0, 0, 0, 0.3);
              font-size: 14px;
              font-family: "PingFangSC-Semibold";
              font-weight: 600;
            }
            .created_btn{
              background: #3772FF;
              border-radius: 16px;
              font-size: 14px;
              font-family: "PingFangSC-Semibold";
              font-weight: 600;
              color: #FFFFFF;
              height: 32px;
              line-height: 32px;
              text-align: center;
              margin-top: 16px;
              cursor: pointer;
            }
          }
          .wrap-cont {
            padding: 12px 11px;
            background: #f4f5f6;
            border-radius: 12px;
            flex: 170px 0;
            cursor: pointer;
            .circle {
              width: 10px;
              height: 10px;
              background: #037aff;
              border-radius: 100%;
            }
            .cont-txt {
              font-size: 14px;
              font-family: "PingFangSC-Semibold";
              font-weight: 600;
              color: #000000;
              margin-top: 13px;
              text-align: left;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
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
    .right-cont {
      // position: fixed;
      // right: 30px;
      // flex: 1;
      // position: absolute;
      // top: 0;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // position: fixed;
      // right: 100px;
      // top: 209px;
      // position: fixed;
      // right: 240px;
      // top: 240px;
      position: fixed;
      top: 240px;
      left: calc(100vw / 2);
      padding: 0;
      transform: translateX(calc(1380px / 2 - 40px));
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
  #footer-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
  }
}
</style>
