<!--导出所有注入失败视频列表-->
<template>
    <div>
        <el-button class="create-blue-btn" @click="exportTemplate">导出所有注入失败视频列表</el-button>
    </div>
</template>

<script>
    import XLSX from 'xlsx';

    export default {
        name: 'ExportExcelVideoFailed',
        data() {
            return {
                videoAllFailedList: [],
                queryParams: {
                    status: 'FAILED',
                    videoType: '',
                    name: '',
                    pageNum: 0,
                    pageSize: 10
                },
                littleTime: ''
            };
        },
        mounted() {
        },
        methods: {
            // 导出所有轮播频道的表格
            exportTemplate() {
                this.$service.getVideoList(this.queryParams).then(response => {
                    if (response && response.code === 0) {
                        this.videoAllFailedList = response.data.list;
                        let exportChannelData = this.videoAllFailedList;
                        let wb = XLSX.utils.book_new();
                        let newWsName = '表1';
                        let ws = XLSX.utils.json_to_sheet(exportChannelData);
                        XLSX.utils.book_append_sheet(wb, ws, newWsName);
                        XLSX.writeFile(wb, '视频注入失败表_' + new Date() + '.xlsx');
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
