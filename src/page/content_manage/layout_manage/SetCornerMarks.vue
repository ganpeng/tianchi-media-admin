<!--内容管理-栏目管理-设置专题内的节目第三步--设置角标组件-->
<template>
    <div>
        <h3 class="text-left">请勾选需要展示的角标：</h3>
        <el-checkbox-group v-model="checkedCornerMarks" @change="checkedCornerMarksChange" class="text-left">
            <el-checkbox v-if="checkVisible(item.markType)" v-for="(item,index) in cornerMarks" :label="item.markType"
                         :key="index">
                <label>{{item.markType | filterPosition}}</label>
                <label>{{item.markType | filterMarkType}}</label>
                <label>{{item.caption}}</label>
                <label>{{item.value}}</label>
            </el-checkbox>
            <el-checkbox label="CUSTOM">
                <label>右上角标</label>
                <label>运营角标</label>
                <img v-if="customImageUrl" :src="customImageUrl | imageUrl" class="custom-image">
                <el-button size="mini" type="success" @click="customCornerMarkVisible = true">选择运营角标</el-button>
            </el-checkbox>
        </el-checkbox-group>
        <el-dialog title="设置运营角标" :visible.sync="customCornerMarkVisible">
            <el-radio-group v-model="selectImageUrl">
                <el-radio :label="item.imageUrl" v-for="(item, index) in customCornerMarkList" :key="index">
                    <img :src="item.imageUrl | imageUrl" :alt="item.captain">
                </el-radio>
            </el-radio-group>
            <el-button @click="addCover">添加图片</el-button>
            <div slot="footer" class="dialog-footer">
                <el-button @click="customCornerMarkVisible = false">取 消</el-button>
                <el-button type="primary" @click="setCustomImageUrl">确 定</el-button>
            </div>
        </el-dialog>
        <upload-image
            :size='size'
            title="上传运营角标图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import cornerMarkOptions from '@/util/config/corner_mark';
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import {PROGRAMME_DIMENSION as subjectDimension} from '@/util/config/dimension';

    export default {
        name: 'SetCornerMarks',
        props: ['programme'],
        components: {
            UploadImage
        },
        data() {
            return {
                size: subjectDimension,
                customCornerMarkVisible: false,
                imageUploadDialogVisible: false,
                customImageUrl: '',
                selectImageUrl: '',
                checkedCornerMarks: [],
                currentMarks: {},
                cornerMarks: cornerMarkOptions,
                customCornerMarkList: [{
                    imageUrl: 'http://pic41.nipic.com/20140425/17567795_234801330000_2.jpg',
                    captain: '独家'
                }, {
                    imageUrl: 'http://pic26.nipic.com/20121214/11208347_175526604000_2.jpg',
                    captain: '热映'
                }, {
                    imageUrl: 'http://pic12.nipic.com/20110219/6608733_144445985000_2.jpg',
                    captain: '最热'
                }]
            };
        },
        filters: {
            filterPosition(markType) {
                switch (markType) {
                    case 'SCORE':
                        return '右下角标';
                    case 'EPISODES_NUMBER':
                        return '左下角标';
                    case 'COPYRIGHT_RESERVER':
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
                    case 'COPYRIGHT_RESERVER':
                        return '版权方角标';
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
                    }
                });
                // 获取运营角标列表
            },
            // 设置节目中的角标是否显示在当前页面中
            checkVisible(markType) {
                switch (markType) {
                    case 'SCORE':
                        return true;
                    case 'EPISODES_NUMBER':
                        return true;
                    case 'COPYRIGHT_RESERVER':
                        return true;
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
            addPosterImage(newPosterImage) {
                for (let i = 0; i < this.customCornerMarkList.length; i++) {
                    if (newPosterImage.posterImage.id === this.customCornerMarkList[i].id) {
                        this.$message('该图片已经添加到角标图片中');
                        return;
                    }
                }
                let imageList = this.customCornerMarkList.slice();
                imageList.push({imageUri: newPosterImage.posterImage.uri, captain: newPosterImage.posterImage.name});
                this.customCornerMarkList.push({
                    imageUri: newPosterImage.posterImage.uri,
                    captain: newPosterImage.posterImage.name
                });
                // 更新当前节目中的封面图片
            },
            // 选择某一个
            checkedCornerMarksChange() {
                if (this.checkedCornerMarks.toString().indexOf('CUSTOM') !== -1 && this.customImageUrl === '') {
                    this.$message('请选择运营角标');
                }
            },
            // 设置定制角标的imageUrl
            setCustomImageUrl() {
                this.customImageUrl = this.selectImageUrl;
                this.customCornerMarkVisible = false;
            },
            // 设置角标信息
            setCornerMarksSetting() {
                if (this.checkedCornerMarks.toString().indexOf('CUSTOM') !== -1 && this.customImageUrl === '') {
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
                                case 'COPYRIGHT_RESERVER':
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
                                imageUri: this.customImageUrl,
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
        flex-direction: row;
        .el-radio {
            display: flex;
            flex-direction: column-reverse;
            img {
                margin-bottom: 15px;
                width: 54px;
                height: 30px;
            }
        }
    }

</style>
