<!--节目操作组件-->
<template>
    <div id="select-single-programme-container">
        <el-table
            ref="programmeTable"
            :data="programmeList"
            header-row-class-name="common-table-header"
            border
            @current-change="handleCurrentChange"
            highlight-current-row
            row-class-name=programme-row
            style="width: 100%">
            <el-table-column
                align="center"
                width="60px"
                label="选择">
                <template slot-scope="scope">
                    <div class="radio-block">
                        <div class="active-radio"></div>
                        <div class="default-radio"></div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="120px"
                prop="code"
                label="节目编号">
                <template slot-scope="scope">
                    <label>{{scope.row.code}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                prop="name"
                label="节目名称">
            </el-table-column>
            <el-table-column
                align="center"
                width="100px"
                label="节目海报">
                <template slot-scope="scope">
                    <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                         :alt="scope.row.coverImage.name"
                         v-if="scope.row.coverImage">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="100px"
                prop="featureVideoCount"
                label="正片数量">
            </el-table-column>
            <el-table-column
                min-width="150px"
                align="center"
                prop="produceAreaList"
                label="地区">
                <template slot-scope="scope">
                    {{(scope.row.produceAreaList && scope.row.produceAreaList.length !== 0) ?
                    areaLabel(scope.row.produceAreaList) : '------'}}
                </template>
            </el-table-column>
            <el-table-column
                width="100px"
                align="center"
                label="分类">
                <template slot-scope="scope">
                    {{scope.row.categoryList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                prop="typeList"
                align="center"
                min-width="100px"
                label="类型">
                <template slot-scope="scope">
                    {{scope.row.typeList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                width="100px"
                align="center"
                prop="updatedAt"
                label="更新时间">
                <template slot-scope="scope">
                    <label v-if="scope.row.updatedAt">{{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}</label>
                    <label v-else>------</label>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import store from 'store';
    import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';

    export default {
        name: 'ProgrammeOperateTable',
        components: {
            PreviewSingleImage
        },
        props: {
            // 节目列表
            programmeList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            currentSelectedProgrammeId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                currentRow: {}
            };
        },
        mounted() {
        },
        methods: {
            handleCurrentChange(val) {
                if (val) {
                    this.currentRow = val;
                }
            },
            areaLabel(areaList) {
                return areaList.reduce((res, curr) => {
                    let area = store.get('areaList').find((item) => item.code === curr);
                    return area ? `${res}, ${area.name}` : res;
                }, '').replace(/^,/, '');
            },
            // 获取当前选中的节目列表
            getSelectedProgramme() {
                return this.currentRow;
            },
            setCurrentRow() {
                if (this.currentRow && this.currentRow.id) {
                    this.programmeList.map(item => {
                        if (item.id === this.currentRow.id) {
                            this.$refs.programmeTable.setCurrentRow(item);
                        }
                    });
                }
            }
        }
    };
</script>

<style lang="scss">

    #select-single-programme-container {
        .el-table {
            .programme-row {
                td {
                    background-color: #191D26;
                }
                &.current-row {
                    td {
                        background-color: #191D26;
                    }
                }
            }
        }
    }
</style>

<style lang="scss" scoped>

    .el-table {
        margin-top: 0px;
        img {
            width: 70px;
            height: auto;
        }
        .programme-row {
            &.current-row {
                .default-radio {
                    display: none;
                }
                .active-radio {
                    display: block;
                }
                td {
                    background-color: #191D26;
                }
            }
            .radio-block {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .default-radio {
                width: 14px;
                height: 14px;
                border-radius: 7px;
                border: 1px solid rgba(62, 73, 94, 1);
            }
            .active-radio {
                display: none;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                background: rgba(0, 98, 196, 1);
            }
        }
    }

</style>
