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
                v-on:setPerson="setPerson">
            </select-multiple-person>
            <el-tag>已选人物</el-tag>
            <div v-if="selectedPersonList.length === 0" class="no-person">目前暂无选择的人物</div>
            <template v-else>
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
            </template>
            <div class="text-center">
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
            },
            // 删除选中的人物
            removePerson(index) {
                this.selectedPersonList.splice(index, 1);
            },
            // 设置选择的人物
            setPerson(selectedPerson) {
                this.selectedPersonList = selectedPerson;
            },
            // 更新专题人物列表
            updateSubjectPersons() {
                this.$service.updateSubjectPersonList({
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

    .person-list {
        display: flex;
        margin-top: 30px;
        margin-bottom: 30px;
        justify-content: left;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            .el-card {
                position: relative;
                padding-bottom: 10px;
            }
            img {
                display: block;
                margin-bottom: 10px;
                height: 180px;
            }
            label {
                font-size: 16px;
            }
            .el-button {
                position: absolute;
                bottom: 0px;
                right: 10px;
            }
        }
    }

    .no-person {
        margin-top: 40px;
        margin-bottom: 50px;
    }
</style>
