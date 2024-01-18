<template>
  <div class="edit-project">
    <div class="container-wrap">
      <div class="title-txt-cont">
        <div class="title-txt">{{$t('project.edit.editM')}}</div>
        <div class="btn" @click="edit_member" v-if="role === 1 || role === 2">
          {{$t('project.edit.addM')}}
          <img src="@/assets/add.png" alt="">
        </div>
      </div>
      <div class="search-content">
        <b-form-input class="search-input" @input="searchInput"
                      :placeholder="$t('v11.searchByNameOrAddress')"
        >
        </b-form-input>
        <BIconSearch id="iconSearch"></BIconSearch>
      </div>
      <div class="right-content">
        <div class="right-line">
          <div class="header-wrap">
          </div>
          <div class="list-cont">
            <div class="cont-info"
                 v-for="(item ,index) in memberList" :key="'a'+index">
              <div class="left">
                <div class="head-img">
                  <img :src="item.pictures" alt="">
                </div>
                <div class="addrees">
                  {{ item.userName || item.shortAddress }}
                </div>
              </div>
              <span v-if="role === 3 || role === 0" class="role-text">{{roles[item.role]}}</span>
              <div class="right" v-else>
                <MarketDropdown
                  class="filter-selector"
                  :options="item.role === 1 ? optionsArr : memberOptionsArr"
                  :ref="'optionsVal'+index"
                  @input="selectOptionType(item,index)"
                  :disabled="!canChangeRole(item)"
                  v-model="itemRoles[index]"
                  :class="{disable_color:!canChangeRole(item)}"
                />
                <div @click="canDelete(item) ? deleteBtn(item) : ''">
                  <IconDelete class="img-svg" :disable_delete="!canDelete(item)"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="footer-content">
      <HomeFooter></HomeFooter>
    </div>
  </div>
</template>
<script>
import MarketDropdown from '@/components/market-dropdown/index.vue';
import IconDelete from '@/components/icons/IconDelete.vue';
import {
  spaceDetail, spaceMemberList, addMember, deleteMember, updateMember, findRole,
} from '@/common/api/space-repository';
import { ellipsisThree } from '@/common/filter';
import ToastMixin from '@/mixins/toast-mixin';
import HomeFooter from '@/views/space-home/home-footer.vue';
import { BIconSearch } from 'bootstrap-vue';

