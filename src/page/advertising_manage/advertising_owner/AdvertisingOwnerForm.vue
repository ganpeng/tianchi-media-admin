<template>
    <div class="advertising-owner-form-container">
        <div class="form-container">
            <el-form :model="advertisingOwner" :rules="inputRules" ref="advertisingOwnerForm" @submit.native.prevent class="my-form" label-width="120px">
                <el-col :span="8">
                    <el-form-item label="广告主名称" prop="name">
                        <el-input
                            :value="advertisingOwner.name"
                            :maxlength="30"
                            placeholder="请输入广告主名称"
                            @input="inputHandler($event, 'name')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="广告主备注" prop="description">
                        <el-input
                            :value="advertisingOwner.description"
                            :maxlength="100"
                            placeholder="请输入广告主备注"
                            @input="inputHandler($event, 'description')"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="20">
                    <el-form-item label="资源上传">
                        <span class="prompt-info-icon">
                            <svg-icon icon-class="info_i_1"></svg-icon>
                            <div class="prompt-info-dialog">
                                <p>
                                    ·换台广告、详情页广告
                                </p>
                                <p>
                                    支持PNG/JPG/WEBP/GIF ，432*198，GIF1MB以内，其余200KB以内
                                </p>
                                <p>
                                    ·调音广告
                                </p>
                                <p>
                                    支持PNG，320*140，100KB以内
                                </p>
                                <p>
                                    ·暂停广告
                                </p>
                                <p>
                                    支持PNG/JPG/WEBP ，1200*600，1MB以内
                                </p>
                                <p>
                                    ·屏保广告
                                </p>
                                <p>
                                    支持PNG/JPG/WEBP，1920*1080，1MB以内
                                </p>
                                <p>
                                    ·开机广告
                                </p>
                                <p>
                                    支持MP4，1280*720以上，60MB以内
                                </p>
                                <p>
                                    ·贴片广告
                                </p>
                                <p>
                                    支持MP4，1280*720以上，60MB以内
                                </p>
                            </div>
                        </span>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="">
                        <multi-type-file-upload
                            :adMaterialList="advertisingOwner.adMaterialList"
                            :fileUploadedSuccessHandler="fileUploadedSuccessHandler"
                            :deleteAdMaterialHandler="deleteAdMaterialHandler"
                        ></multi-type-file-upload>
                    </el-form-item>
                </el-col>
            </el-form>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import MultiTypeFileUpload from './MultiTypeFileUpload';
export default {
    name: 'AdvertisingOwnerForm',
    components: {
        MultiTypeFileUpload
    },
    data() {
        return {
            inputRules: {
                name: [
                    { required: true, message: '请输入广告主名称' }
                ]
            }
        };
    },
    computed: {
        ...mapGetters({
            advertisingOwner: 'advertising/advertisingOwner'
        })
    },
    methods: {
        ...mapMutations({
            updateAdvertisingOwner: 'advertising/updateAdvertisingOwner',
            addAdMaterial: 'advertising/addAdMaterial',
            deleteAdMaterialById: 'advertising/deleteAdMaterialById'
        }),
        inputHandler(value, key) {
            this.updateAdvertisingOwner({key, value});
        },
        deleteAdMaterialHandler(index) {
            this.deleteAdMaterialById({index});
        },
        fileUploadedSuccessHandler(data) {
            let adMaterial = {};
            if (data.file) {
                adMaterial.height = _.get(data, 'demension.height');
                adMaterial.width = _.get(data, 'demension.width');
                adMaterial.duration = _.get(data, 'demension.duration');
                adMaterial.name = _.get(data, 'file.name');
                adMaterial.mediaType = 'VIDEO';
                adMaterial.size = _.get(data, 'file.size');
                adMaterial.storageId = _.get(data, 'file.id');
                adMaterial.storageUri = _.get(data, 'file.uri');
            } else {
                adMaterial.height = _.get(data, 'image.height');
                adMaterial.width = _.get(data, 'image.width');
                adMaterial.name = _.get(data, 'image.name');
                adMaterial.mediaType = 'IMAGE';
                adMaterial.size = _.get(data, 'image.size');
                adMaterial.storageId = _.get(data, 'image.id');
                adMaterial.storageUri = _.get(data, 'image.uri');
            }
            this.addAdMaterial({adMaterial});
        }
    }
};
</script>
<style lang="scss" scoped>
.prompt-info-icon {
    position: relative;
    display: inline-block;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: rgba(41,53,80,0.80);
    border-radius: 50%;
    .svg-icon {
        fill: #6F7480;
    }
    &:hover {
        background: #293550;
        .svg-icon {
            fill: #fff;
        }
        .prompt-info-dialog {
            display: block;
        }
    }
    .prompt-info-dialog {
        // display: none;
        position: absolute;
        top: 14px;
        left: 32px;
        width: 406px;
        // height: 160px;
        background: rgba(65,74,93,0.90);
        border: 0 solid #637497;
        box-shadow: 2px 4px 10px 0 rgba(0,0,0,0.30);
        border-radius: 8px;
        text-align: left;
        font-size: 12px;
        line-height: 20px;
        padding: 12px;
        z-index: 20;
    }
}
</style>
