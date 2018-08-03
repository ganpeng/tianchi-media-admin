<!--选择多个人物组件-->
<template>
    <div>
        <person-filter-params
            v-on:getPersonList="getPersonList">
        </person-filter-params>
        <el-table
            :data="personList"
            border
            style="width: 100%"
            header-row-class-name="table-header-row"
            ref="multiplePerson"
            @select="selectRow">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                label="头像">
                <template slot-scope="scope">
                    <img v-if="scope.row.avatarImage"
                         :src="scope.row.avatarImage ? scope.row.avatarImage.uri : '' | imageUrl"
                         @click="displayImage(scope.row.avatarImage)"
                         :alt="scope.row.avatarImage ? scope.row.avatarImage.name : ''">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="人物简介">
                <template slot-scope="scope">
                    <label class="ellipsis-three">{{scope.row.description}}</label>
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
                <template slot-scope="scope">
                    {{areaLabel(scope.row.area)}}
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
        <el-button type="success" @click="appendPerson" size="small">添加/更新所选人物</el-button>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>

<script>
    import store from 'store';
    import PersonFilterParams from '../../searchFilterParams/PersonFilterParams';
    import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';

    export default {
        name: 'SelectMultiplePerson',
        components: {
            PersonFilterParams,
            PreviewSingleImage
        },
        // 当前外部选中的人物列表
        props: ['selectedPersonList'],
        data() {
            return {
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                previewImage: {
                    title: '',
                    display: false,
                    uri: ''
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
                return area ? area.name : '';
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
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
            // 放大预览图片
            displayImage(image) {
                this.previewImage.title = image.name;
                this.previewImage.display = true;
                this.previewImage.uri = image.uri;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-table {
        img {
            width: 120px;
            cursor: zoom-in;
        }
        .more {
            float: right;
        }
    }

</style>