export default {
  name: 'editProfile',
  components: {
    MarketDropdown,
    IconDelete,
    HomeFooter,
    BIconSearch,
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
      deleteId: '',
      model_add: false,
      model_title: '',
      modal_text: '',
      btn_confirm: '',
      role: '',
      pageSize: 100,
      currentPage: 1,
      inputValue: '',
      modalShow: false,
      active: false,
      a: false,
      memberData: {},
      memberList: [],
      totalList: [],
      itemRoles: [],
    };
  },
  computed: {
    optionsArr() {
      return [
        {
          name: this.$t('project.edit.admin'),
          role: 1,
        },
        {
          name: this.$t('v11.manager'),
          role: 2,
        },
        {
          name: this.$t('project.edit.member'),
          role: 3,
        },
      ];
    },
    memberOptionsArr() {
      return [
        {
          name: this.$t('v11.manager'),
          role: 2,
        },
        {
          name: this.$t('project.edit.member'),
          role: 3,
        },
      ];
    },
    roles() {
      return {
        1: this.$t('project.detail.admin'),
        2: this.$t('v11.manager'),
        3: this.$t('project.edit.member'),
      };
    },
  },
  methods: {
    canDelete(item) {
      if (item.role === 1) {
        return false;
      }
      if (item.role === 2) {
        return this.role === 1;
      }
      if (item.role === 3) {
        return this.role === 1 || this.role === 2;
      }
      return false;
    },
    canChangeRole(item) {
      if (item.role === 1) {
        return false;
      }
      if (item.role === 2 || item.role === 3) {
        return this.role === 1;
      }
      return false;
    },
    searchInput(value) {
      if (value.length === 0) {
        this.memberList = [...this.totalList];
      } else {
        const list = [];
        this.totalList.forEach((item) => {
          if (item.userAddress.indexOf(value) !== -1) {
            list.push(item);
          }
        });
        this.memberList = list;
      }
    },
    edit_member() {
      this.push(`/add-project-member/${this.code}`);
      // this.model_title = this.$t('project.edit.addM');
      // this.modal_text = this.$t('project.edit.modalT');
      // this.btn_confirm = this.$t('project.edit.add');
      // this.model_add = true;
      // this.modalShow = true;
    },
    deleteBtn(item) {
      this.model_title = this.$t('project.edit.confirm');
      this.modal_text = this.$t('project.edit.modalT1');
      this.btn_confirm = this.$t('project.edit.confirmD');
      this.model_add = false;
      this.modalShow = true;
      this.deleteId = item.id;
    },
    selectOptionType(item, index) {
      updateMember({
        address: localStorage.getItem('address'),
        id: item.id,
        role: this.itemRoles[index].role,
      })
        .then(() => {
          this.loadData();
          this.successToast(this.$t('project.edit.success'));
        })
        .catch((e) => {
          this.errorToast(e.message);
        });
    },
    addButton() {
      if (this.model_add === true) {
        addMember({
          address: this.$store.state.connect.address,
          projectCode: this.code,
          userAddress: this.inputValue,
        })
          .then(() => {
            this.loadData();
            this.modalShow = false;
            this.successToast(this.$t('project.edit.success'));
          })
          .catch((e) => {
            this.errorToast(e.message);
          });
      } else if (this.model_add === false) {
        deleteMember({
          address: localStorage.getItem('address'),
          id: this.deleteId,
        })
          .then(() => {
            this.loadData();
            this.modalShow = false;
            this.successToast('success');
          })
          .catch((e) => {
            this.errorToast(e.message);
          });
      }
    },
    delete_model() {
      this.modalShow = false;
    },
    async loadData() {
      let memberRes = null;
      let projectDetail = null;
      let role = null;
      [role, memberRes, projectDetail] = await Promise.all([
        findRole({
          project: this.code,
          address: localStorage.getItem('address'),
        }),
        spaceMemberList({
          project: this.code,
          role: '',
          pageSize: 1000,
          currentPage: this.currentPage,
          address: localStorage.getItem('address'),
        }),
        spaceDetail({ code: this.code }),
      ]);
      this.role = role.response;
      let dataList = [];
      // role 1:创建者，2:管理员，3:成员
      if (memberRes.response.dataList) {
        this.itemRoles = [];
        dataList = memberRes.response.dataList.map((item) => {
          const aItem = item;
          aItem.shortAddress = ellipsisThree(item.userAddress);
          aItem.active = false;
          aItem.refName = `optionRef${1}`;
          this.itemRoles.push(
            item.role === 1
              ? this.optionsArr[item.role - 1]
              : this.memberOptionsArr[item.role - 2],
          );
          return aItem;
        });
      }
      this.memberList = dataList;
      this.totalList = dataList;
      this.memberData = projectDetail.response;
    },
  },
  mounted() {
    if (this.$store.state.connect.isConnected) {
      this.loadData();
    }
  },
  watch: {
    '$store.state.connect.address': function () {
      if (this.$store.state.connect.isConnected) {
        this.loadData();
      }
    },
  },
};
</script>
<style scoped lang="scss">
input {
  outline: none;
}

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
  font-size: 24px;
  font-family: "PingFangSC-Medium";
  font-weight: 500;
  color: #000000;
}

::v-deep .my-txt {
  font-size: 16px;
  @include FontR;
  font-weight: 500;
  color: #23262F;
  line-height: 24px;
  margin-bottom: 30px;
}

.adress-txt {
  div:nth-child(1) {
    font-size: 14px;
    @include FontM;
    font-weight: 500;
    color: rgba(14, 14, 14, 0.6);
    margin-bottom: 14px;
  }

  input {
    width: 100%;
    border: 1px solid rgba(230, 232, 236, 1);
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }
}

::v-deep .publish-btn {
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

.modal-body input {
  padding: 7px 0;
  font-size: 14px;
  @include FontM;
  color: rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.3);
  }
}

.modal-body .address-cont {
  margin-bottom: 37px;

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  span {
    margin-left: 17px;
    margin-top: 9px;
    font-size: 14px;
    @include FontR;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
  }
}

.delete_show {
  background: rgba(255, 80, 102, 1) !important;
}

::v-deep .disable_color {
  background: #F4F5F6 !important;
  border-radius: 14px !important;
  border: none !important;

  .option__title {
    font-size: 14px !important;
    @include FontM;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.3);
  }

  .multiselect__tags {
    border: 1px solid transparent !important;
  }
}

.m_40 {
  margin-bottom: 40px !important;
}

