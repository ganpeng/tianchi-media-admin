<!--节目专题中的节目设置组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'专题管理'},
            {name:'编辑专题的节目'}]">
        </custom-breadcrumb>
        <div class="block-box text-left">
            <div class="block-title">添加节目</div>
            <select-multiple-programme
                :selectedProgrammeList="selectedProgrammeList"
                ref="selectMultipleProgramme"
                v-on:setProgramme="setProgramme">
            </select-multiple-programme>
            <div class="vice-block">
                <h3 class="block-vice-title">已选节目</h3>
                <el-table
                    :data="selectedProgrammeList"
                    header-row-class-name="common-table-header"
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        width="70px"
                        label="序号">
                        <template slot-scope="scope">
                            <label>{{scope.$index + 1}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120px"
                        prop="code"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="主演">
                        <template slot-scope="scope">
                            <label>{{scope.row.figureListMap | displayFigures('CHIEF_ACTOR')}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="导演">
                        <template slot-scope="scope">
                            <label>{{scope.row.figureListMap | displayFigures('DIRECTOR')}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        class="operate">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="remove-btn"
                                       @click="removeProgramme(scope.$index)">
                                取消关联
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="text-center update-btn">
                <el-button type="primary" class="page-main-btn" @click="updateSubjectProgrammes">更 新</el-button>
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

<style lang="scss" scoped>

    .el-breadcurmb {
        margin-bottom: 0px;
    }

    .el-table {
        margin: 0px;
        .remove-btn {
            color: $baseRed;
        }
    }

    .update-btn {
        margin: 60px 0px;
    }

</style>
