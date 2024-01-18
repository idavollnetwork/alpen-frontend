<template>
  <div class="proposal-information__container">
    <b-skeleton-wrapper :loading="loading">
      <template #loading>
        <b-container>
          <b-row>
            <b-col>
              <b-skeleton type="text"></b-skeleton>
              <b-row align-v="stretch">
                <b-col>
                  <b-skeleton type="avatar" size="54px"></b-skeleton>
                </b-col>
                <b-col class="m-1 d-flex flex-column justify-content-between">
                  <b-skeleton type="text" width="50px"></b-skeleton>
                  <b-skeleton type="text" width="50px"></b-skeleton>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </template>
      <span class="proposal-Information__userTitle">{{ title }}</span>
      <span class="proposal-Information__userItem">
      <b-img rounded="circle" class="proposal-Information__userIcon" :src="icon"></b-img>
      <span class="proposal-Information__userInfo">
        <span class="proposal-Information__userName">{{ name }}</span>
        <span class="proposal-Information__userNumber">{{ detail }}</span>
      </span>
    </span>
    </b-skeleton-wrapper>
  </div>
</template>

<script>
export default {
  name: 'proposal-user-item',
  props: {
    title: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    detail: {
      type: String,
      default: '',
    },
  },
  computed: {
    loading() {
      return this.icon === null || this.icon === undefined || this.icon.length === 0;
    },
  },
};
</script>

<style scoped lang="scss">
.proposal-information__container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  .proposal-Information__userTitle {
    @include FontM;
    font-size: 13px;
    font-weight: 500;
    color: #000000;
    line-height: 19px;
    opacity: 0.3;
  }
  .proposal-Information__userItem {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    margin: 10px 0 0 0;
    .proposal-Information__userIcon {
      width: 14.4vw;
      height: 14.4vw;
      flex-shrink: 0;
      @include media-breakpoint-up(md) {
        width: 54px;
        height: 54px;
      }
    }
    .proposal-Information__userInfo {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      margin: 0 0 0 10px;
      .proposal-Information__userName {
        @include FontM;
        font-size: 4.8vw;
        font-weight: 500;
        color: #000000;
        line-height: 6.4vw;
        @include media-breakpoint-up(md) {
          font-size: 18px;
          line-height: 27px;
        }
      }
      .proposal-Information__userNumber {
        @include FontR;
        font-size: 3.73vw;
        font-weight: 400;
        color: #000000;
        line-height: 5.33vw;
        opacity: 0.6;
        @include media-breakpoint-up(md) {
          font-size: 13px;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