.edit-project {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;

  .list-cont-b {
    margin-bottom: 32px;
  }

  .container-wrap {
    @include centered-view;
    margin: 11.33vw auto 50vw auto;
    @include media-breakpoint-up(md) {
      margin: 64px auto 100px auto;
    }
    .title-txt-cont {
      position: relative;
      .title-txt {
        text-align: left;
        font-size: 6.4vw;
        @include FontSB;
        font-weight: 600;
        color: #000000;
        margin-bottom: 6.6vw;
        @include media-breakpoint-up(md) {
          font-size: 30px;
          margin-bottom: 28px;
        }
      }

      .btn {
        border-radius: 90px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        font-size: 3.2vw;
        @include FontSB;
        font-weight: 600;
        color: #000000;
        text-align: center;
        position: absolute;
        right: 0;
        top: 0;
        padding: 2.13vw 4.3vw;
        @include media-breakpoint-up(md) {
          border-radius: 90px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 16px;
          padding: 11px 25px;
        }
        img {
          margin-left: 2.67vw;
          @include media-breakpoint-up(md) {
            margin-left: 17px;
          }
        }
      }
    }

    .right-content {
      flex: 1;
      .right-line {
        border: none;
        max-height: 100%;
        border-radius: 0;
        padding: 0 0 27px 0;
        @include media-breakpoint-up(md) {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 21px 20px 27px 20px;
        }
      }

      .header-wrap {
        position: relative;
        .txt {
          font-size: 14px;
          @include FontSB;
          font-weight: 500;
          color: #000000;
          margin: 20px 0 30px 0;
          text-align: left;
        }
      }

      .list-cont {
        background: #FFFFFF;
        border-radius: 12px;
        ::v-deep .cont-info {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 0 8vw 0;
          @include media-breakpoint-up(md) {
            margin: 0 0 40px 0;
          }
          &:last-child {
            margin-bottom: 0;
          }
          text-align: left;
          .left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .head-img {
              display: inline-block;
              width: 10.67vw;
              height: 10.67vw;
              @include media-breakpoint-up(md) {
                width: 40px;
                height: 40px;
              }
              img {
                width: 100%;
                height: 100%;
                border-radius: 100%;
              }
            }

            .addrees {
              display: inline-block;
              font-size: 3.73vw;
              @include FontR;
              font-weight: 400;
              color: rgba(0, 0, 0, 0.6);
              margin-left: 2.4vw;
              @include media-breakpoint-up(md) {
                font-size: 14px;
                margin-left: 13px;
              }
            }
          }
        }
        .right {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          ::v-deep #svg2 {
            &.disable_svg {
              fill: #CFCFCF !important;
            }
          }
          .img-svg {
            width: 8vw;
            height: 8vw;
            @include media-breakpoint-up(md) {
              width: 40px;
              height: 40px;
            }
          }
          .popper-container {
            margin-right: 1.8vw;
            width: 34.13vw;
            font-size: 2.67vw;
            @include media-breakpoint-up(md) {
              margin-right: 60px;
              width: 180px;
            }
            ::v-deep .option__title {
              font-size: 2.67vw;
              @include media-breakpoint-up(md) {
                font-size: 16px;
              }
            }
          }
        }
      }
    }

    .save_btn {
      width: 100%;
      position: relative;
      div {
        width: 150px;
        height: 48px;
        background: #3772FF;
        border-radius: 90px;
        font-size: 16px;
        font-family: "Helvetica";
        color: #FCFCFD;
        text-align: center;
        line-height: 48px;
        position: absolute;
        right: 0;
        top: 30px;
        cursor: pointer;
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

.search-content {
  position: relative;
  margin: 1.33vw 0 10.667vw 0;
  @include media-breakpoint-up(md) {
    margin: 10px 0 40px 0;
  }
  .search-input {
    border-radius: 10.667vw;
    height: 10.667vw;
    padding: 0 0 0 8.667vw;
    @include media-breakpoint-up(md) {
      border-radius: 40px;
      height: 40px;
      padding: 0 0 0 40px;
    }
  }
  #iconSearch {
    position: absolute;
    top: 0;
    left: 2.67vw;
    height: 10.667vw;
    @include media-breakpoint-up(md) {
      left: 12px;
      height: 40px;
    }
  }
}

.role-text {
  color: rgba(0,0,0,0.3);
  @include FontR;
  font-size: 3.73vw;
  @include media-breakpoint-up(md) {
    font-size: 14px;
  }
}

</style>
