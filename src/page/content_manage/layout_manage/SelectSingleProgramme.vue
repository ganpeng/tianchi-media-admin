<!--选择一个节目组件-->
<template>
    <div>
        <programme-filter-params
            v-on:getProgrammeList="getProgrammeList">
        </programme-filter-params>
        <el-table
            :data="programmeList"
            border
            ref="selectSingleProgramme"
            style="width: 100%"
            highlight-current-row
            :row-class-name="tableRowClassName"
            @current-change="setProgramme">
            <el-table-column
                width="50px"
                label="选择">
                <template slot-scope="scope">
                    <i class="el-icon-success"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="code"
                label="编号">
                <template slot-scope="scope">
                    <label>{{scope.row.code}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                         :alt="scope.row.coverImage.name"
                         v-if="scope.row.coverImage">
                    <label v-else>------</label>
                </template>
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
                prop="featureVideoCount"
                label="正片数量">
            </el-table-column>
            <el-table-column
                prop="extraVideoCount"
                label="相关视频数量">
            </el-table-column>
            <el-table-column
                prop="announceAt"
                label="上映时间">
                <template slot-scope="scope">
                    {{scope.row.announceAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="produceAreaList"
                label="地区">
                <template slot-scope="scope">
                    {{areaLabel(scope.row.produceAreaList)}}
                </template>
            </el-table-column>
            <el-table-column
                label="分类">
                <template slot-scope="scope">
                    {{scope.row.categoryList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="typeList"
                label="类型">
                <template slot-scope="scope">
                    {{scope.row.typeList | jsonJoin('name')}}
                </template>
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
            <el-table-column
                prop="visible"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.visible ? '已上架' :'已下架'}}
                </template>
            </el-table-column>
            <el-table-column
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             class="operate">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toProgrammeDetail(scope.row.id)">查看</el-button>
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
    import ProgrammeFilterParams from '../searchFilterParams/ProgrammeFilterParams';

    export default {
        name: 'SelectSingleProgramme',
        components: {
            ProgrammeFilterParams
        },
        // 当前外部选中的人物列表
        data() {
            return {
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                totalAmount: 0,
                programmeList: [],
                // 单选节目
                singleProgramme: {}
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getProgrammeList();
            },
            // 请求数据
            getProgrammeList(searchParams) {
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                this.$service.getProgrammeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的单选项进行勾选
                        for (let k = 0; k < this.programmeList.length; k++) {
                            if (this.singleProgramme.id === this.programmeList[k].id) {
                                this.$nextTick(function () {
                                    this.$refs.selectSingleProgramme.setCurrentRow(this.programmeList[k]);
                                    this.$emit('setProgramme', this.programmeList[k]);
                                });
                            }
                        }
                    }
                });
            },
            areaLabel(areaList) {
                return areaList.reduce((res, curr) => {
                    let area = store.get('areaList').find((item) => item.code === curr);
                    return area ? `${res}, ${area.name}` : res;
                }, '').replace(/^,/, '');
            },
            tableRowClassName({row}) {
                if (row.recommend || !row.visible) {
                    return 'warning-row';
                }
                return '';
            },
            // 跳转到节目详情
            toProgrammeDetail(programmeId) {
                this.$router.push({name: 'DisplayProgramme', params: {id: programmeId}});
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum - 1;
                this.getProgrammeList();
            },
            // 选中的节目更改时触发
            setProgramme(row) {
                // 清空选择项的时候不做操作
                if (!row) {
                    return;
                }
                if (row.visible) {
                    this.singleProgramme = row;
                    this.$emit('setProgramme', row);
                } else {
                    this.$message('当前节目已经下架，不可选择');
                    this.$refs.selectSingleProgramme.setCurrentRow();
                    this.$emit('resetProgramme');
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
