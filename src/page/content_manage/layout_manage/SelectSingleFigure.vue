<!--选择单个人物组件-->
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
                <el-button type="success" @click="getFigureList">查 询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="figureList"
            border
            style="width: 100%"
            ref="selectSingleFigure"
            highlight-current-row
            @current-change="setFigure">
            <el-table-column
                width="50px"
                label="选择">
                <template slot-scope="scope">
                    <i class="el-icon-success"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号">
                <template slot-scope="scope">
                    <label>{{scope.row.id}}</label>
                </template>
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
    </div>
</template>

<script>

    export default {
        name: 'SelectSingleFigure',
        data() {
            return {
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
                singleFigure: {},
                // 人物列表
                figureList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getFigureList();
            },
            getFigureList() {
                this.$service.getPersonList({
                    name: this.name,
                    area: this.area,
                    pageNum: this.pageNum - 1,
                    pageSize: this.pageSize
                }).then(response => {
                    if (response && response.code === 0) {
                        this.figureList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的项进行勾选
                        this.figureList.map(figure => {
                            if (figure.id === this.singleFigure.id) {
                                this.$refs.selectSingleFigure.setCurrentRow(figure);
                                this.$emit('setFigure', figure);
                            }
                        });
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getFigureList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getFigureList();
            },
            setFigure(row) {
                if (row) {
                    this.singleFigure = row;
                    this.$emit('setFigure', row);
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
        .el-icon-success {
            margin-right: 5px;
            color: #409EFF;
            visibility: hidden;
        }
        .current-row {
            .el-icon-success {
                visibility: visible;
            }
        }
    }

</style>
