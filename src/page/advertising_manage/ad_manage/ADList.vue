<!--广告管理-广告列表（包含开机、屏保、音量条、详情页广告）组件-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <ad-filter-params
            ref="adFilterParams"
            v-on:getADList="getADList">
        </ad-filter-params>
        <div class="seperator-line"></div>
        <div class="table-field">
            <h2 class="content-title">广告列表</h2>
            <div class="table-operator-field clearfix">
                <div class="float-left"></div>
                <div class="float-right">
                    <el-dropdown @command="createAD($event)" placement="bottom">
                        <el-button class="btn-style-two contain-svg-icon">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                            <svg-icon icon-class="arrow_down"></svg-icon>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="BOOT_AD">开机广告</el-dropdown-item>
                            <el-dropdown-item command="PAUSE_AD">暂停广告</el-dropdown-item>
                            <el-dropdown-item command="PREPOSITION_AD">片头广告</el-dropdown-item>
                            <el-dropdown-item command="VOLUME_AD">音量条广告</el-dropdown-item>
                            <el-dropdown-item command="CHANNEL_SWITCH_AD">换台广告</el-dropdown-item>
                            <el-dropdown-item command="SCREEN_SAVER_AD">屏保广告</el-dropdown-item>
                            <el-dropdown-item command="PROGRAMME_DETAIL_AD">详情页广告</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <ad-operate-table
            :adList="adList"
            v-on:getADList="getADList">
        </ad-operate-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQueryParams.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
    </div>
</template>

<script>
    import AdFilterParams from '../../search_filter_params/ADFilterParams';
    import AdOperateTable from './components/ADOperateTable';

    export default {
        name: 'ADList',
        components: {
            AdFilterParams,
            AdOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                totalAmount: 0,
                adList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('adFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('adFilter');
                    this.$refs.adFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getADList();
            },
            getADList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('adFilter', this.listQueryParams);
                this.$service.getADList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.adList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getADList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getADList();
            },
            // 创建广告
            createAD(command) {
                switch (command) {
                    case 'BOOT_AD':
                        this.$router.push({name: 'CreateBootAD'});
                        break;
                    case 'PAUSE_AD':
                        this.$router.push({name: 'CreatePauseAD'});
                        break;
                    case 'PREPOSITION_AD':
                        this.$router.push({name: 'CreatePrepositionAD'});
                        break;
                    case 'SCREEN_SAVER_AD':
                        this.$router.push({name: 'CreateScreenSaverAD'});
                        break;
                    case 'VOLUME_AD':
                        this.$router.push({name: 'CreateVolumeAD'});
                        break;
                    case 'PROGRAMME_DETAIL_AD':
                        this.$router.push({name: 'CreateProgrammeDetailAD'});
                        break;
                    case 'CHANNEL_SWITCH_AD':
                        this.$router.push({name: 'CreateChannelSwitchAD'});
                        break;
                    default:
                        break;
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

    .svg-icon-arrow_down {
        margin-left: 5px;
        height: 10px !important;
        width: 10px !important;
    }

    .shelf {
        &.disabled {
            opacity: 0.3;
        }
    }

</style>
