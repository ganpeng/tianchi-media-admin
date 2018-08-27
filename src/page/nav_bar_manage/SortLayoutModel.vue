<!--内容管理-栏目管理-栏目布局模块排序组件-->
<template>
    <div class="sort-layout-model">
        <h3>模块排序</h3>
        <ul id="model-list" v-dragula="{direction: 'vertical'}">
            <li v-if="item.subjectId || item.renderType === 'SHUFFLE'"
                :data-sign="item.sign"
                v-for="(item, index) in list" :key="index">
                <label>{{index + 1}}</label>
                <span class="ellipsis-one">{{item.title}}</span>
            </li>
        </ul>
        <el-button @click="sortModelList" type="success" plain class="btn">确定</el-button>
        <i class="el-icon-close" @click="cancelSort"></i>
    </div>
</template>

<script>
    export default {
        name: 'SortLayoutModel',
        props: {
            navBarId: {
                type: String,
                default: ''
            },
            navBarSignCode: {
                type: String,
                default: ''
            },
            modelInfoList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        computed: {
            list() {
                return this.modelInfoList.filter(item => {
                    return item.subjectId || item.renderType === 'SHUFFLE';
                });
            }
        },
        data() {
            return {};
        },
        mounted() {
        },
        methods: {
            cancelSort() {
                this.$emit('closeSortSlide', false);
            },
            // 更新模块排序
            sortModelList() {
                let nodes = this.$el.querySelectorAll('#model-list li');
                let modelSubjectSignList = [];
                for (let i = 0; i < nodes.length; i++) {
                    modelSubjectSignList.push(nodes[i].getAttribute('data-sign'));
                }
                this.$store.commit('layout/sortModelList', {
                    navBarId: this.$route.params.navBarId,
                    navBarSignCode: this.$route.params.navBarSignCode,
                    modelSubjectSignList: modelSubjectSignList,
                    sortList: this.modelInfoList
                });
                this.$message({
                    message: '模块成功排序',
                    type: 'success'
                });
                this.$emit('closeSortSlide', true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .sort-layout-model {
        position: absolute;
        display: flex;
        flex-direction: column;
        right: 0px;
        top: 64px;
        bottom: 64px;
        width: 300px;
        background: rgba(240, 242, 245, 0.95);
        text-align: center;
        box-shadow: -4px 0 20px 0 rgba(0, 0, 0, 0.20);
        z-index: 1000;
        overflow: hidden;
    }

    h3 {
        flex-grow: 0;
        flex-shrink: 0;
        background-color: $generalBgColor;
        height: 80px;
        line-height: 80px;
        text-align: center;
        color: $baseAsideColor;
        border-bottom: 1px solid $grayLineColor;
    }

    ul {
        flex-grow: 2;
        flex-shrink: 1;
        margin-bottom: 100px;
        overflow-y: scroll;
        li {
            display: flex;
            margin-top: 20px;
            height: 40px;
            label {
                flex-shrink: 0;
                width: 60px;
                line-height: 40px;
            }
            span {
                flex-grow: 2;
                margin-right: 20px;
                padding: 0px 16px;
                background: #DCDFE6;
                border: 1px solid $baseAsideColor;
                color: $baseAsideColor;
                border-radius: 20px;
                line-height: 40px;
                cursor: grab;
                &:hover {
                    border: 1px solid $baseBlue;
                    color: $baseBlue;
                }
            }
        }
    }

    .btn {
        position: absolute;
        flex-grow: 0;
        flex-shrink: 0;
        bottom: 20px;
        right: 18px;
        width: 262px;
    }

    i {
        position: absolute;
        right: 10px;
        top: 30px;
        font-size: 16px;
        color: #909399;
        cursor: pointer;
        &:hover {
            color: $baseRed;
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
        display: flex;
        margin-top: 20px;
        height: 40px;
        label {
            flex-shrink: 0;
            width: 60px;
            line-height: 40px;
            text-align: center;
        }
        span {
            flex-grow: 2;
            margin-right: 20px;
            text-align: center;
            padding: 0px 16px;
            background: #DCDFE6;
            border: 1px solid $baseAsideColor;
            color: $baseAsideColor;
            border-radius: 20px;
            line-height: 40px;
            cursor: grab;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

</style>
