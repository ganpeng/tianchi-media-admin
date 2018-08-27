<!--栏目管理-栏目项设置-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'栏目管理'},
            {name:'栏目项管理'}]">
        </custom-breadcrumb>
        <div class="text-left page-box">
            <div class="page-title">现有栏目及排序</div>
            <div class="page-content">
                <div class="item-little-title">固定栏目</div>
                <ul class="system">
                    <li v-for="(item,index) in systemNavBarList" v-bind:key="index">
                        {{item.name}}
                    </li>
                </ul>
                <div class="item-little-title">可调整栏目</div>
                <ul class="custom" id="custom">
                    <li v-for="(item,index) in customNavBarList" v-bind:key="index"
                        :class="{'disabled-nav-bar':!item.visible}">
                        <label>{{item.name}}</label>
                        <el-switch
                            active-text="显示"
                            inactive-text="隐藏"
                            v-model="item.visible"
                            active-color="#13ce66"
                            @change="switchDisplay">
                        </el-switch>
                    </li>
                </ul>
                <div class="item-little-title">栏目项预览</div>
                <ul class="preview" id="preview">
                    <li v-for="(item,index) in previewNavBarList"
                        :class="{ active: item.visible,still: index === 0 || index === 1 || index === 2 }"
                        :key="index">
                        {{item.name}}
                    </li>
                </ul>
            </div>
        </div>
        <el-button type="primary" @click="publish">保存</el-button>
    </div>
</template>

<script>

    export default {
        name: 'NavBarSetting',
        data() {
            return {
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
                    if (response && response.code === 0) {
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

<style lang="scss" scoped>

    .page-box {
        background: #FFFFFF;
        border-radius: 4px;
        .page-content {
            padding: 30px 30px 100px 30px;
        }
    }

    /*固定栏目*/
    ul.system {
        display: flex;
        justify-content: left;
        li {
            margin-right: 75px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 50px;
            width: 160px;
            background: #F5F7FA;
            border-radius: 4px;
        }
    }

    /*可调整栏目*/
    .custom {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        li {
            display: flex;
            margin-right: 75px;
            margin-bottom: 20px;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            flex-shrink: 0;
            flex-grow: 0;
            height: 90px;
            width: 160px;
            background: #F5F7FA;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            cursor: grab;
            &:hover {
                border: 1px solid $baseBlue;
            }
            label {
                font-size: $normalFontSize;
                color: $baseAsideColor;
                cursor: grab;
            }
            &.disabled-nav-bar {
                cursor: default;
                label {
                    color: gray;
                    cursor: default;
                }
            }
        }
    }

    .el-switch {
        display: inline-block;
        text-align: center;
        span {
            color: red;
        }
    }

    /*预览*/
    .preview {
        display: flex;
        justify-content: flex-start;
        li {
            display: none;
            margin-right: 20px;
            height: 28px;
            width: 76px;
            background: #FFFFFF;
            border: 1px solid $baseGray;
            border-radius: 100px;
            font-size: $smallestFontSize;
            color: $baseGray;
            text-align: center;
            line-height: 28px;
            &.active {
                display: inline-block;
            }
            &.still {
                border: 1px solid $dynamicGray;
                color: $baseLightGray;
            }
        }
    }

    .el-button {
        display: block;
        width: 120px;
        height: 40px;
        margin: 50px auto 96px auto;
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
        margin-right: 75px;
        margin-bottom: 20px;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        flex-shrink: 0;
        flex-grow: 0;
        height: 90px;
        width: 160px;
        border: 1px solid $baseBlue;
        border-radius: 4px;
        cursor: grab;
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

</style>

<style lang="scss">

    .el-switch {
        display: inline-block;
        text-align: center;
        .el-switch__label:not(.is-active) {
            color: #8C8C8C;
        }
    }

</style>
