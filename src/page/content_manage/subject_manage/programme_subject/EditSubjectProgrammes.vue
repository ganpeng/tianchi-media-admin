<!--节目专题中的节目设置组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>专题管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑<label class="subject-name">{{subjectName}}</label>专题的节目
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <select-multiple-programme
                :selectedProgrammeList="selectedProgrammeList"
                ref="selectMultipleProgramme"
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
                    label="主演">
                    <template slot-scope="scope">
                        <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    label="导演">
                    <template slot-scope="scope">
                        <label>{{scope.row.figureListMap | displayFigures('DIRECTOR')}}</label>
                    </template>
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
                subjectName: '',
                selectedProgrammeList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getSubjectDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        if (response.data.subjectItemList) {
                            this.selectedProgrammeList = response.data.subjectItemList;
                            this.subjectName = response.data.name;
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
                this.selectedProgrammeList = [];
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

    .subject-name {
        font-style: italic;
        font-weight: bold;
        font-size: 16px;
    }

    .block-box {
        margin-top: 50px;
        .el-tag {
            margin-top: 50px;
        }
    }

    .update-btn {
        margin: 80px 0 40px 0;
    }
</style>
