<!--视频列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'视频资源管理'},
            {name:'视频列表'}]">
        </custom-breadcrumb>
        <el-form id="label-font" :inline="true" class="demo-form-inline search-form text-left" @keyup.enter.native="searchHandler" @submit.native.prevent>
            <el-col :span="24">
                <el-dropdown class="float-right">
                    <el-button icon="el-icon-upload2" type="primary" plain>
                        上传视频<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <div class="wrapper">
                                <label for="upload-input">选择文件</label>
                                <input id="upload-input-file" class="upload-input" type="file" ref="uploadInputFile" multiple>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="wrapper">
                                <label for="upload-input">选择文件夹</label>
                                <input id="upload-input-dir" class="upload-input" type="file" ref="uploadInputDir" multiple directory webkitdirectory allowdirs>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
            <el-col :span="24">
                <el-form-item class="search">
                    <el-input
                        :value="searchFields.name"
                        placeholder="搜索你想要的信息"
                        clearable
                        style="width:400px;"
                        @input="inputHandler($event, 'name')"
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="search">
                    <el-select
                        :value="searchFields.status"
                        clearable
                        placeholder="请选择视频注入状态"
                        @input="inputHandler($event, 'status')"
                    >
                        <el-option
                            v-for="(item, index) in statusOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="page-main-btn" type="primary" icon="el-icon-search" @click="searchHandler" plain>搜索</el-button>
                    <el-button class="clear-filter page-main-btn clear-btn" type="primary" @click="clearSearchFields" plain>
                        <svg-icon
                            icon-class="clear_filter"
                            class-name="svg-box">
                        </svg-icon>
                        清空筛选条件
                    </el-button>
                </el-form-item>
                <el-form-item class="float-right">
                    <el-button size="small" type="danger" @click="deleteVideoList"><i class="el-icon-delete"></i> 批量删除</el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <video-table ref="videoTable"></video-table>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import VideoTable from './VideoTable';
    import role from '@/util/config/role';
    const Uppie = require('../../assets/js/uppie');
    const uppie = new Uppie();
    export default {
        name: 'VideoList',
        components: {
            VideoTable
        },
        data() {
            return {
                statusOptions: role.VIDEO_UPLOAD_STATUS_OPTIONS,
                timer: null
            };
        },
        computed: {
            ...mapGetters({
                video: 'video/video',
                searchFields: 'video/searchFields',
                uploadState: 'uploadVideo/uploadState',
                selectedVideoIdList: 'video/selectedVideoIdList'
            })
        },
        created() {
            window.eventBus.$on('clearInputValue', this.clearInputValue.bind(this));
            this.$nextTick(() => {
                uppie(document.querySelector('#upload-input-file'), this.uploadChangeHandler.bind(this));
                uppie(document.querySelector('#upload-input-dir'), this.uploadChangeHandler.bind(this));
            });
            window.addEventListener('keyup', this.keyupHandler);
            this.timer = setInterval(() => {
                this.getVideoList()
                    .then(() => {
                        this.$refs.videoTable.checkedVideoList();
                    });
            }, 1000 * 10);
        },
        beforeRouteLeave(to, from, next) {
            clearInterval(this.timer);
            this.timer = null;
            next();
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        methods: {
            ...mapMutations({
                updateSearchFields: 'video/updateSearchFields',
                resetSearchFields: 'video/resetSearchFields',
                updateUploadState: 'uploadVideo/updateUploadState'
            }),
            ...mapActions({
                getVideoList: 'video/getVideoList'
            }),
            clearSearchFields() {
                this.resetSearchFields();
            },
            clearInputValue() {
                this.$refs.uploadInputFile.value = '';
                this.$refs.uploadInputDir.value = '';
            },
            deleteVideoList() {
                let idList = this.$refs.videoTable.selectedVideoList.map((item) => {
                    return item.id;
                });
                if (idList.length > 0) {
                    this.$confirm(`您确定要删除吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        if (idList.length > 0) {
                            this.$service.deleteVideoByIdList(idList)
                                .then((res) => {
                                    if (res && res.code === 0) {
                                        this.getVideoList()
                                            .then(() => {
                                                this.$refs.videoTable.checkedVideoList();
                                            });
                                        this.$message.success('删除成功');
                                    } else {
                                        this.$message.error('删除失败');
                                    }
                                });
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.searchHandler();
                }
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            searchHandler() {
                this.getVideoList()
                    .then(() => {
                        this.$refs.videoTable.checkedVideoList();
                    });
            },
            uploadChangeHandler(e) {
                let files = Array.from(e.target.files).filter((file) => {
                    return /.mpg$/.test(file.name);
                });
                let newFileList = [];
                files.forEach((file) => {
                    let index = this.uploadState.files.findIndex((item) => {
                        return item.file.name === file.name;
                    });
                    if (index === -1) {
                        let obj = {
                            file,
                            progress: {
                                percent: 0,
                                status: 'waiting',
                                message: ''
                            }
                        };
                        newFileList.push(obj);
                    }
                });
                let newFiles = this.uploadState.files.concat(newFileList);
                this.updateUploadState({key: 'files', value: newFiles});
                window.eventBus.$emit('startUpload');
            }
        }
    };
</script>
<style scoped lang="less">
.wrapper {
    position: relative;
    width: 80px;
    height: 32px;
    margin-right: 10px;
    label, .upload-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 80px;
        height: 32px;
    }
    .upload-input {
        opacity: 0;
        cursor: pointer;
    }
}
</style>
