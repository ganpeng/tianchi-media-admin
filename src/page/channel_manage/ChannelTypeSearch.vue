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
            liveChannelTypeList: 'channel/liveChannelTypeList'
        })
    },
    methods: {
        querySearchAsync(queryString, cb) {
            var results = queryString ? this.liveChannelTypeList.filter(this.createStateFilter(queryString)) : this.liveChannelTypeList;
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
