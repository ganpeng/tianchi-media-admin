<!--节目专题中的节目设置组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑专题中的节目</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <select-multiple-programme
                :selectedProgrammeList="selectedProgrammeList"
                ref="selectMultipleProgramme"
                model="MULTIPLE"
                v-on:setProgramme="setProgramme">
            </select-multiple-programme>
            <el-tag>已选节目</el-tag>
            <el-table
                :data="selectedProgrammeList"
                border
                style="width: 100%">
                <el-table-column
                    label="序号"
                    width="55">
                    <template slot-scope="scope">
                        <label>{{scope.$index + 1}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="description"
                    label="简介">
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
                    prop="actor"
                    label="主演">
                </el-table-column>
                <el-table-column
                    prop="director"
                    label="导演">
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 class="operate">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="removeProgramme(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-center update-btn">
                <el-button type="success" @click="updateSubjectProgrammes">更 新</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import SelectMultipleProgramme from './SelectMultipleProgramme';

    export default {
        name: 'EditSubjectProgrammes',
        components: {
            SelectMultipleProgramme
        },
        data() {
            return {
                selectedProgrammeList: []
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
                            this.selectedProgrammeList = response.data.subjectItemList;
                        }
                        this.$nextTick(function () {
                            this.$refs.selectMultipleProgramme.init();
                        });
                    }
                });
            },
            // 删除选中的节目
            removeProgramme(index) {
                let removedRow = this.selectedProgrammeList.splice(index, 1)[0];
                this.$refs.selectMultipleProgramme.cancelSelectRow(removedRow);
            },
            // 设置选择的节目
            setProgramme(selectedProgrammes) {
                this.selectedProgrammeList.length = 0;
                for (let i = 0; i < selectedProgrammes.length; i++) {
                    this.selectedProgrammeList.push(selectedProgrammes[i]);
                }
            },
            // 更新专题节目列表
            updateSubjectProgrammes() {
                this.$service.updateSubjectItemList({
                    id: this.$route.params.id,
                    subjectItemList: this.selectedProgrammeList
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message('更新节目列表成功');
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
        img {
            width: 120px;
            cursor: zoom-in;
        }
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

    .update-btn {
        margin: 80px 0 40px 0;
    }
</style>
