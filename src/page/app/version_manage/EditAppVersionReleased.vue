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
                            <label class="label">升级类型：</label>
                            <span class="value">{{version.productType === 'TV_LAUNCHER' ? '应用升级' : '系统升级'}}</span>
                        </div>
                    </li>
                    <li class="text-info-item">
                        <div class="text-info-item-wrapper">
                            <label class="label">全局升级：</label>
                            <span class="value">{{version.allCompanyUpdate ? '是' : '否'}}</span>
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
                            <label class="label">硬件类型：</label>
                            <span class="value">{{hardwareType(version.hardwareType)}}</span>
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
                            <label class="label">升级依据：</label>
                            <span class="value">{{version.updateAccord}}</span>
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
        <div class="seperator-line"></div>
        <div class="range-file-container">
            <h4 class="content-sub-title">升级范围文件</h4>
            <div class="select-wrapper">
                <div v-if="version.updateAccord" class="wrapper clearfix">
                    <div class="file float-left">
                        <input
                            ref="districtUpload"
                            type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            id="version-district-file-input">选择范围文件

                    </div>
                    <span class="float-left">{{districtFile.name}}</span>
                    <span class="pointer moban" @click="exportTemplate" >模版文件</span>
                </div>
                <div v-else class="wrapper clearfix">
                    <div class="file float-left">
                        <input
                            ref="districtUpload"
                            type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            id="version-district-file-input">选择范围文件
                    </div>
                    <span class="float-left">{{districtFile.name}}</span>
                    <span class="pointer moban" @click="exportTemplate" >模版文件</span>
                </div>
            </div>
            <el-table
                header-row-class-name="common-table-header"
                class="my-table-style" :data="version.batchList || []" border>
                <el-table-column align="center" width="120px" label="升级日期">
                    <template slot-scope="scope">
                        {{scope.row.createdAt  | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column label="升级依据" width="120px" align="center">
                    <template slot-scope="scope">
                        {{scope.row.haha || version.updateAccord}}
                    </template>
                </el-table-column>
                <el-table-column align="center" width="120px" label="状态">
                    <template slot-scope="scope">
                        {{releaseStatus(scope.row.releaseStatus)}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <div class="operator-btn-wrapper">
                            <span class="btn-text text-primary" @click="downloadBatchFile(scope.row)">下载</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import XLSX from 'xlsx';
import _ from 'lodash';

export default {
    name: 'EditAppVersionReleased',
    data() {
        return {
            currentLiveChannel: {},
            showCompanyList: true,
            districtFile: {}
        };
    },
    computed: {
        ...mapGetters({
            version: 'appVersion/version',
            filialeList: 'channel/filialeList'
        }),
        hardwareType() {
            return (hardwareType) => {
                return hardwareType ? (hardwareType === 'HARDWARE_3796' ? '3796' : '3798') : '无';
            };
        },
        updatedRatio() {
            return (updatedRatio) => {
                if (_.isNil(updatedRatio) || _.isNaN(updatedRatio)) {
                    return '';
                } else {
                    if (_.isInteger(updatedRatio)) {
                        return `${updatedRatio * 100}%`;
                    } else {
                        let _updatedRatio = this.$util.bankersRounding(updatedRatio * 100, 2);
                        return `${_updatedRatio}%`;
                    }
                }
            };
        },
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

            let districtUploadInputFile = document.querySelector('#version-district-file-input');
            districtUploadInputFile.addEventListener('input', this.districtUploadHandler);
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
        toggleClickHandler() {
            this.showCompanyList = !this.showCompanyList;
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
        },
        async downloadBatch(batch) {
            console.log(batch);
        },
        downloadBatchFile(batch) {
            let wb = XLSX.utils.book_new();
            let newWsName = '表1';
            let {createdAt, codeList} = batch;
            let wsData = codeList.map((code, index) => {
                return {
                    no: index,
                    value: code
                };
            });
            let ws = XLSX.utils.json_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, newWsName);
            XLSX.writeFile(wb, `范围文件${createdAt}.xlsx`);
        },
        exportTemplate() {
            let wb = XLSX.utils.book_new();
            let newWsName = '表1';
            let wsData = [
                {
                    no: '1',
                    value: '8512010000123458',
                    说明: 'B2 单元格填写 0 为全部 value'
                }, {
                    no: '2',
                    value: '8512010000123458',
                    说明: 'B2 单元格未填写则在导入时报错“value 不存在，无法导入”'
                }, {
                    no: '3',
                    value: '8512010000123458',
                    说明: 'value 可以为 CA卡号和 SN（设备序列号）的任何一种，但不能两个都有'
                }];
            let ws = XLSX.utils.json_to_sheet(wsData);
            XLSX.utils.book_append_sheet(wb, ws, newWsName);
            XLSX.writeFile(wb, '范围文件模版.xlsx');
        },
        async districtUploadHandler(e) {
            try {
                let file = e.target.files[0];
                let workbook = await this.readWorkbookFromLocalFile(file);
                let sheetNames = workbook.SheetNames; // 工作表名称集合
                let worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
                let resJson = XLSX.utils.sheet_to_json(worksheet);
                this.districtFile = file;
                let codeList = resJson.map((item) => item.value);
                this.addBatch({codeList});
            } catch (err) {
                console.log(err);
            }
        },
        readWorkbookFromLocalFile(file) {
            return new Promise((resolve) => {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let data = e.target.result;
                    let workbook = XLSX.read(data, {type: 'binary'});
                    resolve(workbook);
                };
                reader.readAsBinaryString(file);
            });
        },
        async editVersionHandler() {
            try {
                let {id} = this.$route.params;
                if (id) {
                    let res = await this.editVersionById(id);
                    if (res && res.code === 0) {
                        this.gotoList();
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
