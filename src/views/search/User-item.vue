<template>
  <div id="search-user-item">
    <b-img id="icon" rounded="circle" :src="item.pictures"></b-img>
    <div id="right-content">
      <span id="name-text">{{item.name}}</span>
      <span id="address-text">{{address}}</span>
    </div>
  </div>
</template>

<script>
import { ellipsisThree } from '@/common/filter';

export default {
  name: 'User-item',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    address() {
      return ellipsisThree(this.item.address);
    },
  },
};
</script>

<style scoped lang="scss">
#search-user-item  {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  #icon {
    width: 14.13vw;
    height: 14.13vw;
    @include gradient-border-red(14.13vw, 2px);
    @include media-breakpoint-up(md) {
      width: 54px;
      height: 54px;
      @include gradient-border-red(54px, 2px);
    }
  }
  #right-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin: 0 0 0 1.867vw;
    height: 100%;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 12px;
    }
    #name-text {
      @include FontM;
      font-weight: 500;
      color: #000000;
      font-size: 4.27vw;
      line-height: 6.4vw;
      @include media-breakpoint-up(md) {
        font-size: 18px;
        line-height: 27px;
      }
    }
    #address-text {
      @include FontR;
      opacity: 0.6;
      font-weight: 400;
      color: #000000;
      font-size: 3.73vw;
      line-height: 4.5vw;
      @include media-breakpoint-up(md) {
        font-size: 13px;
        line-height: 20px;
      }
    }
  }
}
</style>
