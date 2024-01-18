const ProposalMixin = {
  data() {
    return {
      proposalStatus: -1,
    };
  },
  computed: {
    status() {
      switch (this.proposalStatus) {
        case 0:
          return this.$t('proposal.item.pending');
        case 1:
          return this.$t('proposal.item.ongoing');
        case 2:
          return this.$t('proposal.item.finish');
        default:
          return this.$t('proposal.item.pending');
      }
    },
  },
};

export default ProposalMixin;
