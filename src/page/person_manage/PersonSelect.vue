<!-- 人物即时搜索 -->
<template>
    <span>
        <el-select
            :value="getValue"
            :disabled="disabled"
            multiple
            filterable
            remote
            placeholder="请输入人物名称"
            @change="changeHandler"
            :remote-method="searchHandler"
            :loading="isLoading">
            <el-option
                v-for="item in searchResult"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                    <span v-if="hasDesc" class="block" @mouseout="hideDescHandler" @mouseover="showDescHandler(item.id)">{{ item.name }}</span>
                    <span v-else class="block">{{ item.name }}</span>
            </el-option>
        </el-select>
        <p v-show="showDesc" class="person-prompt">
            {{getPersonDesc}}
        </p>
    </span>
</template>
<script>
import _ from 'lodash';
import {mapGetters, mapMutations, mapActions} from 'vuex';
export default {
    name: 'PersonSelect',
    props: {
        value: {
            type: Array,
            default: () => []
        },
        hasDesc: {
            type: Boolean,
            default: true
        },
        searchResult: {
            type: Array,
            default: () => []
        },
        changeSuccessHandler: {
            type: Function,
            default: () => {}
        },
        searchSuccessHandler: {
            type: Function,
            default: () => {}
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoading: false,
            showDesc: false
        };
    },
    computed: {
        getValue() {
            return this.value.map((item) => item.id);
        },
        ...mapGetters({
            getPersonDesc: 'person/getPersonDesc'
        })
    },
    methods: {
        ...mapMutations({
            updateHotPerson: 'person/updateHotPerson'
        }),
        ...mapActions({
            searchPerson: 'person/searchPerson'
        }),
        changeHandler(value) {
            this.changeSuccessHandler(value);
        },
        searchHandler: _.debounce(function(value) {
            this.isLoading = true;
            this.searchPerson(value)
                .then((res) => {
                    if (res && res.code === 0) {
                        let {list} = res.data;
                        this.searchSuccessHandler(list);
                    }
                }).finally(() => {
                    this.isLoading = false;
                });
        }, 300),
        showDescHandler(id) {
            this.showDesc = true;
            this.updateHotPerson({key: 'personId', value: id});
        },
        hideDescHandler() {
            this.showDesc = false;
            this.updateHotPerson({key: 'personId', value: ''});
        }
    }
};
</script>
<style lang="less" scoped>
.person-prompt {
    position:absolute;
    top:0;
    left:200px;
    width: 200px;
    line-height: 1.2em;
    padding: 5px;
    z-index: 1001;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-sizing: border-box;
    margin: 5px 0;
}
</style>
