<template>
  <div class="vote-modal__container">
    <b-modal id="bv-modal-example" hide-footer hide-header v-model="showModal" centered>
      <b-overlay :show="!loading" v-if="showModal">
        <div id="modal-content" v-if="showModal">
          <div id="vote-title__content">
            <span id="vote-title">{{ $t('confirmVote') }}</span>
            <b-button @click="tapCancel" id="cancel-button">
              <IconCancel></IconCancel>
            </b-button>
          </div>
          <span id="vote-message">
          {{subtitle}}
        </span>
          <div
            class="vote-container
           d-flex align-items-stretch flex-column justify-content-start w-100"
            v-for="(item, index) in selected"
            :key="item.id"
          >
            <span id="vote-input-name">{{ item.body }}</span>
            <b-input-group id="vote-input">
              <b-form-input
                type="number"
                :placeholder="$t('enterYourVotes')"
                :state="voteState(index)"
                v-model="inputValues[index]"
                trim
                :disabled="isAddressCount"
                @input="didInput(index)"
              >
              </b-form-input>
              <b-input-group-append>
                <b-button
                  @click="tapMax(index)"
                  variant="outline-primary">MAX</b-button>
              </b-input-group-append>
            </b-input-group>

            <span class="error-text" v-if="!voteState(index)">
            {{inputErrorStr(index)}}
          </span>
            <div id="info-container">
              <span class="info-title">{{ $t('currentVote') }}</span>
              <span class="info-value">{{ item.userVoteNum }} {{ unit }}</span>
            </div>
          </div>
          <div class="remaining-content">
            <span class="info-title">{{ $t('remainingVotes') }}</span>
            <span class="info-value">{{ balanceRemain.toLocaleString() }} {{ unit }}</span>
          </div>
          <IvButton
            type="blue"
            :circle="true"
            id="vote-button"
            @click="tapVote"
            :disabled="!canVote"
          >{{ $t('vote2') }}</IvButton>
          <IvButton type="gray"
                    :circle="true"
                    :outline="true"
                    id="cancel-button-bottom"
                    @click="hide">
            {{ $t('proposal.create.cancel') }}
          </IvButton>
        </div>
      </b-overlay>
    </b-modal>
  </div>
</template>

<script>
import ModalMixin from '@/views/modals/ModalMixin';
import IvButton from '@/components/IVButton/index.vue';
import IconCancel from '@/components/icons/IconCancel.vue';
import ToastMixin from '@/mixins/toast-mixin';
import Vue from 'vue';
import ProposalVoteMixin from '@/mixins/proposal/proposal-vote-mixin';
import { numberValidation } from '../../common/validation';

