<template>
    <div class="display-advertising-owner-container">
        <h2 class="content-title">广告主详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="info-section">
                <div class="title-wrapper">
                    <div class="left-side">
                        <span class="title">{{advertisingOwner.name}}</span>
                    </div>
                    <div class="right-wrapper">
                        <div class="date">
                            <span class="create-date">
                                创建于：{{advertisingOwner.createdAt | formatDate('yyyy.MM.DD')}}
                            </span>
                            <span class="update-date">
                                更新于：{{advertisingOwner.updatedAt | formatDate('yyyy.MM.DD')}}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="attributes">
                    <div class="attribute-item">
                        <label class="item-label">广告主编号：</label>
                        <span class="value">{{advertisingOwner.id}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">广告主名称：</label>
                        <span class="value">{{advertisingOwner.name}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">广告主备注：</label>
                        <span class="value">{{advertisingOwner.description}}</span>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="ad-material-list-container clearfix">
                    <h4 class="content-sub-title">广告资源</h4>
                    <with-video-thumbnail
                        :adMaterialList="advertisingOwner.adMaterialList"
                    ></with-video-thumbnail>
                </div>
                <div class="ad-list-container">
                    <div class="seperator-line"></div>
                    <h4 class="content-sub-title">所投广告</h4>
                    <el-table header-row-class-name="common-table-header" class="my-table-style" :data="adList.list" border>
                        <el-table-column prop="id" align="center" width="120px" label="编号"></el-table-column>
                        <el-table-column prop="name" align="center" min-width="120px" label="广告名称">
                            <template slot-scope="scope">
                                {{scope.row.name}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" align="center" min-width="120px" label="广告描述">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.description}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" min-width="120px" align="center" label="广告类型">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.videoMaterialCount + scope.row.imageMaterialCount}}个
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" min-width="120px" align="center" label="广告主">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.adCount}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" min-width="120px" align="center" label="资源个数">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.adCount}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" min-width="120px" align="center" label="资源体积">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.adCount}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" min-width="120px" align="center" label="有效期">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.adCount}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" min-width="120px" align="center" label="状态">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.adCount}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="type" min-width="120px" align="center" label="是否上架">
                            <template slot-scope="scope">
                                <span class="ellipsis two">
                                    {{scope.row.adCount}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="160" label="创建时间">
                            <template slot-scope="scope">
                                {{scope.row.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="160" label="更新时间">
                            <template slot-scope="scope">
                                {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handlePaginationChange($event, 'pageSize')"
                        @current-change="handlePaginationChange($event, 'pageNum')"
                        :current-page="adList.pagination.pageNum"
                        :page-sizes="[10, 20, 50,100, 200, 500]"
                        :page-size="adList.pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="adList.pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editAdvertisingOwnerHandler">编辑</el-button>
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import WithVideoThumbnail from './WithVideoThumbnail';
export default {
    name: 'DisplayAdvertisingOwner',
    components: {WithVideoThumbnail},
    created() {
        let {id} = this.$route.params;
        this.getAdvertisingOwnerById(id);
        this.getAdListByAdvertiserId(id);
    },
    computed: {
        ...mapGetters({
            adList: 'advertising/adList',
            advertisingOwner: 'advertising/advertisingOwner'
        }),
        adMaterialList() {
            return this.advertisingOwner.adMaterialList.map((item) => {
                item.uri = item.storageUri;
                return item;
            });
        }
    },
    methods: {
        ...mapMutations({
            updateAdListPagination: 'advertising/updateAdListPagination'
        }),
        ...mapActions({
            getAdvertisingOwnerById: 'advertising/getAdvertisingOwnerById',
            getAdListByAdvertiserId: 'advertising/getAdListByAdvertiserId'
        }),
        editAdvertisingOwnerHandler() {
            let {id} = this.$route.params;
            this.$router.push({name: 'EditAdvertisingOwner', params: {id}});
        },
        gotoList() {
            this.$router.push({name: 'AdvertisingOwnerList'});
        },
        handlePaginationChange(value, key) {
            let {id} = this.$route.params;
            this.updateAdListPagination({key, value});
            this.getAdListByAdvertiserId(id);
        }
    }
};
</script>
<style lang="scss" scoped>
.common-details .info-section .attributes .item-label {
    width: 100px;
}
</style>
