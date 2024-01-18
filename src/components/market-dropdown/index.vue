<template>
  <div class="popper-container">
    <multiselect
      :value="value"
      :options="options"
      :searchable="false"
      :show-labels="false"
      :show-pointer="false"
      :allow-empty="false"
      :disabled="disabled"
      @open="handleOpen"
      @close="handleClose"
      @input="handleInput"
    >
      <template slot="caret">
        <span
          class="caret"
          :class="{rotate: isOpen}"
        >
          <IconArrowOutline
            color="rgba(0,0,0,0.2)"
            class="icon-arrow"
          />
        </span>
      </template>
      <template
        slot="singleLabel"
        slot-scope="props"
      >
        <span class="option__title">{{ props.option.name }}
        </span>
      </template>
      <template
        slot="option"
        slot-scope="props"
      >
        <span class="option__title">{{ props.option.name }}</span>
      </template>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import IconArrowOutline from '@/components/icons/IconArrowOutline.vue';

export default {
  name: 'MarketDropdown',
  components: { IconArrowOutline, Multiselect },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
    handleOpen() {
      this.isOpen = true;
    },
    handleClose() {
      this.isOpen = false;
    },
  },
  mounted() {
  },
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss">

.popper-container {
  ::v-deep .multiselect {
    background-color: transparent;
    .multiselect__tags {
      background-color: transparent;
      border-radius: 12px;
      border: 1px rgba(0,0,0,0.1) solid;
    }
    .multiselect__single {
      background-color: transparent;
      color: black;
    }
    .caret {
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
      &.rotate {
        transform: rotateZ(180deg);
      }
      .icon-arrow {
        width: 20px;
        height: 20px;
      }
    }
  }
  ::v-deep .multiselect__content-wrapper {
    box-shadow: 0 0 5px rgba(0,0,0,0.1);
    background-color: white;
    //border: 2px rgba(0,0,0,0.1) solid;
    border-radius: 12px;
    .multiselect__option {
      transition: background-color 0.1s linear;
      color: black;
      &:hover {
        background-color: rgba(0,0,0, 0.1);
      }
    }
    .multiselect__option--selected {
      background-color: rgba(0,0,0, 0.15);
      &:hover {
        background-color: rgba(0,0,0, 0.15);
      }
    }
  }
}

.option__title {
  font-size: 14px;
  @include FontB;
  color: black;
}

</style>
