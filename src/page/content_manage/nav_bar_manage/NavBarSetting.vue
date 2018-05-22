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
            <ul class="system">
                <li v-for="(item,index) in systemNavBarList" v-bind:key="index">
                    <el-card class="box-card" :body-style="elCardBodyStyle">
                        <label>{{item.name}}</label>
                    </el-card>
                </li>
            </ul>
            <el-tag type="success">可调整栏目</el-tag>
            <ul class="custom" id="custom">
                <li v-for="(item,index) in customNavBarList" v-bind:key="index"
                    :class="{'disabled-column':!item.visible}">
                    <el-card class="box-card" :body-style="elCardBodyStyle">
                        <label>{{item.name}}</label>
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            v-model="item.visible"
                            active-color="#13ce66"
                            @change="switchDisplay">
                        </el-switch>
                    </el-card>
                </li>
            </ul>
            <el-tag type="success">栏目项预览</el-tag>
            <ul class="preview" id="preview">
                <li v-for="(item,index) in previewNavBarList" :class="{ active: item.visible }" :key="index">
                    <el-tag>{{item.name}}</el-tag>
                </li>
            </ul>
            <el-button type="primary" @click="publish">发布</el-button>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'NavBarSetting',
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
                systemNavBarList: [],
                customNavBarList: [],
                previewNavBarList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                let that = this;
                this.$service.getNavBarList().then(response => {
                    if (response) {
                        this.previewNavBarList = response.data;
                        this.systemNavBarList = this.previewNavBarList.slice(0, 3);
                        this.customNavBarList = this.previewNavBarList.slice(3);
                    }
                });
                // 拖拽设置
                this.$dragula([document.getElementById('custom')], {
                    // 设置隐藏栏目不可以拖动
                    moves: function (el) {
                        return !el.classList.contains('disabled-nav-bar');
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
                let nodes = this.$el.querySelectorAll('#custom li');
                let array = [];
                for (let i = 0; i < nodes.length; i++) {
                    for (let k = 0; k < this.customNavBarList.length; k++) {
                        if (nodes[i].querySelector('label').innerText === this.customNavBarList[k].name) {
                            this.customNavBarList[k].sort = i + 3;
                            array.push(this.customNavBarList[k]);
                        }
                    }
                }
                this.previewNavBarList = this.systemNavBarList.concat(array);
            },
            // 发布
            publish() {
                this.$service.setNavBarList(this.previewNavBarList).then(response => {
                    if (response) {
                        this.$message({
                            message: '导航栏设置成功',
                            type: 'success'
                        });
                    }
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-row {
        text-align: left;
        /*固定栏目*/
        ul.system {
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
        .custom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 160px;
            li {
                height: 120px;
                width: 120px;
                border: 1px solid #13ce66;
                cursor: grab;
                label {
                    color: #13ce66;
                    cursor: grab;
                }
                &.disabled-nav-bar {
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
                display: none;
                margin-right: 20px;
                &.active {
                    display: inline-block;
                }
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
