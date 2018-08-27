<!--选择多个人物组件-->
<template>
    <div>
        <person-filter-params
            v-on:getPersonList="getPersonList">
        </person-filter-params>
        <el-table
            :data="personList"
            header-row-class-name="common-table-header"
            border
            row-class-name=figure-row
            style="width: 100%"
            ref="multiplePerson"
            @select="selectRow">
            <el-table-column
                type="selection"
                width="40px">
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
                label="姓名">
            </el-table-column>
            <el-table-column
                align="center"
                label="图片">
                <template slot-scope="scope">
                    <img v-if="scope.row.avatarImage"
                         :src="scope.row.avatarImage ? scope.row.avatarImage.uri : '' | imageUrl"
                         :alt="scope.row.avatarImage ? scope.row.avatarImage.name : ''">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="area"
                label="地区">
                <template slot-scope="scope">
                    {{scope.row.area && scope.row.area.length !== 0 ? areaLabel(scope.row.area) : '------'}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <el-button
            class="apppend-programme create-blue-btn"
            @click="appendPerson"
            size="small">
            添加所选人物
        </el-button>
    </div>
</template>

<script>
    import store from 'store';
    import PersonFilterParams from '../../search_filter_params/PersonFilterParams';

    export default {
        name: 'SelectMultiplePerson',
        components: {
            PersonFilterParams
        },
        // 当前外部选中的人物列表
        props: {
            selectedPersonList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                totalAmount: 0,
                // 人物列表
                personList: [],
                // 当前内部选中的人物列表（包含各个分页的）
                multipleSelection: []
            };
        },
        mounted() {
        },
        methods: {
            init() {
                // 初始化选中的项
                for (let i = 0; i < this.selectedPersonList.length; i++) {
                    this.multipleSelection.push(this.selectedPersonList[i]);
                }
                this.getPersonList();
            },
            getPersonList(searchParams) {
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                this.$service.getPersonList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.personList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的项进行勾选
                        for (let i = 0; i < this.multipleSelection.length; i++) {
                            for (let k = 0; k < this.personList.length; k++) {
                                if (this.multipleSelection[i].id === this.personList[k].id) {
                                    this.$nextTick(function () {
                                        this.$refs.multiplePerson.toggleRowSelection(this.personList[k], true);
                                    });
                                }
                            }
                        }
                    }
                });
            },
            areaLabel(code) {
                let area = store.get('areaList').find((area) => area.code === code);
                return area ? area.name : '------';
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getPersonList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum - 1;
                this.getPersonList();
            },
            // 添加人物
            appendPerson() {
                this.$emit('setPersonList', this.multipleSelection);
            },
            selectRow(selection, row) {
                let checkStatus;
                for (let i = 0; i < selection.length; i++) {
                    if (selection[i].id === row.id) {
                        checkStatus = true;
                    }
                }
                if (checkStatus) {
                    for (let k = 0; k < this.multipleSelection.length; k++) {
                        if (this.multipleSelection[k].id === row.id) {
                            return;
                        }
                    }
                    this.multipleSelection.push(row);
                } else {
                    for (let n = 0; n < this.multipleSelection.length; n++) {
                        if (this.multipleSelection[n].id === row.id) {
                            this.multipleSelection.splice(n, 1);
                        }
                    }
                }
            },
            cancelSelectRow(row) {
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (row.id === this.multipleSelection[i].id) {
                        this.multipleSelection.splice(i, 1);
                    }
                }
                for (let i = 0; i < this.personList.length; i++) {
                    if (row.id === this.personList[i].id) {
                        this.$refs.multiplePerson.toggleRowSelection(this.personList[i], false);
                    }
                }
            }
        }
    };
</script>

<style lang="less" scoped>

    .el-table {
        margin-top: 0px;
        img {
            width: 100px;
            height: 100px;
        }
    }

</style>
