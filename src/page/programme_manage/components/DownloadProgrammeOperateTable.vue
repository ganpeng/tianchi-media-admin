<!--节目下载列表项组件-->
<template>
    <el-table
        :data="downloadProgrammeList"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
            type="selection"
            align="center">
        </el-table-column>
        <el-table-column
            align="center"
            prop="id"
            width="120px"
            label="节目编号">
        </el-table-column>
        <el-table-column
            align="center"
            prop="name"
            min-width="220px"
            label="节目名称">
            <template slot-scope="scope">
                <span @click="toDownloadProgrammeDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="price"
            min-width="220px"
            label="节目海报">
            <template slot-scope="scope">
                {{scope.row.price / 100}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="validityDays"
            min-width="220px"
            label="服务器地址">
            <template slot-scope="scope">
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="validityDays"
            min-width="220px"
            label="状态">
            <template slot-scope="scope">
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="创建时间">
            <template slot-scope="scope">
                <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
                <div>{{scope.row.createdAt | formatDate('HH:mm:SS')}}</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="下载时间">
            <template slot-scope="scope">
                <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
                <div>{{scope.row.createdAt | formatDate('HH:mm:SS')}}</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            width="110px">
            <template slot-scope="scope">
                <div class="operator-btn-wrapper">
                    <span class="btn-text text-danger" @click="removeDownloadProgramme(scope.row)">删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

    export default {
        name: 'DownloadProgrammeOperateTable',
        props: {
            downloadProgrammeList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                multipleSelection: []
            };
        },
        methods: {
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            toDownloadProgrammeDetail(item) {
                if (!this.$authority.isHasAuthority('user:membershipScheme:get')) {
                    return;
                }
                this.$router.push({
                    name: 'DownloadProgrammeDetail',
                    params: {id: item.id}
                });
            },
            removeDownloadProgramme() {

            }
        }
    };
</script>

<style lang="scss" scoped>

    .operator-btn-wrapper {
        span {
            margin-left: 0px;
        }
    }

</style>
