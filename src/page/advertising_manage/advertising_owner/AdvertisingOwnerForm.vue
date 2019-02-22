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
                <el-col :span="24">
                    <el-form-item label="资源上传">
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
        deleteAdMaterialHandler(id) {
            this.deleteAdMaterialById({id});
        },
        fileUploadedSuccessHandler(data) {
            let adMaterial = {};
            if (data.file) {
                adMaterial.height = _.get(data, 'demension.height');
                adMaterial.width = _.get(data, 'demension.width');
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

</style>
