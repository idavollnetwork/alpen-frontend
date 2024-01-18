<template>
  <div class="edit-rule__container">
    <span id="rule-title" class="subtitle-text">
                  {{ $t('v11.ruleTItle') }}
    </span>
    <span class="input-title d-flex align-items-center justify-content-between w-100">
        <span class="d-flex align-items-center">
          {{ $t('project.create.memberO') }}
          <IconHelp
            class="iconHelp"
            id="ruleMemberHelp"></IconHelp>
          <b-popover target="ruleMemberHelp"
                     triggers="hover focus"
                     placement="bottom">
            <span class="contract-desc">
              {{ $t('v11.ruleMember') }}
            </span>
          </b-popover>
        </span>
        <b-form-checkbox v-model="value.ruleMemberSelected" switch size="lg">
        </b-form-checkbox>
      </span>
    <cancelable-input
      v-for="(item, index) in value.members"
      :key="index"
      class="address-input-group"
      @tap-delete="tapDeleteAddress(index)"
      v-model="value.members[index]"
      :placeholder="$t('v11.addressPlaceholder')"
    >
    </cancelable-input>
    <b-button variant="outline-primary" pill @click="tapAddMember"
              class="mt-4 action-button">
      {{ $t('v11.addMember') }}
    </b-button>
    <span class="input-title d-flex align-items-center justify-content-between w-100">
          <span class="d-flex align-items-center">
              {{ $t('v11.ruleBalance') }}
            <IconHelp
              class="iconHelp"
              id="ruleBalanceHelp"></IconHelp>
            <b-popover target="ruleBalanceHelp"
                       triggers="hover focus"
                       placement="bottom">
              <span class="contract-desc">
                {{ $t('v11.ruleBalanceTip') }}
              </span>
            </b-popover>
          </span>
          <b-form-checkbox v-model="value.ruleThresholdSelected" switch size="lg"
                           @input="thresholdChange">
          </b-form-checkbox>
        </span>
      <span class="input-title">
        {{ $t('project.create.proposalD') }}
      </span>
    <b-input
      class="input-blank"
      placeholder="0"
      v-model="value.threshold"
      type="number"
      @input="inputValue"
    >
    </b-input>
  </div>
</template>

<script>
import CancelableInput from '@/components/cancelable-input.vue';
import IconHelp from '@/components/icons/IconHelp.vue';

export default {
  name: 'edit-project-rule',
  components: {
    CancelableInput,
    IconHelp,
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          ruleMemberSelected: true,
          members: [],
          threshold: '',
          ruleThresholdSelected: false,
        };
      },
    },
  },
  methods: {
    tapAddMember() {
      this.value.members.push('');
      this.$emit('input', this.value);
    },
    tapDeleteAddress(index) {
      this.value.members.splice(index, 1);
      this.$emit('input', this.value);
    },
    inputValue(value) {
      this.value.threshold = value;
      this.$emit('input', this.value);
    },
    thresholdChange(value) {
      this.value.ruleThresholdSelected = value;
      this.$emit('input', this.value);
    },
  },
};
</script>

<style scoped lang="scss">

.rule-title {
  display: flex;
  justify-content: space-between;
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

.address-input-group {
  margin: 5.33vw 0 0 0;
  @include media-breakpoint-up(md) {
    margin: 20px 0 0 0;
  }
}

.iconHelp {
  margin-left: 3.2vw;
  @include media-breakpoint-up(md) {
    margin-left: 10px;
  }
}

</style>
