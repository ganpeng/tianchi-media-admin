<!--导出所有注入失败视频列表-->
<template>
    <div>
        <div class="vice-block">
            <h3 class="block-vice-title">2.导出失败视频列表</h3>
            <el-button class="create-blue-btn" @click="exportVideoFailedList">导出所有注入失败视频列表</el-button>
        </div>
        <div class="vice-block">
            <h3 class="block-vice-title">3.导出节目列表</h3>
            <el-select
                v-model="programmeQueryParams.programmeCategoryIdList"
                clearable
                multiple
                placeholder="请选择节目分类">
                <el-option
                    v-for="item in categoryOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button class="create-blue-btn" @click="exportFilmProgrammeList">导出对应节目列表</el-button>
        </div>
        <div class="vice-block">
            <h3 class="block-vice-title">3.导出所有注入成功的视频列表</h3>
            <el-button class="create-blue-btn" @click="exportVideoSuccessList">导出成功注入视频列表</el-button>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx';

    export default {
        name: 'ExportExcelVideoFailed',
        data() {
            return {
                videoAllList: [],
                videoAllListQueryParams: {
                    status: '',
                    videoType: '',
                    name: '',
                    pageNum: 0,
                    pageSize: 20000
                },
                programmeList: [],
                programmeQueryParams: {
                    releaseAtStart: '',
                    releaseAtEnd: '',
                    produceAreaList: [],
                    programmeCategoryIdList: [],
                    programmeTypeIdList: [],
                    visible: '',
                    keyword: '',
                    pageNum: 0,
                    pageSize: 8000
                },
                categoryOptions: [],
                littleTime: ''
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 节目类型分类
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                    }
                });
            },
            // 导出所有注入失败的视频列表
            exportVideoFailedList() {
                this.videoAllListQueryParams.status = 'FAILED';
                this.$service.getVideoList(this.videoAllListQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.videoAllList = response.data.list;
                        let exportChannelData = this.videoAllList;
                        let wb = XLSX.utils.book_new();
                        let newWsName = '表1';
                        let ws = XLSX.utils.json_to_sheet(exportChannelData);
                        XLSX.utils.book_append_sheet(wb, ws, newWsName);
                        XLSX.writeFile(wb, '视频注入失败表_' + new Date() + '.xlsx');
                    }
                });
            },
            // 导出所有注入成功的视频列表
            exportVideoSuccessList() {
                this.videoAllListQueryParams.status = 'SUCCESS';
                this.$service.getVideoList(this.videoAllListQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.videoAllList = response.data.list;
                        let exportChannelData = this.videoAllList;
                        let wb = XLSX.utils.book_new();
                        let newWsName = '表1';
                        let ws = XLSX.utils.json_to_sheet(exportChannelData);
                        XLSX.utils.book_append_sheet(wb, ws, newWsName);
                        XLSX.writeFile(wb, '视频注入成功表_' + new Date() + '.xlsx');
                    }
                });
            },
            exportFilmProgrammeList() {
                let nameList = '';
                for (let i = 0; i < this.programmeQueryParams.programmeCategoryIdList.length; i++) {
                    for (let m = 0; m < this.categoryOptions.length; m++) {
                        if (this.programmeQueryParams.programmeCategoryIdList[i] === this.categoryOptions[m].id) {
                            nameList = nameList + '_' + this.categoryOptions[m].name;
                        }
                    }
                }
                this.$service.getProgrammeList(this.programmeQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data.list;
                        let exportChannelData = this.programmeList;
                        let wb = XLSX.utils.book_new();
                        let newWsName = '表1';
                        let ws = XLSX.utils.json_to_sheet(exportChannelData);
                        XLSX.utils.book_append_sheet(wb, ws, newWsName);
                        XLSX.writeFile(wb, nameList + '节目表_' + new Date() + '.xlsx');
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    #export-programme {
        margin-top: 30px;
    }

</style>
