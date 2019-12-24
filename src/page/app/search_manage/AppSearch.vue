<template>
    <div class="search-container">
        <h2 class="content-title">搜索管理</h2>
        <div class="seperator-line"></div>
        <div class="btn-wrapper">
            <el-button v-if="list.length === 0" class="btn-style-two" type="primary" @click="initData">初始化</el-button>
            <el-button class="btn-style-two" type="primary" @click="toggleEditHandler">
                {{isEdit ? '完成' : '编辑'}}
            </el-button>
        </div>
        <p class="tips"><i>*</i>每条不超过10个字</p>
        <draggable element="ul" class="search-list clearfix" v-model="list">
            <li v-for="(item, index) in list" :key="index" :class="['search-item', isEdit && item.focus ? 'is-active' : '']">
                <div class="wrapper">
                    <span class="index">{{index + 1}}</span>
                    <input
                        class="name-input"
                        placeholder="请填写新的搜索关键字"
                        v-if="isEdit"
                        :value="item.name"
                        type="text"
                        maxlength="10"
                        @input="searchItemChangeHandler($event, index)"
                        @focus="searchItemFocusHandler($event, index)">
                    <span v-else class="search-name">{{item.name}}</span>
                </div>
            </li>
        </draggable>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveSearchHandler">保存</el-button>
        </div>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import _ from 'lodash';
export default {
    name: 'AppSearch',
    components: { draggable },
    data() {
        return {
            list: [],
            isEdit: false
        };
    },
    async created() {
        try {
            if (!this.$authority.isHasAuthority('content:hotSearch:list')) {
                return;
            }

            let res = await this.$service.getAppHotSearch();
            if (res && res.code === 0) {
                this.list = res.data;
            }
        } catch (err) {
            console.log(err);
        }
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    methods: {
        initData() {
            let list = _.times(20, (index) => {
                return {
                    name: '',
                    focus: false
                };
            });
            this.list = list;
        },
        searchItemChangeHandler(e, index) {
            let _index = this.list.findIndex((item) => {
                return item.name === e.target.value;
            });
            if (_index >= 0) {
                this.$message.error(`${e.target.value}已经存在`);
                return false;
            } else {
                this.list[index].name = e.target.value;
            }
        },
        async saveSearchHandler() {
            try {
                let emptyIndex = this.list.findIndex((item) => item.name === '');
                if (emptyIndex >= 0) {
                    this.$message.error('热搜关键字不能为空');
                    return false;
                }
                let hotSearchList = this.list.map((item, index) => {
                    item.sort = index;
                    return item;
                });
                let res = await this.$service.postAppHotSearch(hotSearchList);
                if (res && res.code === 0) {
                    this.$message.success('保存成功');
                    this.isEdit = false;
                }
            } catch (err) {
                console.log(err);
            }
        },
        toggleEditHandler() {
            this.isEdit = !this.isEdit;
            this.list = this.list.map((item) => {
                item.focus = false;
                return item;
            });
        },
        searchItemFocusHandler(e, index) {
            this.list = this.list.map((item, _index) => {
                if (_index === index) {
                    item.focus = true;
                    item.name = e.target.value;
                } else {
                    item.focus = false;
                }
                return item;
            });
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
        cursor: pointer;
        &.is-active {
            border-color: $mainColor;
        }
        &.sortable-drag {
            background: #293550;
            border: 1px solid #637497;
        }
        .wrapper {
            display: flex;
            align-items: center;
            height: 32px;
            .index {
                width: 32px;
                height: 32px;
                line-height: 32px;
                color: #6F7480;
                border-right: 1px solid #3E495E;
            }
            .search-name {
                color:#6F7480;
                flex: 1;
                height: 32px;
                line-height: 32px;
                text-indent: 10px;
                text-align: left;
            }
            .name-input {
                color: #fff;
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
<style lang="scss">
.search-list {
    .search-item {
        &.is-active {
            border-color: $mainColor;
        }
    }
}
</style>
