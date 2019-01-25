<template>
    <el-autocomplete
        v-model="qs"
        :fetch-suggestions="querySearchAsync"
        value-key="name"
        placeholder="请选择播放平台"
        @select="selectHandler"
    ></el-autocomplete>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: 'PlatFormSearch',
    props: {
        handleSelect: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            restaurants: [],
            qs: ''
        };
    },
    computed: {
        ...mapGetters({
            global: 'programme/global'
        })
    },
    methods: {
        querySearchAsync(queryString, cb) {
            let restaurants = this.global.platformList.map((item) => {
                return {
                    name: item.value
                };
            });
            var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
            cb(results);
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
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
