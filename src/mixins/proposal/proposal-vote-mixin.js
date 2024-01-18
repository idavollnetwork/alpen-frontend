import BigNumber from 'bignumber.js';

const ProposalVoteMixin = {
  data() {
    return {
      userBalance: '0',
    };
  },
  computed: {
    balanceRemain() {
      let number = 0;
      // rule = 1, 是根据代币 2 每个地址一票
      if (this.proposalInfo.rule === 1) {
        const bn = new BigNumber((`${this.userBalance}`));
        let str = '1';
        for (let i = 0; i < this.decimals; i += 1) {
          str += 0;
        }
        number = bn.dividedBy(new BigNumber(str));
        const ratio = this.proposalInfo.projectInfoVo.mapping;
        number = number.multipliedBy(ratio);
      } else if (this.proposalInfo.rule === 2) {
        number = 1;
      }
      let total = 0;
      this.proposalInfo.optionInfoVos.forEach((item) => {
        total += parseInt(item.userVoteNum, 10);
      });
      return number - total;
    },
  },
};

export default ProposalVoteMixin;
