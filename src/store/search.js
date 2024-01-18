const SearchModule = {
  state: {
    isBlur: true,
    isFocus: false,
    inputValue: '',
    filter: '',
    showResPage: false,
  },
  mutations: {
    blur(state) {
      state.isBlur = true;
      state.isFocus = false;
      state.showResPage = state.inputValue.length > 0;
    },
    focus(state) {
      state.isBlur = false;
      state.isFocus = true;
      state.showResPage = state.inputValue.length > 0;
    },
    didInput(state, params) {
      state.inputValue = params.value;
      state.showResPage = state.inputValue.length > 0;
    },
    changeFilter(state, params) {
      state.filter = params.value;
    },
    clearSearch(state) {
      state.inputValue = '';
      state.showResPage = false;
    },
  },
};

export default SearchModule;
