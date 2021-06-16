<template>
  <el-autocomplete
    v-model="qs"
    :fetch-suggestions="querySearchAsync"
    value-key="name"
    placeholder="请输入内容"
    @select="selectHandler"
  ></el-autocomplete>
</template>
<script>
export default {
  name: 'SearchInput',
  props: {
    restaurants: {
      type: Array,
      default: () => []
    },
    handleSelect: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      qs: ''
    };
  },
  methods: {
    querySearchAsync(queryString, cb) {
      let results = queryString
        ? this.restaurants.filter(this.createStateFilter(queryString))
        : this.restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    selectHandler(category) {
      this.handleSelect(category);
      this.qs = '';
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
