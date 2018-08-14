<!--列表拖动排序组件-->
<template>
    <el-dialog :title="title"
               visible
               width="80%"
               v-on:close="closeDialog">
        <ul id="sort-list">
            <li v-for="(item, index) in sourceList"
                :key="index"
                :data-id="item[uniqueKey]">
                <el-tooltip :content="item[displayKey]" placement="bottom" effect="light">
                    <el-button>{{index + 1}}.{{item[displayKey].slice(0,8)}}</el-button>
                </el-tooltip>
            </li>
        </ul>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="confirmSort">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        name: 'SortDialog',
        props: {
            sourceList: {
                type: Array,
                default: () => []
            },
            displayKey: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
            uniqueKey: {
                type: String,
                default: ''
            },
            sortKey: {
                type: String,
                default: ''
            }
        },
        data() {
            return {};
        },
        mounted() {
            this.initDragula();
        },
        methods: {
            initDragula() {
                this.$nextTick(function () {
                    // 拖拽设置
                    this.$dragula([document.getElementById('sort-list')], {
                        direction: 'horizontal'
                    });
                });
            },
            closeDialog() {
                this.$emit('closeDialog');
            },
            // 确定排序
            confirmSort() {
                this.$emit('setSortedList', this.sortList());
            },
            sortList() {
                let sortedList = [];
                let nodeList = this.$el.querySelectorAll('#sort-list li');
                for (let i = 0; i < nodeList.length; i++) {
                    for (let k = 0; k < this.sourceList.length; k++) {
                        if (nodeList[i].getAttribute('data-id') === this.sourceList[k][this.uniqueKey]) {
                            sortedList.push(this.sourceList[k]);
                        }
                    }
                }
                let sortIndex = 0;
                for (let m = 0; m < this.sourceList.length; m++) {
                    sortedList[m][this.sortKey] = sortIndex++;
                }
                return sortedList;
            }
        }
    };
</script>
<style lang="less" scoped>

    ul {
        display: flex;
        padding: 0px 20px 20px 20px;
        border: 1px solid gray;
        flex-wrap: wrap;
        li {
            margin-right: 20px;
            margin-top: 20px;
            border-radius: 5px;
            text-align: center;
            color: #fff;
            font-size: 16px;
            cursor: grab;
        }
    }

    /*
    * 设置拖拽效果样式
    */

    .gu-mirror {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        background-color: rgba(0, 0, 0, 0.2);
        transition: opacity 0.4s ease-in-out;
        margin-right: 20px;
        margin-top: 20px;
        border-radius: 5px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        cursor: grab;
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

</style>
