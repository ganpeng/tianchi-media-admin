<!--添加节目-->
<template>
    <div class="program-container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>节目资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>新增节目</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="24">
                <el-col :span="8">
                    <div class="block-title">节目基本信息</div>
                    <el-form ref="form" :model="program" label-width="100px" class="form-block">
                        <el-form-item label="节目名称">
                            <el-input v-model="program.name"></el-input>
                        </el-form-item>
                        <el-form-item label="节目简介">
                            <el-input
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 40}"
                                placeholder="请输入内容"
                                v-model="program.profile">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="上映时间">
                            <el-date-picker
                                v-model="program.releaseTime"
                                type="year"
                                placeholder="选择年">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="所属地区">
                            <el-select v-model="program.area" placeholder="请选择">
                                <el-option
                                    v-for="item in areaOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目分类">
                            <el-select v-model="program.programClassification" placeholder="请选择">
                                <el-option
                                    v-for="item in programOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" plain>管理分类和类型</el-button>
                        </el-form-item>
                        <el-form-item label="节目类型">
                            <el-select v-model="program.programType" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节目主演">
                            <el-select v-model="program.leadActor" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in leadOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" plain>新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="节目导演">
                            <el-select v-model="program.programType" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in directorOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="primary" plain>新增人物</el-button>
                        </el-form-item>
                        <el-form-item label="节目图片">
                            <el-button type="primary" @click="imageUploadDialogVisible = true">添加节目图片<i class="el-icon-upload el-icon--right"></i></el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-col>
            <el-col :span="24">
                <div class="block-title">节目视频</div>
                <div class="block-title text-left">
                    <el-button size="small" type="primary" @click="videoUploadDialogVisible = true">添加视频</el-button>
                </div>
            </el-col>
        </el-row>
        <!-- 电影表格 -->
        <el-row class="block-title">
            <h2 class="table-title">电影</h2>
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                prop="date"
                label="序号"
                width="180">
                </el-table-column>
                <el-table-column
                prop="name"
                label="子集名称"
                width="180">
                </el-table-column>
                <el-table-column
                prop="address"
                label="子集简介">
                </el-table-column>
                <el-table-column
                prop="address"
                label="视频地址">
                </el-table-column>
                <el-table-column
                prop="address"
                label="视频类型">
                </el-table-column>
                <el-table-column
                prop="address"
                label="上传时间">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="160">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="danger" size="small">删除</el-button>
                        <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 电视剧表格 -->
        <el-row class="block-title">
            <h2 class="table-title">电视剧</h2>
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="序号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="子集名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="子集简介">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="关联正片">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="视频地址">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="视频类型">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="上传时间">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="160">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="danger" size="small">删除</el-button>
                        <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <!-- 综艺表格 -->
        <el-row class="block-title">
            <h2 class="table-title">综艺</h2>
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="date"
                    label="序号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="子集名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="子集简介">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="关联正片">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="视频地址">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="视频类型">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="上传时间">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="220">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="danger" size="small">删除</el-button>
                        <el-button @click="handleClick(scope.row)" type="primary" size="small">编辑</el-button>
                        <el-button @click="handleClick(scope.row)" type="warning" size="small">下架</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <div class="group">
            <el-button type="primary" @click="onSubmit">创建</el-button>
        </div>
        <upload-program-image-dialog :imageUploadDialogVisible="imageUploadDialogVisible" v-on:changeImageDialogStatus="closeImageDialog($event)"></upload-program-image-dialog>
        <upload-program-video-dialog :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-program-video-dialog>
    </div>
</template>
<script>
    import UploadProgramImageDialog from './UploadProgramImageDialog';
    import UploadProgramVideoDialog from './UploadProgramVideoDialog';

    export default {
        name: 'CreateProgram',
        components: {
            UploadProgramImageDialog,
            UploadProgramVideoDialog
        },
        data() {
            return {
                program: {
                    name: '',
                    area: '',
                    programClassification: '',
                    programType: [],
                    leadActor: [],
                    director: [],
                    releaseTime: '',
                    programImageList: [],
                    profile: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    desc: ''
                },
                imageUploadDialogVisible: false,
                dialogImageUrl: '',
                dialogVisible: false,
                videoUploadDialogVisible: false,
                areaOptions: [
                    {
                        value: '大陆',
                        label: '大陆'
                    },
                    {
                        value: '香港',
                        label: '香港'
                    },
                    {
                        value: '台湾',
                        label: '台湾'
                    }
                ],
                programOptions: [
                    {
                        value: '电视剧',
                        label: '电视剧'
                    },
                    {
                        value: '电影',
                        label: '电影'
                    },
                    {
                        value: '综艺',
                        label: '综艺'
                    }
                ],
                typeOptions: [
                    {
                        value: '战争',
                        label: '战争'
                    },
                    {
                        value: '警匪',
                        label: '警匪'
                    },
                    {
                        value: '爱情',
                        label: '爱情'
                    }
                ],
                leadOptions: [
                    {
                        value: '王力宏',
                        label: '王力宏'
                    },
                    {
                        value: '刘德华',
                        label: '刘德华'
                    },
                    {
                        value: '杰克逊',
                        label: '杰克逊'
                    }
                ],
                directorOptions: [
                    {
                        value: '张艺谋',
                        label: '张艺谋'
                    },
                    {
                        value: '管虎',
                        label: '管虎'
                    },
                    {
                        value: '斯皮尔伯格',
                        label: '斯皮尔伯格'
                    }
                ],
                tableData: [
                    {
                        date: '2016-05-02',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        date: '2016-05-04',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1517 弄'
                    }, {
                        date: '2016-05-01',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                        date: '2016-05-03',
                        name: '王小虎',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }
                ]
            };
        },
        methods: {
            onSubmit() {
                console.log('submit!');
            },
            closeImageDialog(res) {
                this.imageUploadDialogVisible = res;
            },
            closeVideoDialog(res) {
                this.videoUploadDialogVisible = res;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleClick(row) {
                console.log(row);
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
