<!--选择多个节目组件-->
<template>
    <div id="select-multiple-programme" class="text-left">
        <div id="select-steps">
            <div>
                <label>1</label>
                <span>选择节目</span>
            </div>
            <i></i>
            <div>
                <label>2</label>
                <span>选择节目内视频</span>
            </div>
        </div>
        <div class="search-field-item" @keyup.enter="getProgrammeList">
            <el-input
                v-model="listQueryParams.keyword"
                @change="getProgrammeList"
                clearable
                class="border-input"
                placeholder="节目名称等">
            </el-input>
            <el-button
                class="btn-style-one"
                @click="getProgrammeList"
                type="primary">
                <svg-icon icon-class="search"></svg-icon>
                搜索
            </el-button>
        </div>
        <programme-operate-table
            ref="programmeOperateTable"
            model="MULTIPLE"
            :programmeList="programmeList">
        </programme-operate-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import ProgrammeOperateTable from './ProgrammeOperateTable';

    export default {
        name: 'SelectMultipleProgramme',
        components: {
            ProgrammeOperateTable
        },
        data() {
            return {
                // 本地选择节目列表
                listQueryParams: {
                    keyword: '',
                    pageNum: 0,
                    pageSize: 5
                },
                pageNum: 1,
                total: 0,
                programmeList: [],
                tagListVisible: true
            };
        },
        mounted() {
            this.getProgrammeList();
        },
        methods: {
            // 请求数据
            getProgrammeList(searchParams) {
                this.listQueryParams.pageNum = this.pageNum - 1;
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                this.$service.getProgrammeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        this.total = response.data.total;
                        this.$nextTick(function () {
                            this.$refs.programmeOperateTable.setCurrentRow();
                        });
                    }
                });
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getProgrammeList();
            },
            // 取消选择某一个节目
            cancelSelectedProgramme(programme) {
                this.$refs.programmeOperateTable.cancelSelectRow(programme);
            },
            // 获取选择的节目列表
            getSelectedProgrammeList() {
                return this.$refs.programmeOperateTable.getSelectedProgramme();
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    #selected-tags {
        div {
            margin-top: -30px;
            height: 45px;
            border-bottom: 1px solid #3E495E;
            span {
                margin-right: 60px;
                padding-left: 5px;
                height: 45px;
                line-height: 55px;
                font-size: 14px;
                color: #FFFFFF;
            }
            label {
                font-size: 14px;
                color: #1989FA;
                cursor: pointer;
                i {
                    color: #3E495E;
                }
            }
        }
        p {
            padding-top: 10px;
            border-bottom: 1px solid #3E495E;
            max-height: 264px;
            overflow-y: scroll;
        }
    }

    .search-field-item {
        margin-top: 24px;
        margin-left: 40px;
        margin-bottom: 20px;
        .el-input {
            margin-right: 20px;
            width: 180px;
        }
        .svg-icon {
            margin-right: 10px;
        }
    }

</style>

<style lang="scss">

    #select-multiple-programme {
        #select-steps {
            margin-bottom: 47px;
            display: flex;
            align-items: center;
            justify-content: center;
            div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                &:last-child {
                    label {
                        background: rgba(99, 116, 151, 1);
                        color: rgba(163, 208, 253, 1);
                    }
                }
                label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: rgba(0, 98, 196, 1);
                    font-size: 20px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                }
                span {
                    margin-top: 12px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                }
            }
            i {
                margin-right: -10px;
                margin-bottom: 36px;
                width: 300px;
                height: 2px;
                background: rgba(99, 116, 151, 1);
                border-radius: 1px;
            }
        }
    }

</style>
