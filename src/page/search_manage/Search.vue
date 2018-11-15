<template>
    <div class="search-container">
        <h2 class="content-title">搜索管理</h2>
        <div class="seperator-line"></div>
        <div class="btn-wrapper">
            <el-button class="btn-style-two" type="primary" @click="toggleEditHandler">编辑</el-button>
        </div>
        <p class="tips"><i>*</i>每条不超过10个字</p>
        <ul class="search-list clearfix">
            <li v-for="(item, index) in list" :key="index" class="search-item">
                <div class="wrapper">
                    <span class="index">{{index + 1}}</span>
                    <input class="name-input" placeholder="请填写新的搜索关键字" v-if="isEdit" :value="item.temp" type="text" @change="searchItemChangeHandler($event, index)">
                    <span v-else class="search-name">{{item.keyword}}</span>
                </div>
            </li>
        </ul>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveSearchHandler">保存</el-button>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
    name: 'Search',
    data() {
        return {
            list: [],
            isEdit: false
        };
    },
    created() {
        this.$service.getHotSearch();
        this.generatorList();
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    methods: {
        searchItemChangeHandler(e, index) {
            this.list[index].keyword = e.target.value;
        },
        generatorList() {
            let list = _.times(20, () => {
                return {
                    keyword: ''
                };
            });
            this.list = list;
        },
        saveSearchHandler() {
            let hotSearchList = this.list.map((item, index) => {
                item.sort = index;
                return item;
            });

            this.$service.postHotSearch(hotSearchList);
        },
        toggleEditHandler() {
            this.isEdit = true;
        }
    }
};
</script>
<style lang="scss" scoped>
.btn-wrapper {
    margin-top: 20px;
    text-align: right;
}
.tips {
    font-size: 12px;
    color: #6F7480;
    line-height: 16px;
    text-align: left;
    i {
        color: $dangerColor;
    }
}

.search-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 10px;
    .search-item {
        width: 200px;
        height: 34px;
        line-height: 34px;
        border: 1px solid #3E495E;
        border-radius: 4px;
        margin-right: 20px;
        margin-bottom: 14px;
        .wrapper {
            display: flex;
            align-items: center;
            height: 32px;
            .index {
                width: 32px;
                height: 32px;
                line-height: 32px;
                border-right: 1px solid #3E495E;
            }
            .search-name {
                color: #fff;
                flex: 1;
                height: 32px;
                line-height: 32px;
                text-indent: 10px;
                text-align: left;
            }
            .name-input {
                color: #3E495E;
                height: 32px;
                line-height: 32px;
                text-indent: 10px;
                border: none;
                outline: none;
                &::-webkit-input-placeholder {
                    font-size: 12px;
                    color: #6F7480;;
                }
            }
        }
    }
}
</style>
