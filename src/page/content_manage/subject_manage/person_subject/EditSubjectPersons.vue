<!--人物专题中的人物设置组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'专题管理'},
            {name:'编辑专题的人物'}]">
        </custom-breadcrumb>
        <div class="block-box text-left">
            <div class="block-title">添加人物</div>
            <select-multiple-person
                ref="selectMultiplePerson"
                :selectedPersonList="selectedPersonList"
                v-on:setPersonList="setPerson">
            </select-multiple-person>
            <div class="vice-block">
                <h3 class="block-vice-title">已选节目</h3>
                <el-table
                    :data="selectedPersonList"
                    header-row-class-name="common-table-header"
                    border
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        width="70px"
                        type="index"
                        label="序号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120px"
                        prop="id"
                        label="编号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="area"
                        label="地区">
                        <template slot-scope="scope">
                            {{scope.row.area.length !== 0 ? areaLabel(scope.row.area) : '------'}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="操作"
                        class="operate">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" class="remove-btn" @click="removePerson(scope.$index)">
                                取消关联
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="text-center update-btn">
                <el-button type="primary" class="page-main-btn" @click="updateSubjectPersons">保存</el-button>
                <el-button @click="toSubjectList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import SelectMultiplePerson from './SelectMultiplePerson';
    import store from 'store';

    export default {
        name: 'EditSubjectPersons',
        components: {
            SelectMultiplePerson
        },
        data() {
            return {
                subjectName: '',
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
                            this.subjectName = response.data.name;
                        }
                        this.$nextTick(function () {
                            this.$refs.selectMultiplePerson.init();
                        });
                    }
                });
            },
            areaLabel(code) {
                let area = store.get('areaList').find((area) => area.code === code);
                return area ? area.name : '-------';
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
                        this.$message.success('更新人物列表成功');
                    }
                });
            },
            toSubjectList() {
                this.$router.push({name: 'SubjectList'});
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
        margin: 120px 0px 80px 0px;
    }
</style>
