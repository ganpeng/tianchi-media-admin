<!--广告列表项组件-->
<template>
    <el-table
        header-row-class-name="common-table-header"
        :data="adList"
        border
        @sort-change="sortADList"
        row-class-name=product-row
        style="width: 100%">
        <el-table-column
            align="center"
            prop="id"
            width="120px"
            label="编号">
        </el-table-column>
        <el-table-column
            align="center"
            prop="name"
            label="名称">
            <template slot-scope="scope">
                    <span @click="checkADDetail(scope.row)" class="ellipsis four name">
                        {{scope.row.name}}
                    </span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="adType"
            label="类型">
            <template slot-scope="scope">
                <label>{{scope.row.adType | getCategoryName}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="adMaterialList"
            label="广告主">
            <template slot-scope="scope">
                <label>{{scope.row.advertiserList | jsonJoin('name')}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="adMaterialList"
            label="资源个数">
            <template slot-scope="scope">
                <label>{{scope.row.adMaterialCount}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="adMaterialSize"
            label="资源体积">
            <template slot-scope="scope">
                <label>{{scope.row.adMaterialSize | convertFileSize}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="expiryDate"
            min-width="120px"
            label="有效期">
            <template slot-scope="scope">
                <div>{{scope.row.applyDateBegin | formatDate('yyyy-MM-DD HH:mm:SS')}}</div>
                <div>{{scope.row.applyDateEnd | formatDate('yyyy-MM-DD HH:mm:SS')}}</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="有效性">
            <template slot-scope="scope">
                    <span v-if="scope.row.adStatus === 'ACTIVE' && scope.row.visible"
                          class="status-normal">生效中</span>
                <span v-if="scope.row.adStatus === 'WAITING' && scope.row.visible"
                      class="status-deleting">未生效</span>
                <span v-if="scope.row.adStatus === 'EXPIRED' && scope.row.visible"
                      class="status-abnormal">已失效</span>
                <span v-if="!scope.row.visible">/</span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="状态">
            <template slot-scope="scope">
                <input
                    class="my-switch switch-anim"
                    :class="{'disabled':(!scope.row.visible && scope.row.adStatus === 'EXPIRED')}"
                    type="checkbox"
                    v-model="scope.row.visible"
                    :checked="scope.row.visible"
                    @click.prevent="updateADStatus(scope.row)"/>
                <!-- 上架状态都可以下架 -->
                <i v-if="scope.row.visible" class="on-the-shelf shelf">已上架</i>
                <!-- 下架状态，已失效的不可上架 -->
                <i v-else class="off-the-shelf shelf"
                   :class="{'disabled':scope.row.adStatus === 'EXPIRED'}">已下架</i>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="updatedAt"
            sortable="custom"
            min-width="100px"
            label="更新时间">
            <template slot-scope="scope">
                {{scope.row.updatedAt | formatDate('yyyy-MM-DD HH:mm')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="createdAt"
            sortable="custom"
            min-width="100px"
            label="创建时间">
            <template slot-scope="scope">
                {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:mm')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            width="120px"
            class="operate">
            <template slot-scope="scope">
                <div class="operator-btn-wrapper">
                    <!-- 已下架已失效不可编辑 -->
                    <span
                        class="btn-text"
                        :class="{disabled:scope.row.adStatus === 'EXPIRED' && !scope.row.visible}"
                        @click="editADInfo(scope.row)">
                            编辑
                        </span>
                    <!-- 已上架未生效、已上架生效中不可删除 -->
                    <span
                        class="btn-text text-danger"
                        :class="{disabled:scope.row.visible && (scope.row.adStatus === 'WAITING' || scope.row.adStatus === 'ACTIVE')}"
                        @click="removeAD(scope.row)">
                            删除
                        </span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

    export default {
        name: 'ADOperateTable',
        props: {
            adList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                listQueryParams: {
                    order: ''
                }
            };
        },
        filters: {
            getCategoryName: function (category) {
                switch (category) {
                    case 'BOOT':
                        return '开机广告';
                    case 'PAUSE':
                        return '暂停广告';
                    case 'PREPOSITION':
                        return '片头广告';
                    case 'PROGRAMME_DETAIL':
                        return '详情页广告';
                    case 'SCREEN_SAVER':
                        return '屏保广告';
                    case 'VOLUME':
                        return '音量条广告';
                    case 'CHANNEL_SWITCH':
                        return '换台广告';
                    default:
                        break;
                }
            }
        },
        methods: {
            // 对列表进行排序
            sortADList(column) {
                if (column.prop === 'createdAt') {
                    this.listQueryParams.order = column.order === 'ascending' ? 'CREATED_AT_ASC' : 'CREATED_AT_DESC';
                } else if (column.prop === 'updatedAt') {
                    this.listQueryParams.order = column.order === 'ascending' ? 'UPDATED_AT_ASC' : 'UPDATED_AT_DESC';
                }
                this.$emit('getADList', this.listQueryParams, true);
            },
            editADInfo(item) {
                if (!this.$authority.isHasAuthority('storage:video:retry')) {
                    return;
                }
                let routeName = '';
                switch (item.adType) {
                    case 'PROGRAMME_DETAIL':
                        routeName = 'EditProgrammeDetailAD';
                        break;
                    case 'VOLUME':
                        routeName = 'EditVolumeAD';
                        break;
                    case 'SCREEN_SAVER':
                        routeName = 'EditScreenSaverAD';
                        break;
                    case 'BOOT':
                        routeName = 'EditBootAD';
                        break;
                    case 'PAUSE':
                        routeName = 'EditPauseAD';
                        break;
                    case 'PREPOSITION':
                        routeName = 'EditPrepositionAD';
                        break;
                    case 'CHANNEL_SWITCH':
                        routeName = 'EditChannelSwitchAD';
                        break;
                    default:
                        break;
                }
                this.$router.push({name: routeName, params: {id: item.id}});
            },
            // 查询广告详情
            checkADDetail(item) {
                if (!this.$authority.isHasAuthority('ad:generalAd:get')) {
                    return;
                }
                this.$router.push({name: 'ADDetail', params: {id: item.id}});
            },
            // 已上架未生效、已上架生效中
            removeAD(item) {
                if (!this.$authority.isHasAuthority('ad:generalAd:delete')) {
                    return;
                }
                this.$confirm('此操作将删除' + item.name + '广告, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteAD(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '广告删除成功!');
                            this.getADList();
                        }
                    });
                });
            },
            // 设置产品包的上下架
            updateADStatus(item) {
                if (!this.$authority.isHasAuthority('ad:generalAd:visible')) {
                    return;
                }
                if (!item.visible) {
                    this.$message.warning('已下架的广告不能再次上架');
                    return;
                }
                if (item.adStatus === 'EXPIRED') {
                    this.$message.warning('已失效的广告不能进行下架操作');
                    return;
                }
                this.$confirm('此操作将' + (item.visible ? '下架该广告' : '上架该广告') + ', 下架的广告不能再次上架，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).then(() => {
                    this.$service.setADVisible(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success(item.name + '广告' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
