<template>
  <div class="add-member__container">
    <div class="add-member__content">
      <p class="add-member__title">{{ $t('project.edit.addM') }}</p>
      <b-form-input
        @input="inputChange"
        debounce="300"
        v-model="inputValue"
        class="add-member__input"
        :placeholder="$t('v11.inviteViaAddress')"
        ref="input"
      >
      </b-form-input>
      <span class="alert-text"
            v-if="!addressIsValid"
      >{{ $t('v11.pleaseInputAValidAddress') }}</span>
      <div class="w-100 d-flex justify-content-center" v-if="isLoading">
        <b-spinner></b-spinner>
      </div>
      <div class="member-item" v-if="!isLoading && showItem">
        <div class="item-left d-flex align-items-center justify-content-start">
          <b-img class="avatar" :src="userInfo.pictures"
                 blank-color="yellow"
          ></b-img>
          <span class="address">{{shortAddress}}</span>
        </div>
        <div class="item-right d-flex align-items-center justify-content-end">
          <MarketDropdown
            class="dropdown"
            :options="options"
            @input="changeRole" v-model="selectedRole"
            :disabled="this.role !== 1"
          >
          </MarketDropdown>
          <b-overlay
            :show="isConfirming"
          >
            <b-button
              variant="primary"
              pill
              class="confirm-button"
              @click="tapConfirm"
            >
              {{ $t('v11.confirm') }}
            </b-button>
          </b-overlay>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MarketDropdown from '@/components/market-dropdown/index.vue';
import testAvatar from '@/assets/img/icon-talk.png';
import Web3 from 'web3';
import { ellipsisThree } from '@/common/filter';
import { fetchUserInfo } from '@/common/api/user-repository';
import { addMember, findRole } from '@/common/api/space-repository';
import ToastMixin from '@/mixins/toast-mixin';

export default {
  name: 'add-member-page',
  components: { MarketDropdown },
  mixins: [ToastMixin],
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      inputValue: '',
      options: [
        { name: this.$t('v11.manager'), value: 2 },
        { name: this.$t('project.edit.member'), value: 3 },
      ],
      selectedRole: { name: this.$t('v11.manager'), value: 2 },
      testAvatar,
      isLoading: false,
      userInfo: null,
      isConfirming: false,
    };
  },
  computed: {
    showItem() {
      return Web3.utils.isAddress(this.inputValue);
    },
    shortAddress() {
      if (this.userInfo && this.userInfo.name && this.userInfo.name.length > 0) {
        return this.userInfo.name;
      }
      return ellipsisThree(this.inputValue);
    },
    addressIsValid() {
      if (this.inputValue.length > 0) {
        return Web3.utils.isAddress(this.inputValue);
      }
      return true;
    },
  },
  methods: {
    changeRole(value) {
      this.selectedRole = value;
    },
    async inputChange(value) {
      if (Web3.utils.isAddress(value)) {
        this.isLoading = true;
        try {
          const res = await fetchUserInfo({ address: value });
          this.userInfo = res.response;
          this.isLoading = false;
        } catch (e) {
          this.isLoading = false;
          console.error(e);
        }
      }
    },
    async tapConfirm() {
      this.isConfirming = true;
      try {
        await addMember({
          address: this.$store.state.connect.address,
          projectCode: this.code,
          userAddress: this.inputValue,
          role: this.selectedRole.value,
        });
        this.successToast('Add success!');
        this.isConfirming = false;
        this.inputValue = '';
      } catch (e) {
        this.inputValue = '';
        this.$refs.input.focus();
        this.isConfirming = false;
        this.errorToast(e.message);
      }
    },
    async loadData() {
      const res = await findRole({
        project: this.code,
        address: localStorage.getItem('address'),
      });
      this.role = res.response;
      if (this.role === 2) {
        this.selectedRole = { name: this.$t('project.edit.member'), value: 3 };
      }
    },
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  },
  watch: {
    '$store.state.connect.address': function () {
      this.loadData();
    },
  },
};
</script>

<style scoped lang="scss">
.add-member__container {
  @include centered-view;
  margin: 21.33vw auto 10vw auto;
  padding: 0 8vw;
  @include media-breakpoint-up(md) {
    padding: 0 30px;
    margin: 80px auto 80px auto;
  }
  .add-member__content {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    .add-member__title {
      @include FontB;
      font-size: 6.4vw;
      font-weight: bold;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      color: #000;
      margin: 13.33vw 0 0 0;
      @include media-breakpoint-up(md) {
        font-size: 30px;
        margin: 60px 0 0 0;
      }
    }
    .add-member__input {
      @include FontM;
      font-size: 8vw;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: -0.6px;
      color: #000;
      border: none;
      outline: none;
      box-shadow: none;
      padding: 0;
      margin: 5.33vw 0 0 0;
      @include media-breakpoint-up(md) {
        font-size: 30px;
        margin: 20px 0 0 0;
      }
    }
    .member-item {
      padding: 4.8vw 4.53vw;
      background: #f4f5f6;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      grid-gap: 2.667vw;
      border-radius: 3.2vw;
      margin-top: 10.667vw;
      @include media-breakpoint-up(md) {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        grid-gap: 0;
        border-radius: 12px;
        margin-top: 40px;
        padding: 20px 30px;
      }
      .item-left, .item-right {
        grid-gap: 2.4vw;
        @include media-breakpoint-up(md) {
          grid-gap: 20px;
        }
      }
      .avatar {
        width: 10.67vw;
        height: 10.67vw;
        @include media-breakpoint-up(md) {
          width: 40px;
          height: 40px;
        }
      }
      .address {
        opacity: 0.6;
        @include FontM;
        font-size: 3.2vw;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #000;
        @include media-breakpoint-up(md) {
          font-size: 14px;
        }
      }
    }
  }
}

.alert-text {
  color: indianred;
}

</style>
