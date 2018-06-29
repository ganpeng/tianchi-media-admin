<!--内容管理-栏目管理-节目选择第二步组件-->
<template>
    <div>
        <div class="text-left">1.符合该位置的底层图片如下，请选择：</div>
        <ul>
            <li v-for="(item,index) in specCoverImages" v-bind:key="index">
                <img :src="item.uri | imageUrl" :alt="item.name" @click="displayImage(index)">
                <el-radio v-model="programmeCoverImageId" :label="item.id" @change="setProgrammeCoverImage(index)">
                    {{item.name}}
                </el-radio>
            </li>
            <li @click="toEditProgramme">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <template v-if="coverImageBackgroundSpec">
            <div class="text-left">2.符合该位置的浮层图片如下，请选择：</div>
            <ul>
                <li v-for="(item,index) in specBackgroundImages" v-bind:key="index">
                    <img :src="item.uri | imageUrl" :alt="item.name" @click="displayImage(index)">
                    <el-radio v-model="programmeCoverImageBackgroundId" :label="item.id"
                              @change="setProgrammeCoverImageBackground(index)">
                        {{item.name}}
                    </el-radio>
                </li>
                <li @click="toEditProgramme">
                    <i class="el-icon-plus"></i>
                </li>
            </ul>
        </template>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';
    import {LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';

    export default {
        name: 'ProgrammeSecondStep',
        components: {PreviewMultipleImages},
        props: ['programmeId', 'posterImages', 'originState'],
        computed: {
            specCoverImages() {
                return this.posterImages.filter(image => parseInt(image.width) === this.coverImageSpec.width && parseInt(image.height) === this.coverImageSpec.height);
            },
            specBackgroundImages() {
                if (this.coverImageBackgroundSpec) {
                    return this.posterImages.filter(image => parseInt(image.width) === this.coverImageBackgroundSpec.width && parseInt(image.height) === this.coverImageBackgroundSpec.height);
                } else {
                    return [];
                }
            }
        },
        data() {
            return {
                coverImageSpec: LAYOUT_IMAGE_DIMENSION[this.$route.params.imageSpec].coverImage,
                // 当前模板封面图片的出格背景图的尺寸
                coverImageBackgroundSpec: LAYOUT_IMAGE_DIMENSION[this.$route.params.imageSpec].coverImageBackground,
                // 正常的封面图的id
                programmeCoverImageId: '',
                programmeCoverImageBackgroundId: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.programmeCoverImageId = this.originState.coverImage ? this.originState.coverImage.id : '';
                this.programmeCoverImageBackgroundId = this.originState.coverImageBackground ? this.originState.coverImageBackground.id : '';
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.specCoverImages;
                this.previewImage.activeIndex = index;
            },
            // 选择正常封面图片
            setProgrammeCoverImage(index) {
                this.$emit('setProgrammeCoverImage', this.specCoverImages[index]);
            },
            // 选择出格背景图
            setProgrammeCoverImageBackground(index) {
                this.$emit('setProgrammeCoverImageBackground', this.specBackgroundImages[index]);
            },
            // 跳转到节目编辑页面
            toEditProgramme() {
                this.$confirm('此操作将前往节目编辑页面,不会保存当前数据 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({name: 'EditProgramme', params: {id: this.programmeId}});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    div {
        margin-top: 30px;
        font-size: 20px;
    }

    ul {
        display: flex;
        margin-top: 30px;
        justify-content: left;
        flex-wrap: wrap;
        li {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: space-around;
            height: 230px;
            &:last-child {
                justify-content: center;
                width: 180px;
                height: 180px;
                border: 1px dotted gray;
                text-align: center;
                cursor: pointer;
                &:hover {
                    border: 1px dotted #409EFF;
                    i {
                        color: #409EFF;
                    }
                }
            }
            img {
                display: block;
                max-height: 180px;
                max-width: 400px;
                cursor: zoom-in;
            }
            .el-radio {
                font-size: 16px;
            }
        }
    }
</style>
