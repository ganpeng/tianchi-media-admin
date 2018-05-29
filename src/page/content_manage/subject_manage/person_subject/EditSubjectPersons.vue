<!--人物专题中的人物设置组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑专题中的人物</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <select-multiple-person
                ref="selectMultiplePerson"
                :selectedPersonList="selectedPersonList"
                v-on:setPersonList="setPerson">
            </select-multiple-person>
            <el-tag>已选人物</el-tag>
            <el-table
                :data="selectedPersonList"
                border
                style="width: 100%">
                <el-table-column
                    type="index"
                    label="序号">
                </el-table-column>
                <el-table-column
                    prop="id"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="人物简介">
                    <template slot-scope="scope">
                        <label>{{scope.row.description}}</label>
                        <el-popover
                            placement="right"
                            :title="scope.row.name + '简介'"
                            width="250"
                            trigger="hover"
                            :content="scope.row.description">
                            <el-button slot="reference" type="text" class="more">更多</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="area"
                    label="地区">
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 class="operate">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="removePerson(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-center update-btn">
                <el-button type="success" @click="updateSubjectPersons">更 新</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import SelectMultiplePerson from './SelectMultiplePerson';

    export default {
        name: 'EditSubjectPersons',
        components: {
            SelectMultiplePerson
        },
        data() {
            return {
                selectedPersonList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getSubjectDetail(this.$route.params.id).then(response => {
                    if (response) {
                        if (response.data.subjectItemList) {
                            this.selectedPersonList = response.data.subjectItemList;
                        }
                        this.$nextTick(function () {
                            this.$refs.selectMultiplePerson.init();
                        });
                    }
                });
            },
            // 删除选中的人物
            removePerson(index) {
                let removedRow = this.selectedPersonList.splice(index, 1)[0];
                this.$refs.selectMultiplePerson.cancelSelectRow(removedRow);
            },
            // 设置选择的人物
            setPerson(selectedPersons) {
                this.selectedPersonList.length = 0;
                for (let i = 0; i < selectedPersons.length; i++) {
                    this.selectedPersonList.push(selectedPersons[i]);
                }
            },
            // 更新专题人物列表
            updateSubjectPersons() {
                this.$service.updateSubjectItemList({
                    id: this.$route.params.id,
                    subjectItemList: this.selectedPersonList
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message('更新人物列表成功');
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
        .el-tag {
            margin-top: 50px;
        }
    }

    .el-table {
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }
    }

    .no-person {
        margin-top: 40px;
        margin-bottom: 50px;
    }

    .update-btn {
        margin: 80px 0 40px 0;
    }
</style>
