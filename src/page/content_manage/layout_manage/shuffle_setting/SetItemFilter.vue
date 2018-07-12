<!--内容管理-栏目管理-设置混排内的筛选组件-->
<template>
    <div class="text-center">
        <h3 class="text-left">1.请设置筛选条件：</h3>
        <el-select v-model="categorySignCode" clearable placeholder="请选择栏目类别">
            <el-option
                v-for="item in categoryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.signCode">
            </el-option>
        </el-select>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item :label="item.name" v-for="(item, index) in classDictionary[categorySignCode]" :key="index">
                <el-select v-model="type"
                           multiple clearable :placeholder='"请选择" + item.name'>
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <h3 class="text-left">2.请设置筛选项推荐图片：</h3>
        <div v-if="filter.coverImage && filter.coverImage.uri"
             :style="{ 'background-image': 'url(' + appendImagePrefix(filter.coverImage.uri) + ')'}"
             class="image-box">
        </div>
        <div class="add-box">
            <el-button type="success" @click="imageUploadDialogVisible = true">添加图片</el-button>
        </div>
        <el-button type="success" @click="complete">确 定</el-button>
        <upload-image
            :size='size'
            title="上传筛选推荐项封面图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import {PROGRAMME_DIMENSION as filterDimension} from '@/util/config/dimension';
    import dict from '@/util/config/dictionary';

    export default {
        name: 'SetItemFilter',
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originState 需要回填的筛选项的信息
         * */
        props: ['imageSpec', 'originState'],
        components: {
            UploadImage
        },
        data() {
            return {
                type: '',
                typeOptions: [],
                classDictionary: dict.CLASS_DICTIONARY,
                size: filterDimension,
                imageUploadDialogVisible: false,
                filter: {
                    coverImage: {}
                },
                categorySignCode: '',
                categoryOptions: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.originState && this.originState.coverImage) {
                    this.filter = this.originState;
                }
                this.$service.getProgrammeCategory().then(response => {
                    if (response && response.code === 0) {
                        this.categoryOptions = response.data;
                        for (let i = 0; i < this.categoryOptions.length; i++) {
                            if (this.categoryOptions[i].name === '新时代党建') {
                                this.categoryOptions.splice(i, 1);
                            }
                        }
                        for (let i = 0; i < this.categoryOptions.length; i++) {
                            if (this.categoryOptions[i].name === '幽默') {
                                this.categoryOptions.splice(i, 1);
                            }
                        }
                    }
                });
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 添加封面图片
            addPosterImage(coverImage) {
                this.filter.coverImage = coverImage.posterImage;
            },
            complete() {
                // 检测当前筛选项
                // 检测推荐筛选项的封面
                if (!this.filter.coverImage.id) {
                    this.$message({
                        message: '请设置推荐筛选项的封面',
                        type: 'warning'
                    });
                    return;
                }
                // 组成筛选项信息
                let filterItem = {
                    id: this.filter.id,
                    name: this.filter.name,
                    layoutItemType: 'FILTER',
                    coverImage: this.filter.coverImage
                };
                this.$emit('setShuffleItem', filterItem);
                this.$message({
                    message: '成功设置混排模块的筛选项',
                    type: 'success'
                });
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

    .image-box {
        height: 150px;
        width: 500px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    img {
        display: block;
        max-height: 180px;
        max-width: 300px;
    }

    label {
        text-align: center;
        font-size: 16px;
    }

    .add-box {
        margin-bottom: 30px;
    }
</style>
