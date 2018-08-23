<!--选择单个人物组件-->
<template>
    <div>
        <person-filter-params
            v-on:getPersonList="getFigureList">
        </person-filter-params>
        <el-table
            :data="figureList"
            header-row-class-name="common-table-header"
            row-class-name=figure-row
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
                label="图片">
                <template slot-scope="scope">
                    <img v-if="scope.row.avatarImage"
                         :src="scope.row.avatarImage ? scope.row.avatarImage.uri : '' | imageUrl"
                         :alt="scope.row.avatarImage ? scope.row.avatarImage.name : ''">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="area"
                label="地区">
                <template slot-scope="scope">
                    {{areaLabel(scope.row.area)}}
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
    </div>
</template>

<script>
    import store from 'store';
    import PersonFilterParams from '../searchFilterParams/PersonFilterParams';

    export default {
        name: 'SelectSingleFigure',
        components: {
            PersonFilterParams
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
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
            getFigureList(searchParams) {
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                this.$service.getPersonList(this.listQueryParams).then(response => {
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
            areaLabel(code) {
                let area = store.get('areaList').find((area) => area.code === code);
                return area ? area.name : '';
            },
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.getFigureList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum - 1;
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

    .el-table {
        img {
            width: 120px;
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
