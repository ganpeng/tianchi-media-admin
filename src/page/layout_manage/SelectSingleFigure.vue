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
            highlight-current-row>
            <el-table-column
                width="50px"
                label="选择">
                <template slot-scope="scope">
                    <el-radio
                        v-model="singleFigure.id"
                        :label="scope.row.id"
                        @change="setFigure(scope.row)">
                    </el-radio>
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
    import PersonFilterParams from '../search_filter_params/PersonFilterParams';

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
                    this.$emit('setFigure', row);
                }
            }
        }
    };
</script>

<style lang="less" scoped>

    .el-table {
        img {
            width: 120px;
        }
    }

</style>
