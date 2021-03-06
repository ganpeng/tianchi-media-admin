<!-- 上传节目图片的弹窗组件 -->
<template>
    <el-dialog
        title="上传人物图片"
        :visible.sync="imageUploadDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body>
        <el-form :model="form" :rules="imageUploadRules" ref="uploadImageForm" class="form-block" label-width="100px">
            <el-form-item label="规格尺寸" prop="spec">
                <el-select v-model="form.spec" clearable placeholder="请选择规格尺寸">
                    <el-option
                        v-for="item in size"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图片名称" prop="name">
                <el-input v-model="form.name" auto-complete="off" placeholder="请输入图片名称"></el-input>
            </el-form-item>
            <el-form-item label="上传图片" prop="imageFiles">
                <el-col :span="10">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="/admin/v1/media/image"
                        v-model="form.imageFiles"
                        :auto-upload="false"
                        :http-request="uploadRequest"
                        :show-file-list="false"
                        :with-credentials="true">
                            <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-col>
            </el-form-item>
            <el-form-item label="图片大小">
                <el-input v-model="form.size" readonly></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click="cancelHandler">取 消</el-button>
            <el-button
                size="medium"
                type="primary"
                @click="submitUpload"
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { mapMutations } from 'vuex';
    export default {
        props: {
            size: {
                type: Array,
                default: () => []
            },
            imageUploadDialogVisible: {
                type: Boolean
            }
        },
        data() {
            return {
                form: {
                    name: '',
                    size: '5M',
                    spec: '',
                    imageFiles: []
                },
                isLoading: false,
                isChecked: false,
                posterImageList: [],
                imageUploadRules: {
                    name: [ { required: true, message: '请输入图片名称', trigger: 'change' } ],
                    spec: [ { required: true, message: '请选择图片规格尺寸', trigger: 'change' } ]
                },
                imageSizeDialogVisible: false
            };
        },
        methods: {
            ...mapMutations({
                addPosterImage: 'person/addPosterImage'
            }),
            cancelHandler() {
                this.$emit('changeImageDialogStatus', false);
                this.$refs.uploadImageForm.resetFields();
            },
            async beforeUploadHandler(file) {
                try {
                    let src = await this.loadFile(file);
                    let img = await this.loadImg(src);
                    return {
                        checkedStatus: this.checkImage(img),
                        img
                    };
                } catch (err) {
                }
            },
            loadImg(url) {
                return new Promise((resolve, reject) => {
                    let img = new Image();
                    img.src = url;
                    img.onload = function () {
                        resolve(img);
                    };
                    img.onerror = function (err) {
                        reject(err);
                    };
                });
            },
            checkImage(img) {
                let {width, height} = img;
                let [sizeWidth, sizeHeight] = this.form.spec.split('*');
                if (width !== sizeWidth || height !== sizeHeight) {
                    return false;
                } else {
                    return true;
                }
            },
            loadFile(file) {
                return new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = (theFile) => {
                        resolve(theFile.target.result);
                    };
                    reader.onerror = (err) => {
                        reject(err);
                    };
                });
            },
            async uploadRequest(obj) {
                let { checkedStatus, img } = await this.beforeUploadHandler(obj.file);
                if (!checkedStatus) {
                    let formData = new FormData();
                    formData.append('file', obj.file);
                    this.$service.uploadImage({formData, fileName: this.form.name})
                        .then((res) => {
                            if (res && res.code === 0) {
                                let data = res.data;
                                let obj = {};
                                obj.fileId = data.id;
                                obj.height = img.height;
                                obj.width = img.width;
                                obj.uri = data.url;
                                this.addPosterImage({posterImage: obj});
                                this.cancelHandler();
                            }
                        }).finally(() => {
                            this.isLoading = false;
                        });
                } else {
                     this.$message.error('选择的图片与选择的图片尺寸不一致，请重新选择图片');
                }
            },
            submitUpload() {
                this.$refs.uploadImageForm.validate(value => {
                    if (value) {
                        this.isLoading = true;
                        this.$refs.upload.submit();
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>
<style lang="less" scoped>
</style>
