<template>
    <el-autocomplete
        v-model="qs"
        :fetch-suggestions="querySearchAsync"
        value-key="name"
        placeholder="请选择类型"
        @select="selectHandler"
    ></el-autocomplete>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
export default {
    name: 'TypeSearch',
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
            typeListOptions: 'programme/typeListOptions'
        })
    },
    methods: {
        ...mapMutations({
            addTypeToList: 'programme/addTypeToList'
        }),
        querySearchAsync(queryString, cb) {
            var results = queryString ? this.typeListOptions.filter(this.createStateFilter(queryString)) : this.typeListOptions;
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
