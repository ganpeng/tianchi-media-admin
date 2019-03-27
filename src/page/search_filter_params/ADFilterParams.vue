<!--广告列表搜索参数设置组件-->
<template>
    <div class="subject-search-container">
        <div @keyup.enter="getADList" class="text-left filters-container">
            <el-form :inline="true" class="filter-form">
                <el-form-item>
                    <el-input
                        v-model="listQueryParams.keyword"
                        clearable
                        @change="getADList(true)"
                        class="border-input"
                        placeholder="搜索你想要的信息">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="getADList(false)"
                        type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select
                        v-model="listQueryParams.adType"
                        @change="getADList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in adTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上下架">
                    <el-select
                        v-model="listQueryParams.visible"
                        @change="getADList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in visibleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select
                        v-model="listQueryParams.adStatus"
                        @change="getADList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button
                        class="btn-style-one"
                        @click="clearFilters"
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
                <el-form-item label="资源类型">
                    <el-select
                        v-model="listQueryParams.mediaType"
                        @change="getADList(true)"
                        clearable
                        placeholder="全部">
                        <el-option
                            v-for="item in mediaTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        v-model="createRangeTime"
                        @change="getADList(true)"
                        type="daterange"
                        clearable
                        value-format="timestamp"
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

    export default {
        name: 'AdFilterParams',
        data() {
            return {
                moreFilters: false,
                listQueryParams: {
                    keyword: '',
                    adType: '',
                    adStatus: '',
                    mediaType: '',
                    createdAtStart: '',
                    createdAtEnd: '',
                    visible: ''
                },
                createRangeTime: [],
                adTypeOptions: [
                    {value: 'BOOT', label: '开机广告'},
                    {value: 'PAUSE', label: '暂停广告'},
                    {value: 'PREPOSITION', label: '片头广告'},
                    {value: 'VOLUME', label: '音量条广告'},
                    {value: 'PROGRAMME_DETAIL', label: '详情页广告'},
                    {value: 'CHANNEL_SWITCH', label: '换台广告'},
                    {value: 'SCREEN_SAVER', label: '屏保广告'}
                ],
                mediaTypeOptions: [
                    {value: 'VIDEO', label: '视频'},
                    {value: 'IMAGE', label: '图片'}
                ],
                statusOptions: [
                    {value: 'ACTIVE', label: '生效中'},
                    {value: 'WAITING', label: '未生效'},
                    {value: 'EXPIRED', label: '已失效'}
                ],
                visibleOptions: [
                    {value: true, label: '已上架'},
                    {value: false, label: '已下架'}
                ]
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            initFilterParams(params) {
                this.listQueryParams.visible = params.visible !== '' ? params.visible : '';
                this.listQueryParams.keyword = params.keyword ? params.keyword : '';
                this.listQueryParams.adType = params.adType ? params.adType : '';
                this.listQueryParams.adStatus = params.adStatus ? params.adStatus : '';
                this.listQueryParams.mediaType = params.mediaType ? params.mediaType : '';
                this.listQueryParams.createdAtStart = params.createdAtStart ? params.createdAtStart : '';
                this.listQueryParams.createdAtEnd = params.createdAtEnd ? params.createdAtEnd : '';
                this.createRangeTime = params.createdAtStart ? [params.createdAtStart, params.createdAtEnd] : [];
            },
            init() {

            },
            getADList(isReset) {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.createdAtStart = this.createRangeTime[0];
                    this.listQueryParams.createdAtEnd = this.createRangeTime[1];
                } else {
                    this.listQueryParams.createdAtStart = '';
                    this.listQueryParams.createdAtEnd = '';
                }
                this.$emit('getADList', this.listQueryParams, isReset);
            },
            clearFilters() {
                this.createRangeTime = [];
                for (let key in this.listQueryParams) {
                    if (Array.isArray(this.listQueryParams[key])) {
                        this.listQueryParams[key] = [];
                    } else {
                        this.listQueryParams[key] = '';
                    }
                }
                this.getADList(true);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .subject-search-container {
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
