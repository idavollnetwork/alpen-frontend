const InfiniteScrollMixin = {
  data() {
    return {
      items: [],
      currentPage: 1,
      isLoading: false, // 是否正在加载
      isLoadingList: false, // 是否正在加载
      noMore: false,
    };
  },
  methods: {
    handleData(response) {
      const list = response.dataList;
      this.noMore = response.currentPage >= response.totalPage;
      if (this.currentPage === 1) {
        this.items = list;
        this.currentPage += 1;
      } else if (list !== null && list.length > 0) {
        this.items = this.items.concat(list);
        this.currentPage += 1;
      }
      this.isLoading = false;
      this.isLoadingList = false;
      return this.items;
    },
  },
};

export default InfiniteScrollMixin;
