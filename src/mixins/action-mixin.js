const ActionMixin = {
  methods: {
    actionTitle(type) {
      switch (type) {
        case 1:
          return this.$t('user.followU');
        case 2:
          return this.$t('user.followP');
        case 3:
          return this.$t('user.publishP');
        case 4:
          return this.$t('user.voteP');
        case 5:
          return this.$t('user.createP');
        default:
          return '';
      }
    },
    tapAction(action) {
      switch (action.type) {
        case 1:
          this.push(`/user-center/${action.usersInfoVo.address}`);
          break;
        case 2:
          this.push(`/project-detail/${action.project.code}`);
          break;
        case 3:
          this.push(`/proposal-detail/${action.proposal.ipfsHash}`);
          break;
        case 4:
          this.push(`/proposal-detail/${action.proposal.ipfsHash}`);
          break;
        default:
          break;
      }
    },
  },

};

export default ActionMixin;
