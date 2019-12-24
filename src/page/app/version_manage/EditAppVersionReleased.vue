<template>
    <div class="live-channel-detail-container">
        <h2 class="content-title">编辑版本</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section person">
                <div class="default-person-image">
                    <svg-icon icon-class="ad_ads_owner"></svg-icon>
                </div>
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <div class="left-side">
                        <span class="title">{{version.version}}</span>
                        <span @click="launchVersion(version.id)" v-if="version.releaseStatus === 'RELEASED'" class="status text-primary">撤回</span>
                        <span v-if="version.releaseStatus === 'WITHDRAW'" class="status">已撤回</span>
                    </div>
                    <div class="right-wrapper">
                        <div class="date">
                            <span class="create-date">
                                创建于：{{version.releaseAt | formatDate('yyyy.MM.DD')}}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <ul class="text-info">
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">版本号：</label>
                            <span class="value">{{version.versionCode}}</span>
                        </div>
                    </li>
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">已升级设备数：</label>
                            <span class="value">{{version.stbCount}}</span>
                        </div>
                    </li>
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">影响设备数：</label>
                            <span class="value">{{influencingEquipmentNumber()}}</span>
                        </div>
                    </li>
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">升级方式：</label>
                            <span class="value">{{version.forced ? '强制升级' : '选择升级'}}</span>
                        </div>
                    </li>
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">升级包体积：</label>
                            <span class="value">{{convertFileSize(version.packageSize)}}</span>
                        </div>
                    </li>
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">升级包：</label>
                            <span class="value download-patch">
                                <a v-if="version.fullPackageUri"
                                    class="text-primary"
                                    style="color: #1989FA;"
                                    :href="packageUrl(version.fullPackageUri)">
                                    点击下载
                                </a>
                            </span>
                        </div>
                    </li>
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">升级说明：</label>
                            <span class="value">{{version.updateLog}}</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
    name: 'EditAppVersionReleased',
    computed: {
        ...mapGetters({
            version: 'appVersion/version'
        }),
        releaseStatus() {
            return (status) => {
                switch (status) {
                    case 'PRE_RELEASED':
                        return '未发布';
                    case 'RELEASED':
                        return '已发布';
                    case 'WITHDRAW':
                        return '已撤回';
                    default:
                        return '';
                }
            };
        },
        packageUrl(uri) {
            return (uri) => {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                return `${baseUri}${uri}`;
            };
        }
    },
    mounted() {
        this.$util.toggleFixedBtnContainer();
    },
    async created() {
        try {
            let {id} = this.$route.params;
            if (id) {
                await this.getVersionById(id);
            }
        } catch (err) {
            console.log(err);
        }
    },
    methods: {
        ...mapMutations({
            updateVersion: 'appVersion/updateVersion',
            addBatch: 'appVersion/addBatch'
        }),
        ...mapActions({
            getVersionById: 'appVersion/getVersionById',
            editVersionById: 'appVersion/editVersionById'
        }),
        gotoList() {
            this.$router.push({name: 'AppVersionList'});
        },
        influencingEquipmentNumber() {
            return this.version.clientVersionStatsList.reduce((res, curr) => {
                return res + curr.stbCountByCompany;
            }, 0);
        },
        convertFileSize(size) {
            return this.$util.convertFileSize(size);
        },
        //  dev_v2.5 新增
        async launchVersion(id) {
            try {
                let confirm = await this.$confirm(`您确定要撤回当前版本吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let res = await this.$service.launchVersion(id, 'WITHDRAW');
                    if (res && res.code === 0) {
                        this.updateVersion({key: 'releaseStatus', value: 'WITHDRAW'});
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.poster-section {
    img {
        display: block;
        width: 200px;
        height: 200px;
        border: 1px solid #3E495E;
        border-radius: 8px;
        box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
    }
}

.select-wrapper {
    width: 500px;
    margin-bottom: 20px;
    .moban {
        margin-left: 10px;
        color: #409EFF;
    }
    .file {
        position: relative;
        display: inline-block;
        background: #409EFF;
        border: 1px solid #409EFF;
        border-radius: 3px;
        font-size: 12px;
        line-height: 34px;
        padding: 0px 15px;
        overflow: hidden;
        color: #fff;
        text-decoration: none;
        text-indent: 0;
        margin-right: 10px;
    }
    .file input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        width: 80px;
        height: 34px;
        opacity: 0;
        cursor: pointer;
    }
}

.status {
    margin-left: 20px;
    &.text-primary {
        cursor: pointer;
    }
}

.my-table-style {
    width: 500px;
}

.text-info {
    display: flex;
    flex-wrap: wrap;
    width: 80%;
    .text-info-item {
        width: 50%;
        font-size: 16px;
        line-height: 32px;
        color: #A8ABB3;
        .text-info-item-wrapper {
            display: flex;
            .label {
                display: block;
                width: 120px;
                text-align: right;
            }
            .value {
                text-align: left;
                flex: 1;
            }
        }
    }
}

.content-sub-title {
    span:first-child {
        font-size: 20px;
    }
    .toggle-btn {
        font-size: 14px;
        cursor: pointer;
        margin-left: 40px;
        &.is-active,
        &:hover {
            color: $mainColor;
        }
        i {
            color: #3E495E;
        }
        &.disabled {
            opacity: 0.5;
            font-size: 14px;
            cursor: default;
        }
    }
}

.svg-icon-arrow_down {
    font-size: 12px;
}

.search-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 10px;
    .search-item {
        width: 200px;
        // height: 34px;
        line-height: 34px;
        background: #2A3040;
        border-radius: 4px;
        border: 1px solid #3E495E;
        margin-right: 20px;
        margin-bottom: 14px;
        .wrapper {
            position: relative;
            display: flex;
            align-items: center;
            height: 32px;
            border-bottom: 1px solid #3E495E;
            .index {
                width: 32px;
                height: 32px;
                line-height: 32px;
                color: #A8ABB3;
                border-right: 1px solid #3E495E;
            }
            .search-name {
                color:#A8ABB3;
                flex: 1;
                height: 32px;
                font-size: 14px;
                line-height: 32px;
                text-indent: 10px;
                text-align: left;
            }
            .ellipsis-content {
                display: none;
                position: absolute;
                top: -24px;
                left: 20px;
                background: rgba(0,0,0,0.90);
                box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.30);
                border-radius: 4px;
                white-space: nowrap;
                padding: 0 10px;
            }
            &:hover {
                .ellipsis-content {
                    display: block;
                }
            }
        }
    }
}
</style>
