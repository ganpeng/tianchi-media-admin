<!--内容管理-栏目管理-人物模块设置-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="text-left">1.请输入人物模块名称：</h3>
        <el-input
            placeholder="请输入模块名称，30个字符以内"
            v-model="title"
            clearable>
        </el-input>
        <h3 class="text-left">2.请选择要推荐的人物专题：</h3>
        <select-single-subject
            ref="selectSingleSubject"
            v-on:setSubject="setSubject">
        </select-single-subject>
        <h3 class="text-left">3.请对专题中的人物排序：</h3>
        <label v-if="personList.length === 0">暂无选中的人物</label>
        <ul id="person-list" v-else>
            <li v-for="(item, index) in personList" :key="index" :data-id="item.id">
                <img :src="item.posterImageList[0] ? item.posterImageList[0].uri : ''" :alt="item.name"/>
                <label>{{item.name}}</label>
            </li>
        </ul>
        <div class="text-center save-btn">
            <el-button type="success" @click="saveBlock">保 存</el-button>
        </div>
    </div>
</template>

<script>
    import SelectSingleSubject from './SelectSingleSubject';

    export default {
        name: 'BlockAppendPersonSubject',
        components: {
            SelectSingleSubject
        },
        data() {
            return {
                title: '',
                currentSubject: {},
                personList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 选择某一个专题
            setSubject(item) {
                if (!item.subjectItemList || item.subjectItemList.length < 7) {
                    this.$message({
                        message: '该专题人物数少于7个，不可选择',
                        type: 'warning'
                    });
                    this.currentSubject = {};
                    this.personList = [];
                    // 取消选择
                    this.$refs.selectSingleSubject.cancelSubject();
                } else {
                    this.currentSubject = item;
                    this.personList = item.subjectItemList;
                    this.$nextTick(function () {
                        // 拖拽设置
                        this.$dragula([document.getElementById('person-list')], {
                            direction: 'horizontal'
                        });
                    });
                }
            },
            // 保存信息到store中
            saveBlock() {
                if (!this.title) {
                    this.$message({
                        message: '请填写模块名称',
                        type: 'warning'
                    });
                    return;
                }
                if (!this.currentSubject.id) {
                    this.$message({
                        message: '请选择专题',
                        type: 'warning'
                    });
                    return;
                }
                let nodes = this.$el.querySelectorAll('#person-list li');
                let subjectLayoutItemList = [];
                for (let i = 0; i < nodes.length; i++) {
                    for (let k = 0; k < this.personList.length; k++) {
                        if (nodes[i].getAttribute('data-id') === this.personList[k].id) {
                            subjectLayoutItemList.push({
                                id: this.personList[k].id,
                                name: this.personList[k].name,
                                // 筛选其中一张符合尺寸的照片
                                coverImage: this.personList[k].posterImageList[0]
                            });
                        }
                    }
                }
                // 组建人物模块专题对象
                let list = [[]];
                list[0] = subjectLayoutItemList;
                let personModel = {
                    subjectId: this.currentSubject.id,
                    title: this.title,
                    subjectCategory: 'FIGURE',
                    subjectLayoutItemMultiList: list
                };
                // 保存到store中
                this.$store.dispatch('todayRecommend/setSubjectLayoutItem', {
                    row: this.$route.params.row,
                    item: personModel
                }).then(response => {
                    if (response === 'success') {
                        this.$message({
                            message: '设置模块专题成功',
                            type: 'success'
                        });
                        this.$store.dispatch('todayRecommend/setTodayRecommendCache');
                    } else {
                        this.$message({
                            message: '设置模块专题失败',
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

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-input {
        width: 500px;
    }

    #person-list {
        display: flex;
        margin-top: 30px;
        padding: 0 20px 20px 20px;
        justify-content: left;
        flex-wrap: wrap;
        border: 1px dotted gray;
        li {
            display: flex;
            margin-right: 30px;
            margin-top: 20px;
            flex-direction: column;
            justify-content: space-between;
            height: 230px;
            img {
                display: block;
                height: 200px;
                width: 200px;
                border-radius: 180px;
                cursor: grab;
            }
            label {
                text-align: center;
                font-size: 16px;
            }
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
        text-align: center;
        img {
            display: block;
            height: 200px;
            width: 200px;
            border-radius: 180px;
            cursor: grab;
        }
        label {
            text-align: center;
            font-size: 16px;
        }
    }

    .container > div {
        cursor: move;
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab;
    }

    .save-btn {
        margin: 60px 0 40px 0;
    }
</style>
