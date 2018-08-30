<!-- 新建人物的表单组件 -->
<template>
    <div class="person-form-container">
        <el-form :model="person" :rules="infoRules" status-icon ref="createPerson"
                label-width="100px"
                @submit.native.prevent
                class="form-block">
            <el-col :span="isDialog ? 24 : 8">
                <el-form-item label="人物姓名" prop="name">
                    <el-input
                        :value="person.name"
                        :disabled="readonly"
                        @input="inputHandler($event, 'name')"
                        placeholder="请输入人物姓名"
                    ></el-input>
                </el-form-item>
                <el-form-item label="人物简介" prop="description">
                    <el-input
                        type="textarea"
                        :disabled="readonly"
                        :maxlength="300"
                        :minlength="110"
                        :autosize="{ minRows: 4, maxRows: 12}"
                        placeholder="请输入人物简介"
                        :value="person.description"
                        @input="inputHandler($event, 'description')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker
                        :value="person.birthday"
                        :disabled="readonly"
                        type="date"
                        placeholder="年/月/日"
                        @input="inputHandler($event, 'birthday')"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="所属地区" prop="area">
                    <el-select
                        :disabled="readonly"
                        clearable
                        filterable
                        :value="person.area"
                        placeholder="请选择地区"
                        @input="inputHandler($event, 'area')"
                    >
                        <el-option
                            v-for="(item, index) in areaOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="身高" prop="height">
                    <el-input
                        type="number"
                        :disabled="readonly"
                        placeholder=""
                        :value="person.height"
                        @input="inputHandler($event, 'height')"
                    >
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="体重" prop="weight">
                    <el-input
                        type="number"
                        :disabled="readonly"
                        placeholder=""
                        :value="person.weight"
                        @input="inputHandler($event, 'weight')"
                    >
                        <template slot="append">kg</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="职业" prop="mainRoleList">
                    <el-select
                        multiple
                        :disabled="readonly"
                        :value="(person.mainRoleList ? person.mainRoleList : [])"
                        placeholder="请选择职业"
                        @input="inputHandler($event, 'mainRoleList')"
                    >
                        <el-option
                            v-for="item in mainRoleoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="人物图片" required>
                    <div class="text-left clearfix">
                        <el-button
                            class="float-left page-main-btn create-blue-btn contain-svg-icon"
                            v-if="!readonly"
                            @click="uploadImageHandler">
                            <svg-icon
                                icon-class="image"
                                class-name="svg-box">
                            </svg-icon>
                            上传图片
                        </el-button>
                        <span class="text-info">人物的头像: 200*200,人物背景图: 1920*1080都必须上传</span>
                    </div>
                    <div class="wrapper">
                        <thumbnail
                            :removeSign="!readonly"
                            :imageList="person.posterImageList"
                            v-on:removeImage="_deletePosterImage">
                        </thumbnail>
                    </div>
                </el-form-item>
            </el-col>
        </el-form>
        <upload-image
            :size='size'
            title="上传人物图片"
            ref="uploadImageDialog"
            :successHandler="addPosterImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)"
        >
        </upload-image>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>
<script>

/**
 *
 * 图片上传的逻辑，每种尺寸的图片必须且只能传一张, 如果都传了就不现实长传图片的按钮，传过的图片的尺寸，不能在尺寸列表中显示该尺寸， 图片支持删除
 *
 */
import {mapGetters, mapMutations} from 'vuex';
import store from 'store';
import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
import Thumbnail from '../../components/custom_components/custom/Thumbnail';
import dimension from '@/util/config/dimension';
import role from '@/util/config/role';
import {requiredValidator} from '@/util/formValidate';

export default {
    name: 'PersonForm',
    props: {
        status: {
            type: Number,
            default: 0
        },
        readonly: {
            type: Boolean,
            default: false
        },
        isDialog: {
            type: Boolean,
            default: false
        }
    },
    components: {
        UploadImage,
        PreviewMultipleImages,
        Thumbnail
    },
    computed: {
        ...mapGetters({
            person: 'person/currentPerson',
            recommend: 'person/recommend'
        })
    },
    data() {
        return {
            infoRules: {
                name: [
                    { required: true, message: '请输入人物名称' }
                ],
                description: [
                    { required: true, message: '请输入人物简介' }
                ],
                area: [
                    { required: true, message: '请选择区域' },
                    { validator: requiredValidator('请选择区域') }
                ],
                mainRoleList: [
                    { required: true, message: '请输入人物职业' },
                    { validator: requiredValidator('请输入人物职业') }
                ]
            },
            imageUploadDialogVisible: false,
            areaOptions: store.get('areaList'),
            mainRoleoptions: role.MAIN_ROLE_OPTIONS,
            recommendOptions: role.RECOMMEND_OPTIONS,
            size: dimension.PERSON_DIMENSION,
            previewImage: {
                display: false,
                autoplay: false,
                activeIndex: 0,
                list: []
            },
            isRecomend: 1
        };
    },
    methods: {
        ...mapMutations({
            updateCurrentPerson: 'person/updateCurrentPerson',
            addPosterImage: 'person/addPosterImage',
            deletePosterImage: 'person/deletePosterImage',
            updateRecommend: 'person/updateRecommend'
        }),
        uploadImageHandler() {
            if (!this.readonly) {
                this.imageUploadDialogVisible = true;
            }
        },
        closeImageDialog(status) {
            this.imageUploadDialogVisible = status;
        },
        inputHandler(value, key) {
            this.updateCurrentPerson({key, value});
        },
        inputRecommendHandler(value, key) {
            this.updateRecommend({key, value});
        },
        changeIsRecommendHandler(value) {
            this.updateRecommend({key: 'isRecommend', value});
            if (value === 1) {
                this.updateRecommend({key: 'recommendList', value: []});
            }
        },
        _deletePosterImage(index, id) {
            this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deletePosterImage({id});
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        displayImage(index) {
            this.previewImage.display = true;
            this.previewImage.list = this.person.posterImageList;
            this.previewImage.activeIndex = index;
        },
        appendImagePrefix(uri) {
            let baseUri = window.localStorage.getItem('imageBaseUri');
            return baseUri + uri;
        }
    }
};
</script>
<style lang="less" scoped>
.person-form-container {
    margin-top: 60px;
}
.text-info {
    margin-left: 10px;
}
.wrapper {
    margin-top: 20px;
}
</style>