export default {
  name: 'VoteModal',
  components: { IconCancel, IvButton },
  mixins: [ModalMixin, ToastMixin, ProposalVoteMixin],
  props: {
    proposalInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    selected: {
      type: Array,
      default() {
        return [];
      },
    },
    threshold: {
      type: String,
      default: '0',
    },
    unit: {
      type: String,
      default: '',
    },
    decimals: {
      type: Number,
      default: 18,
    },
    voteRatio: {
      type: Number,
      default: 1,
    },
    rule: {
      type: Number,
      default: 1,
    },
  },
  mounted() {
  },
  data() {
    return {
      inputValues: [],
      loading: true,
      addressCountValue: 1,
    };
  },
  computed: {
    canVote() {
      let flag = true;
      if (this.inputValues.length === 0) {
        flag = false;
      }
      this.inputValues.forEach((item, index) => {
        if (this.voteState(index) === false) {
          flag = false;
        }
      });
      return flag;
    },
    subtitle() {
      if (this.selected.length === 1) {
        return `Are you sure you want to vote "${this.selected[0].body}"?
            This action cannot be undone`;
      }
      const arr = [];
      this.selected.forEach((item) => {
        arr.push(`"${item.body}"`);
      });
      const content = arr.join(' and ');
      return `Are you sure you want to vote ${content}?
            This action cannot be undone`;
    },
    // 是否是一个地址一票
    isAddressCount() {
      return this.proposalInfo.rule === 2;
    },
    canUseBalance() {
      let total = this.balanceRemain;
      this.inputValues.forEach((item) => {
        let number = 0;
        if (item.length !== 0) {
          number = parseInt(item, 10);
        }
        total -= number;
      });
      return total;
    },
  },
  methods: {
    tapMax(index) {
      const oldNumber = this.inputValues[index];
      let aNumber = 0;
      if (oldNumber.length !== 0) {
        aNumber = parseInt(oldNumber, 10);
      }
      Vue.set(this.inputValues, index, this.canUseBalance + aNumber);
    },
    didInput(index) {
      if (parseInt(this.inputValues[index], 10) <= 0) {
        Vue.set(this.inputValues, index, 1);
      }
      Vue.set(this.inputValues, index, this.inputValues[index].replace(/[^\d]/g, ''));
    },
    didShow() {
      // 初始化输入数组
      this.selected.forEach((item, index) => {
        Vue.set(this.inputValues, index, '');
      });
      // 如果是 addressCount 规则, 固定智能投一票
      if (this.isAddressCount) {
        Vue.set(this.inputValues, 0, '1');
      }
      this.userBalance = this.$store.state.connect.userInfo.balance;
    },
    reset() {
      this.inputValues = [];
    },
    tapCancel() {
      this.hide();
    },
    tapVote() {
      this.hide();
      this.$emit('didInputVote', { value: this.inputValues });
    },
    voteState(index) {
      const threshold = parseInt(this.threshold, 10) || 0;
      if (this.inputValues.length >= index + 1) {
        const number = this.inputValues[index];
        return numberValidation({
          number,
          min: threshold,
          max: this.balanceRemain,
        }) && this.totalInputState();
      }
      return false;
    },
    // 输入总值是否小于帐户总值
    totalInputState() {
      if (this.inputValues.length === 0) {
        return true;
      }
      let num = 0;
      this.inputValues.forEach((item) => {
        let number = 0;
        if (item.length > 0) {
          number = parseInt(item, 10);
        }
        num += number;
      });
      return num <= this.balanceRemain;
    },
    inputErrorStr(index) {
      if (this.inputValues.length === 0) {
        return 'Please input your votes';
      }
      if (typeof this.inputValues[index] === 'undefined') {
        return '';
      }
      if (this.inputValues[index].length === 0) {
        return 'Please input your votes';
      }
      if (this.threshold > 0 && parseInt(this.inputValues[index], 10) < this.threshold) {
        return `The number of votes must be greater than or equal to ${this.threshold}`;
      }
      if (parseInt(this.inputValues[index], 10) > this.balanceRemain) {
        return `Your only have ${this.balanceRemain} votes`;
      }
      if (!this.totalInputState()) {
        return 'The total must not exceed the account balance';
      }
      return `error${index}`;
    },
  },
};
</script>

<style scoped lang="scss">
#modal-content {
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  #vote-title__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    #vote-title {
      @include FontM;
      font-size: 24px;
      font-weight: 500;
      color: #000000;
      line-height: 33px;
    }
    #cancel-button {
      width: 40px;
      height: 40px;
      padding: 0;
      background: transparent;
      box-shadow: none;
      border: none;
    }
  }
  #vote-message {
    @include FontR;
    font-size: 16px;
    font-weight: 400;
    color: #23262F;
    line-height: 24px;
    margin: 38px 0 0 0;
  }
  #vote-input-name {
    font-size: 14px;
    @include FontM;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
    opacity: 0.6;
    margin: 31px 0 0 0;
  }
  #vote-input {
    @include FontM;
    font-size: 24px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
    margin: 10px 0 0 0;
    border: none;
    border-bottom: 1px #E6E8EC solid;
    &::placeholder {
      color: rgba(0,0,0,0.3);
    }
  }
  .error-text {
    font-size: 12px;
    @include FontR;
    color: #dc3545;
    margin-top: 5px;
    margin-left: 10px;
  }
  #info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 15px 0 0 0;
    //#left-content {
    //  display: flex;
    //  flex-direction: column;
    //  align-items: flex-start;
    //  justify-content: flex-start;
    //}
    //#right-content {
    //  display: flex;
    //  flex-direction: column;
    //  align-items: flex-end;
    //  justify-content: flex-start;
    //}
    .info-title {
      font-size: 14px;
      @include FontSB;
      font-weight: 600;
      color: #000000;
      opacity: 0.3;
    }
    .info-value {
      @include FontM;
      font-size: 16px;
      font-weight: 500;
      color: #23262F;
      margin: 10px 0 0 0;
    }
  }
  .remaining-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 3px 12px;
    background: #F4F5F6;
    border-radius: 20px;
    margin-top: 30px;
    .info-title {
      font-size: 14px;
      @include FontSB;
      font-weight: 600;
      color: #000000;
      opacity: 0.3;
    }
    .info-value {
      font-size: 14px;
      color: #000000;
      opacity: 0.3;
    }
  }
  #vote-button {
    margin: 37px 0 0 0;
    font-size: 16px;
  }
  #cancel-button-bottom {
    margin: 7px 0 0 0;
    font-size: 16px;
  }

}
</style>
