<!--选择多个人物组件-->
<template>
    <div>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item label="地区">
                <el-select v-model="area" placeholder="请选择地区">
                    <el-option
                        v-for="item in areaOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="search" label="姓名">
                <el-input v-model="name" placeholder="请输入人物姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="getPersonList">查 询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="personList"
            border
            style="width: 100%"
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
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <el-button type="success" @click="appendPerson" size="small">添加/更新所选人物</el-button>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>

<script>
    import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';

    export default {
        name: 'SelectMultiplePerson',
        components: {
            PreviewSingleImage
        },
        // 当前外部选中的人物列表
        props: ['selectedPersonList'],
        data() {
            return {
                previewImage: {
                    title: '',
                    display: false,
                    uri: ''
                },
                areaOptions: [{
                    value: '1',
                    label: '大陆'
                }, {
                    value: '2',
                    label: '台湾'
                }, {
                    value: '3',
                    label: '香港'
                }, {
                    value: '4',
                    label: '海外'
                }],
                area: '',
                name: '',
                pageNum: 1,
                pageSize: 10,
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
            getPersonList() {
                this.$service.getPersonList({
                    name: this.name,
                    area: this.area,
                    pageNum: this.pageNum - 1,
                    pageSize: this.pageSize
                }).then(response => {
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
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getPersonList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
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

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 60px;
            .search {
                margin-left: 50px;
                margin-right: 30px;
            }
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

</style>
