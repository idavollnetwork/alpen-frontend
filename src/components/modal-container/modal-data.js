import i18n from '@/i18n';

export function testData1() {
  return {
    title: i18n.t('mLoadingModal.title'),
    subtitle: '123',
    steps: [
      {
        title: i18n.t('mLoadingModal.approveHRC20'),
        subtitle: i18n.t('mLoadingModal.approveHRC20Detail'),
        state: 0,
      },
      {
        title: i18n.t('mLoadingModal.joinBid'),
        subtitle: i18n.t('mLoadingModal.joinBidDetail'),
        state: 0,
      },
    ],
  };
}

export function voteData() {
  return {
    title: i18n.t('vote'),
    subtitle: i18n.t('voteOnAProposal'),
    steps: [
      {
        title: i18n.t('sign'),
        subtitle: i18n.t('pleaseSignTheVoteInfoInYourWallet'),
        state: 0,
      },
      {
        title: i18n.t('vote2'),
        subtitle: i18n.t('voteOnThisProposal'),
        state: 0,
      },
    ],
  };
}

export function createData() {
  return {
    title: i18n.t('create'),
    subtitle: i18n.t('createOnAProposal'),
    steps: [
      {
        title: i18n.t('sign2'),
        subtitle: i18n.t('pleaseSignTheCreateInfoInYourWallet'),
        state: 0,
      },
      {
        title: i18n.t('create2'),
        subtitle: i18n.t('createOnThisProposal'),
        state: 0,
      },
    ],
  };
}

export function createProjectData() {
  return {
    title: i18n.t('createProject'),
    subtitle: i18n.t('createAProjectSpace'),
    steps: [
      {
        title: i18n.t('sign3'),
        subtitle: i18n.t('pleaseSignTheCreateInfoInYourWallet2'),
        state: 0,
      },
      {
        title: i18n.t('create3'),
        subtitle: i18n.t('createProjectSpace'),
        state: 0,
      },
    ],
  };
}
