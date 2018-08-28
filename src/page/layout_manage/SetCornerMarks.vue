<!--内容管理-栏目管理-设置专题内的节目第三步--设置角标组件-->
<template>
    <div>
        <h3 class="text-left">请勾选需要展示的角标：</h3>
        <el-checkbox-group v-model="checkedCornerMarks" @change="checkedCornerMarksChange" class="text-left">
            <el-checkbox v-if="checkVisible(item.markType,item.caption)"
                         v-for="(item,index) in cornerMarks"
                         :label="item.markType"
                         :key="index">
                <label>{{item.markType | filterPosition}}</label>
                <label>{{item.markType | filterMarkType}}</label>
                <label>{{item.caption}}</label>
                <label>{{item.value}}</label>
            </el-checkbox>
            <el-checkbox label="CUSTOM">
                <label>右上角标</label>
                <label>运营角标</label>
                <img v-if="customImageUri" :src="customImageUri | imageUrl" class="custom-image">
                <el-button size="mini" type="primary" plain @click="customCornerMarkVisible = true">选择运营角标</el-button>
            </el-checkbox>
        </el-checkbox-group>
        <el-dialog title="设置运营角标"
                   :visible.sync="customCornerMarkVisible"
                   class="text-center"
                   append-to-body>
            <el-radio-group v-model="selectImageUri" class="text-center">
                <el-radio :label="item.imageUri" v-for="(item, index) in customCornerMarkList" :key="index">
                    <img :src="item.imageUri | imageUrl" :alt="item.captain">
                    <label @click="removeCornerMark(item.id,index,item.imageUri)">删除</label>
                </el-radio>
            </el-radio-group>
            <div class="text-center">
                <el-button class="create-blue-btn contain-svg-icon" @click="addCover">
                    <svg-icon icon-class="image"></svg-icon>
                    添加图片
                </el-button>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="page-vice-btn" @click="customCornerMarkVisible = false">取 消</el-button>
                <el-button class="page-vice-btn" type="primary" @click="setCustomImageUri">确 定</el-button>
            </div>
        </el-dialog>
        <upload-image
            :size='size'
            title="上传运营角标图片"
            :successHandler="addCustomCornerMarkImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import cornerMarkOptions from '@/util/config/corner_mark';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import {OPERATE_CORNER_MARK_DIMENSION} from '@/util/config/dimension';

    export default {
        name: 'SetCornerMarks',
        props: ['programme', 'originState'],
        components: {
            UploadImage
        },
        data() {
            return {
                size: OPERATE_CORNER_MARK_DIMENSION,
                customCornerMarkVisible: false,
                imageUploadDialogVisible: false,
                // 当前节目选择的运营角标
                customImageUri: '',
                // 运营角标列表中选择的角标
                selectImageUri: '',
                checkedCornerMarks: [],
                currentMarks: {},
                cornerMarks: cornerMarkOptions,
                customCornerMarkList: []
            };
        },
        filters: {
            filterPosition(markType) {
                switch (markType) {
                    case 'SCORE':
                        return '右下角标';
                    case 'EPISODES_NUMBER':
                        return '左下角标';
                    case 'PLATFORM':
                        return '左上角标';
                    default:
                        break;
                }
            },
            filterMarkType(markType) {
                switch (markType) {
                    case 'SCORE':
                        return '评分';
                    case 'EPISODES_NUMBER':
                        return '更新集数';
                    case 'PLATFORM':
                        return '平台角标';
                    default:
                        break;
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getProgrammeInfo({id: this.programme.id}).then(response => {
                    if (response && response.code === 0) {
                        this.cornerMarks = response.data.markList;
                        // 初始化原先的设置角标
                        for (let key in this.originState.cornerMark) {
                            if (this.originState.cornerMark[key]) {
                                this.checkedCornerMarks.push(this.originState.cornerMark[key].markType);
                            }
                        }
                        // 初始化运营角标
                        if (this.originState.cornerMark && this.originState.cornerMark.rightTop) {
                            this.customImageUri = this.selectImageUri = this.originState.cornerMark.rightTop.imageUri;
                        }
                    }
                });
                // 获取运营角标列表
                this.$service.getCornerMarkList({markType: 'CUSTOM'}).then(response => {
                    if (response && response.code === 0) {
                        this.customCornerMarkList = response.data;
                    }
                });
            },
            // 设置节目中的角标是否显示在当前页面中
            checkVisible(markType, caption) {
                switch (markType) {
                    case 'SCORE':
                        return true;
                    case 'EPISODES_NUMBER':
                        return true;
                    case 'PLATFORM':
                        // 检测当前平台角标是否能展示
                        return cornerMarkOptions.PLATFORM_MARK_SWITCH[caption] !== undefined;
                    default:
                        return false;
                }
            },
            // 添加节目封面图片
            addCover() {
                this.imageUploadDialogVisible = true;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 添加角标图片
            addCustomCornerMarkImage(newCustomCornerMarkImage) {
                for (let i = 0; i < this.customCornerMarkList.length; i++) {
                    if (newCustomCornerMarkImage.posterImage.id === this.customCornerMarkList[i].id) {
                        this.$message('该图片已经添加到角标图片中');
                        return;
                    }
                }
                // 添加当前角标到运营角标列表中
                this.$service.appendCornerMark({
                    caption: newCustomCornerMarkImage.posterImage.name,
                    imageUri: newCustomCornerMarkImage.posterImage.uri,
                    markType: 'CUSTOM'
                }).then(response => {
                    if (response && response.code === 0) {
                        this.customCornerMarkList.push({
                            imageUri: newCustomCornerMarkImage.posterImage.uri,
                            captain: newCustomCornerMarkImage.posterImage.name
                        });
                    }
                });
            },
            // 删除某一个角标
            removeCornerMark(cornerMarkId, index, imageUri) {
                if (this.customImageUri === imageUri) {
                    this.$message('当前运营角标已被该节目使用，不能删除');
                    return;
                }
                this.$confirm('此操作将永久删除该角标, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteCornerMark(cornerMarkId).then(response => {
                        if (response && response.code === 0) {
                            this.customCornerMarkList.splice(index, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 选择某一个
            checkedCornerMarksChange() {
                if (this.checkedCornerMarks.toString().indexOf('CUSTOM') !== -1 && this.customImageUri === '') {
                    this.$message('请选择运营角标');
                }
            },
            // 设置定制角标的imageUrl
            setCustomImageUri() {
                this.customImageUri = this.selectImageUri;
                this.customCornerMarkVisible = false;
            },
            // 设置角标信息
            setCornerMarksSetting() {
                if (this.checkedCornerMarks.toString().indexOf('CUSTOM') !== -1 && this.customImageUri === '') {
                    this.$message('请选择运营角标');
                    return false;
                }
                // 保存当前的设置
                this.checkedCornerMarks.map(markType => {
                    this.cornerMarks.map(cornerMark => {
                        if (markType === cornerMark.markType) {
                            switch (markType) {
                                case 'SCORE':
                                    this.currentMarks.rightBottom = cornerMark;
                                    break;
                                case 'EPISODES_NUMBER':
                                    this.currentMarks.leftBottom = cornerMark;
                                    break;
                                case 'PLATFORM':
                                    this.currentMarks.leftTop = cornerMark;
                                    break;
                                default:
                                    return false;
                            }
                        }
                        // 设置运营角标
                        if (markType === 'CUSTOM') {
                            this.currentMarks.rightTop = {
                                captain: '',
                                imageUri: this.customImageUri,
                                markType: 'CUSTOM'
                            };
                        }
                    });
                });
                this.$emit('setCornerMarks', this.currentMarks);
                return true;
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    h3 {
        margin-top: 30px;
        margin-bottom: 30px;
        font-size: 18px;
    }

    .el-checkbox {
        display: block;
        width: 400px;
        margin-top: 20px;
        margin-left: 30px;
        label {
            margin-right: 20px;
        }
    }

    .custom-image {
        height: 30px;
        width: 54px;
    }

    .el-radio-group {
        display: flex;
        margin-bottom: 20px;
        flex-direction: row;
        .el-radio {
            display: flex;
            flex-direction: column-reverse;
            img {
                display: block;
                margin-bottom: 15px;
                width: 54px;
                height: 30px;
            }
            label {
                display: block;
                margin-bottom: 10px;
                color: #409EFF;
                cursor: pointer;
            }
        }
    }

</style>
