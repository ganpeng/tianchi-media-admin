<template>
    <div id="child-fixed-module" class="child-fixed-module">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="content">
            <div class="left">
                <div v-if="isEdit" class="prompt">此区域不可编辑</div>
            </div>
            <div :style="backgroundImageStyle('tvUrl')" class="right">
                <single-image-uploader-with-button
                    v-if="isEdit"
                    id="tv"
                    :allowResolutions="[{width: 1160, height: 360}]"
                    :uploadSuccessHandler="tvSuccessHandler"
                ></single-image-uploader-with-button>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="putImagePackageHandler">保存</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import SingleImageUploaderWithButton from 'sysComponents/custom_components/custom/SingleImageUploaderWithButton';
export default {
    name: 'ChildFixedModule',
    components: {SingleImageUploaderWithButton},
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            navbarId: '',
            package: {
                mobileUrl1: '',
                mobileUrl2: '',
                mobileUrl3: '',
                mobileUrl4: '',
                tvUrl: ''
            }
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
            let res = await this.$service.getImagePackage();
            if (res && res.code === 0) {
                this.package = res.data;
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            //  2.3.0新增
            activeLayout: 'pageLayout/getActiveLayout'
        }),
        backgroundImageStyle() {
            return (key) => {
                let url = _.get(this.package, `${key}`);
                return `background-image: url(${url})`;
            };
        }
    },
    methods: {
        ...mapMutations({}),
        ...mapActions({}),
        tvSuccessHandler(img) {
            _.set(this.package, 'tvUrl', img.uri);
        },
        editFixedModuleHandler() {
            if (!this.$authority.isHasAuthority('content:layoutBlock:put')) {
                return;
            }
            let id = _.get(this.activeLayout, '0.id');
            this.$router.push({ name: 'EditFixedModule', params: {navbarId: this.navbarId, index: 0}, query: {id} });
        },
        async putImagePackageHandler() {
            try {
                if (!this.package.tvUrl) {
                    this.$message.error('请选择图片');
                    return false;
                }
                let res = await this.$service.putImagePackage(this.package);
                if (res && res.code === 0) {
                    this.$message.success(`图片保存成功`);
                    this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
                } else {
                    this.$message.error(`图片保存失败`);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    position: relative;
    height: 0;
    padding-bottom: $paddingNum;
    background-color: rgba(255, 255, 255, 0.1);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
    border: 1px solid #2A3040;
}
.child-fixed-module {
    margin-top: 20px;
    .btn-field {
        display: flex;
        justify-content: flex-end;
        margin: 40px 0 10px 0;
    }
    .content {
        width: 100%;
        display: flex;
        .left {
            position: relative;
            width: 31.9327%;
            @include paddingBg(21.0084%);
            background-image: url('../../../assets/img/my_bg_icon.png');
            margin-right: 2.5210%;
            .prompt {
                position: absolute;
                left: 16px;
                bottom: 16px;
                color: rgba(255, 255, 255, 0.5);
            }
        }
        .right {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 66.3865%;
            @include paddingBg(21.0084%);
            .single-image-uploader-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
}
</style>
