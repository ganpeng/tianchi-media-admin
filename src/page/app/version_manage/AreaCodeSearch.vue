<template>
    <el-autocomplete
        v-model="qs"
        :fetch-suggestions="querySearchAsync"
        value-key="name"
        placeholder="请输入内容"
        @select="selectHandler"
    >
        <i v-if="showDeleteBtn" slot="suffix" @click="clearHandler" class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
    </el-autocomplete>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
    name: 'ChannelTypeSearch',
    props: {
        showDeleteBtn: {
            type: Boolean,
            default: false
        },
        handleSelect: {
            type: Function,
            default: () => {}
        },
        clearHandler: {
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
            filialeList: 'appVersion/filialeList'
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
.close-btn {
    color: #909399;
    cursor: pointer;
}
</style>
