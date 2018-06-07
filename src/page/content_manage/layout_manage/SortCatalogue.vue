<!--内容管理-栏目管理-为频道或者类型等目录排序-->
<template>
    <div>
        <ul class="recommend-type recommend-line">
            <li class="settable recommend-item" @click="setPickCatalogueVisible(true)"
                v-for="(item,index) in pickedCatalogueList" :key="index">
                <div class="ab-center">{{item.name}}</div>
            </li>
            <li class="settable recommend-item">
                <div class="ab-center">更多</div>
            </li>
        </ul>
        <el-dialog title="设置电视剧推荐类型" :visible.sync="pickCatalogueVisible">
            <template v-if="pickCatalogueVisible">
                <ul class="pick-list" id="pick-list">
                    <li v-for="(item, index) in pickedCatalogueList" :key="index"
                        v-if="item.id"
                        :data-id="item.id"
                        :data-name="item.name">
                        <el-card shadow="always">
                            {{item.name}}
                        </el-card>
                    </li>
                </ul>
                <ul class="type-list" id="type-list">
                    <li v-for="(item, index) in typeList" :key="index"
                        :data-id="item.id"
                        :data-name="item.name">
                        <el-card shadow="always">
                            {{item.name}}
                        </el-card>
                    </li>
                </ul>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="setPickCatalogueVisible(false)">取 消</el-button>
                    <el-button type="primary" @click="setCatalogue">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'SortCatalogue',
        props: ['categoryName', 'pickedCatalogueList', 'blockIndex'],
        data() {
            return {
                pickCatalogueVisible: false,
                typeList: []
            };
        },
        methods: {
            initTypeList() {
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        response.data.map(item => {
                            if (item.name === this.categoryName) {
                                this.typeList = item.programmeTypeList;
                                // 去除已选的类型
                                for (let i = 0; i < this.pickedCatalogueList.length; i++) {
                                    for (let k = 0; k < this.typeList.length; k++) {
                                        if (this.pickedCatalogueList[i].id === this.typeList[k].id) {
                                            this.typeList.splice(k, 1);
                                        }
                                    }
                                }
                                this.initDragula();
                            }
                        });
                    }
                });
            },
            initDragula() {
                this.$nextTick(function () {
                    // 拖拽设置
                    this.$dragula([document.getElementById('type-list'), document.getElementById('pick-list')], {
                        direction: 'horizontal',
                        accepts: function (el, target, source, sibling) {
                            if (target.id === 'pick-list') {
                                if (target.querySelectorAll('li').length >= 5) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    });
                });
            },
            // 打开或关闭蒙层
            setPickCatalogueVisible(isVisible) {
                this.pickCatalogueVisible = isVisible;
                if (isVisible) {
                    this.initTypeList();
                }
            },
            // 设置目录
            setCatalogue() {
                if (this.$el.querySelectorAll('#pick-list li').length !== 5) {
                    this.$message({
                        message: '请设置五个推荐类型',
                        type: 'warning'
                    });
                    return;
                }
                let list = [[]];
                let nodeList = this.$el.querySelectorAll('#pick-list li');
                for (let i = 0; i < nodeList.length; i++) {
                    list[0].push({
                        id: nodeList[i].getAttribute('data-id'),
                        name: nodeList[i].getAttribute('data-name'),
                        itemType: 'PROGRAMME_TYPE'
                    });
                }
                let catalogueItem = {
                    layoutTemplate: 'LT_L',
                    renderType: 'CATALOGUE',
                    title: '',
                    recommendLayoutItemMultiList: list
                };
                // 保存数据到本地store，并展示，关闭弹出框
                this.$store.dispatch('todayRecommend/setCatalogue', {
                    block: this.blockIndex,
                    item: catalogueItem
                }).then(response => {
                    if (response === 'success') {
                        this.$message({
                            message: '设置推荐节目类别成功',
                            type: 'success'
                        });
                        this.$emit('setCatalogue', list[0]);
                        this.$store.dispatch('todayRecommend/setTodayRecommendCache');
                        this.pickCatalogueVisible = false;
                    } else {
                        this.$message({
                            message: '设置推荐节目类别失败',
                            type: 'warning'
                        });
                    }
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    // 推荐节目类型或者直播频道
    .recommend-type {
        display: flex;
        margin-top: 20px;
        justify-content: space-between;
        li {
            width: 14%;
            padding-top: 8%;
            background: #008178;
            div {
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 40px;
            }
        }
    }

    .pick-list {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        height: 200px;
        margin-bottom: 30px;
        border: 1px solid gray;
        li {
            margin-bottom: 16px;
            margin-right: 12px;
            cursor: grab;
            .el-card {
                flex-shrink: 0;
                background: #008178;
                color: #fff;
                font-size: 14px;
            }
        }
    }

    .type-list {
        display: flex;
        flex-wrap: wrap;
        li {
            margin-bottom: 16px;
            margin-right: 12px;
            cursor: grab;
        }
        .el-card {
            flex-shrink: 0;
            background: #606266;
            color: #fff;
            font-size: 14px;
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
            flex-shrink: 0;
            background: #606266;
            color: #fff;
            font-size: 14px;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }
</style>
