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
import {mapGetters} from 'vuex';
export default {
    name: 'ChannelTypeSearch',
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
            filialeList: 'channel/filialeList'
        })
    },
    methods: {
        querySearchAsync(queryString, cb) {
            let options = [{id: 1000, code: 880101, name: '全部'}, ...this.filialeList];
            var results = queryString ? options.filter(this.createStateFilter(queryString)) : options;
            cb(results);
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
            };
        },
        selectHandler(type) {
            this.handleSelect(type);
            this.qs = '';
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
