<!--视频列表搜索参数设置组件-->
<template>
    <div class="video-search-container">
        <div @keyup.enter="getVideoList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        clearable
                        class="border-input"
                        @change="getVideoList(true)"
                        placeholder="搜索你想要的信息">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getVideoList(true)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="后缀">
                    <el-select
                        v-model="listQueryParams.suffix"
                        clearable
                        placeholder="请选择视频后缀"
                        @change="getVideoList(true)">
                        <el-option
                            v-for="(item, index) in suffixOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注入状态">
                    <el-select
                        v-model="listQueryParams.status"
                        @change="getVideoList(true)"
                        clearable
                        placeholder="请选择注入状态">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--上传状态-->
                <el-form-item label="上传状态">
                    <el-select
                        v-model="listQueryParams.uploadStatus"
                        clearable
                        placeholder="请选择视频上传状态"
                        @change="getVideoList(true)">
                        <el-option
                            v-for="(item, index) in uploadStatusOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearSearchFields"
                        type="primary">
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="text"
                        @click="moreFilters = !moreFilters"
                        class="more-filters"
                        :class="{active:moreFilters}">
                        更多筛选
                        <i class="el-icon-arrow-up" v-if="moreFilters"></i>
                        <i class="el-icon-arrow-down" v-else></i>
                    </el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" class="more-filter-box filter-form" v-if="moreFilters">
                <!--拉取状态（子站）-->
                <el-form-item
                    v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                    label="拉取状态">
                    <el-select
                        v-model="listQueryParams.downloadStatus"
                        clearable
                        placeholder="请选择视频拉取状态"
                        @change="getVideoList(true)">
                        <el-option
                            v-for="(item, index) in downloadStatusOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源">
                    <el-select
                        v-model="listQueryParams.originSiteId"
                        clearable
                        placeholder="请选择视频来源"
                        @change="getVideoList(true)">
                        <el-option
                            v-for="(item, index) in sourceOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!--共享站点搜索（主站）-->
                <el-form-item
                    v-if="$wsCache.localStorage.get('siteInfo') && $wsCache.localStorage.get('siteInfo').siteMasterEnable"
                    label="共享站点">
                    <el-select
                        v-model="listQueryParams.shareSiteId"
                        clearable
                        placeholder="请选择共享站点"
                        @change="getVideoList(true)">
                        <el-option
                            v-for="(item, index) in shareSiteOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上传时间">
                    <el-date-picker
                        prefix-icon="0"
                        v-model="uploadRangeTime"
                        type="daterange"
                        @change="getVideoList(true)"
                        value-format="timestamp"
                        :unlink-panels="true"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    import role from '@/util/config/role';

    export default {
        name: 'VideoFilterParams',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    status: '',
                    downloadStatus: '',
                    uploadStatus: '',
                    suffix: '',
                    originSiteId: '',
                    shareSiteId: '',
                    startedAt: '',
                    endedAt: ''
                },
                uploadRangeTime: [],
                suffixOptions: role.VIDEO_SUFFIX_OPTIONS,
                statusOptions: role.VIDEO_INJECTING_STATUS_OPTIONS,
                downloadStatusOptions: role.VIDEO_DOWNLOAD_STATUS_OPTIONS,
                uploadStatusOptions: role.VIDEO_UPLOAD_STATUS_OPTIONS,
                sourceOptions: [],
                shareSiteOptions: [],
                moreFilters: false,
                timer: ''
            };
        },
        mounted() {
            this.init();
        },
        beforeDestroy() {
            this.timer = null;
        },
        methods: {
            initFilterParams(params) {
                this.uploadRangeTime = params.startedAt ? [params.startedAt, params.endedAt] : [];
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.status = params.status ? params.status : '';
                this.listQueryParams.downloadStatus = params.downloadStatus ? params.downloadStatus : '';
                this.listQueryParams.uploadStatus = params.uploadStatus ? params.uploadStatus : '';
                this.listQueryParams.suffix = params.suffix ? params.suffix : '';
                this.listQueryParams.originSiteId = params.originSiteId ? params.originSiteId : '';
                this.listQueryParams.shareSiteId = params.shareSiteId ? params.shareSiteId : '';
            },
            init() {
                let that = this;
                // 初始化视频来源和共享站点的列表
                this.$service.getAllSiteList().then(response => {
                    if (response && response.code === 0) {
                        this.shareSiteOptions = response.data;
                    }
                });
                this.$service.getAllVideoSourceList().then(response => {
                    if (response && response.code === 0) {
                        this.sourceOptions = response.data;
                    }
                });
                this.timer = setInterval(function () {
                    that.getVideoList();
                }, 10000);
            },
            getVideoList(isReset) {
                if (this.uploadRangeTime && this.uploadRangeTime.length === 2) {
                    this.listQueryParams.startedAt = this.uploadRangeTime[0];
                    this.listQueryParams.endedAt = this.uploadRangeTime[1];
                } else {
                    this.listQueryParams.startedAt = '';
                    this.listQueryParams.endedAt = '';
                }
                this.$emit('getVideoList', this.listQueryParams, isReset);
            },
            clearSearchFields() {
                for (let key in this.listQueryParams) {
                    this.listQueryParams[key] = '';
                }
                this.uploadRangeTime = [];
                this.getVideoList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .video-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
        }

        // 按钮
        .more-filters {
            font-size: 12px;
            color: #6F7480;
            &.active {
                color: #1989FA;
                i {
                    color: #6F7480;
                }
            }
            i {
                margin-left: 8px;
            }
        }

        .more-filter-box {
            background: #252C3D;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }

</style>
