<!--栏目管理-栏目项设置-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目项设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <div class="block-title">现有栏目及排序</div>
            <el-tag type="success">固定栏目</el-tag>
            <ul class="fixed">
                <li v-for="(item,index) in fixedColumn" v-bind:key="index">
                    <el-card class="box-card" :body-style="elCardBodyStyle">
                        <label>{{item.name}}</label>
                    </el-card>
                </li>
            </ul>
            <el-tag type="success">可调整栏目</el-tag>
            <ul class="flexible" id="flexible">
                <li v-for="(item,index) in flexibleColumn" v-bind:key="index"
                    :class="{'disabled-column':!item.isExist}">
                    <el-card class="box-card" :body-style="elCardBodyStyle">
                        <label>{{item.name}}</label>
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            v-model="item.isExist"
                            :active-color="activeColor"
                            @change="switchDisplay">
                        </el-switch>
                    </el-card>
                </li>
            </ul>
            <el-tag type="success">栏目项预览</el-tag>
            <ul class="preview" id="preview">
                <li v-for="(item,index) in previewColumn" v-bind:key="index">
                    <el-tag>{{item.name}}</el-tag>
                </li>
            </ul>
            <el-button type="primary" @click="prePublish">预发布</el-button>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'ColumnsSetting',
        data() {
            return {
                elCardBodyStyle: {
                    'display': 'flex',
                    'justify-content': 'space-around',
                    'flex-direction': 'column',
                    'padding': '0px',
                    'height': '100%',
                    'width': '100%'
                },
                activeColor: '#13ce66',
                fixedColumn: [
                    {name: '搜索'},
                    {name: '我的'},
                    {name: '今日推荐'},
                    {name: '直播'}
                ],
                flexibleColumn: [
                    {name: '电视剧', isExist: true},
                    {name: '电影', isExist: true},
                    {name: '娱乐', isExist: true},
                    {name: '网视专区', isExist: true},
                    {name: '佳家易购', isExist: true},
                    {name: '新闻', isExist: true},
                    {name: '儿童', isExist: true},
                    {name: '体育', isExist: true},
                    {name: '纪实', isExist: true}
                ],
                previewColumn: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let that = this;
                // 初始化栏目项预览
                this.previewColumn = this.fixedColumn.concat(this.flexibleColumn);
                // 拖拽设置
                this.$dragula([document.getElementById('flexible')], {
                    // 设置隐藏栏目不可以拖动
                    moves: function (el) {
                        return !el.classList.contains('disabled-column');
                    },
                    direction: 'horizontal'
                }).on('drop', function () {
                    that.preview();
                });
            },
            // 显示、隐藏事件处理
            switchDisplay() {
                this.$nextTick(function () {
                    this.preview();
                });
            },
            // 预览栏目调整情况
            preview() {
                let nodes = this.$el.querySelectorAll('#flexible li:not(.disabled-column)');
                let array = [];
                for (let i = 0; i < nodes.length; i++) {
                    array.push({name: nodes[i].querySelector('label').innerText});
                }
                this.previewColumn = this.fixedColumn.concat(array);
            },
            // 预发布
            prePublish() {
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .block-title {
        padding: 30px 0 20px 20px;
        line-height: 2;
        text-align: left;
        font-size: 22px;
    }

    .el-row {
        text-align: left;
        /*固定栏目*/
        ul.fixed {
            display: flex;
            justify-content: space-around;
            li {
                height: 120px;
                width: 120px;
                border: 1px solid #13ce66;
                label {
                    font-size: 16px;
                    color: #13ce66;
                }
            }
        }
        /*可调整栏目*/
        .flexible {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 160px;
            li {
                height: 120px;
                width: 120px;
                border: 1px solid #13ce66;
                label {
                    color: #13ce66;
                }
                &.disabled-column {
                    border: 1px dotted gray;
                    label {
                        color: gray;
                    }
                }
            }
        }
        /*预览*/
        .preview {
            display: flex;
            justify-content: flex-start;
            li {
                margin-right: 20px;
            }
        }
        .el-tag {
            margin-top: 30px;
            margin-bottom: 15px;
            &:first-child {
                margin-top: 0px;
            }

        }
        .el-card {
            height: 100%;
            width: 100%;
            text-align: center;
        }
        .el-switch {
            display: inline-block;
            text-align: center;
        }
        .el-button {
            display: block;
            margin: 30px auto;
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
        .el-card {
            height: 100%;
            width: 100%;
            text-align: center;
        }
        .el-switch {
            display: inline-block;
            text-align: center;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

</style>
