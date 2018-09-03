<!--内容管理-栏目管理-设置混排内的网页组件-->
<template>
    <div class="text-center">
        <h3 class="text-left">1.请输入网页地址：</h3>
        <el-input
            placeholder="请输入网页地址"
            v-model="webPage.href"
            clearable>
        </el-input>
        <h3 class="text-left">2.请设置网页推荐图片：</h3>
        <div v-if="webPage.coverImage && webPage.coverImage.uri"
             :style="{ 'background-image': 'url(' + appendImagePrefix(webPage.coverImage.uri) + ')'}"
             class="image-box">
        </div>
        <div class="add-box">
            <el-button class="create-blue-btn contain-svg-icon" @click="imageUploadDialogVisible = true">
                <svg-icon icon-class="image"></svg-icon>
                添加图片
            </el-button>
        </div>
        <div class="text-right">
            <el-button type="primary" @click="complete">确 定</el-button>
        </div>
        <upload-image
            :size='size'
            title="上传网页封面图片"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';

    export default {
        name: 'SetItemWebPage',
        /** imageSpec 当前选择的节目中适合当前板式的图片集合
         *  originState 需要回填的网页的信息
         * */
        props: ['imageSpec', 'originState'],
        components: {
            UploadImage
        },
        data() {
            return {
                size: [],
                imageUploadDialogVisible: false,
                webPage: {
                    href: '',
                    coverImage: {}
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.initImageSize();
                if (this.originState && this.originState.coverImage) {
                    this.webPage.coverImage = this.originState.coverImage;
                    this.webPage.href = JSON.parse(this.originState.params).href;
                }
            },
            initImageSize() {
                let spec = this.imageSpec.width + '*' + this.imageSpec.height;
                this.size.push({
                    value: spec,
                    label: '当前尺寸：' + spec
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
                this.webPage.coverImage = coverImage.posterImage;
            },
            complete() {
                // 检测当前网页的地址
                if (!this.webPage.href || !this.$util.isWebSiteAddress(this.webPage.href)) {
                    this.$message({
                        message: '请设置正确的推荐网页地址',
                        type: 'warning'
                    });
                    return;
                }
                // 检测推荐网页的封面
                if (!this.webPage.coverImage.id) {
                    this.$message({
                        message: '请设置推荐网页的封面',
                        type: 'warning'
                    });
                    return;
                }
                // 组成网页信息
                let webPageItem = {
                    id: this.webPage.id,
                    name: this.webPage.name,
                    params: JSON.stringify({
                        href: this.webPage.href
                    }),
                    layoutItemType: 'LINK',
                    coverImage: this.webPage.coverImage
                };
                this.$emit('setShuffleItem', webPageItem);
                this.$message({
                    message: '成功设置混排模块的网页',
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
