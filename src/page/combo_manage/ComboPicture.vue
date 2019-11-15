<template>
    <div class="combo-picture">
        <div class="tv">
            <h2 class="content-title">TV端页面</h2>
            <div class="seperator-line">
            </div>
            <div class="content">
                <div class="left"></div>
                <div :style="backgroundImageStyle('tvUrl')" class="right">
                    <single-image-uploader-with-button
                        id="tv"
                        :allowResolutions="[{width: 1160, height: 360}]"
                        :uploadSuccessHandler="tvSuccessHandler"
                    ></single-image-uploader-with-button>
                </div>
            </div>
        </div>
        <div class="app">
            <h2 class="content-title">手机端页面</h2>
            <div class="seperator-line"></div>
            <div class="content">
                <div :style="backgroundImageStyle('mobileUrl1')" class="one item">
                    <single-image-uploader-with-button
                        id="app-one"
                        :uploadSuccessHandler="appSuccessHandler('mobileUrl1')"
                    ></single-image-uploader-with-button>
                </div>
                <div :style="backgroundImageStyle('mobileUrl2')" class="two item">
                    <single-image-uploader-with-button
                        id="app-two"
                        :uploadSuccessHandler="appSuccessHandler('mobileUrl2')"
                    ></single-image-uploader-with-button>
                </div>
                <div :style="backgroundImageStyle('mobileUrl3')" class="three item">
                    <single-image-uploader-with-button
                        id="app-three"
                        :uploadSuccessHandler="appSuccessHandler('mobileUrl3')"
                    ></single-image-uploader-with-button>
                </div>
                <div :style="backgroundImageStyle('mobileUrl4')" class="four item">
                    <single-image-uploader-with-button
                        id="app-four"
                        :uploadSuccessHandler="appSuccessHandler('mobileUrl4')"
                    ></single-image-uploader-with-button>
                </div>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="putImagePackageHandler">保存</el-button>
        </div>
    </div>
</template>
<script>
import _ from 'lodash';
import SingleImageUploaderWithButton from 'sysComponents/custom_components/custom/SingleImageUploaderWithButton';
export default {
    name: 'ComboPicture',
    components: {SingleImageUploaderWithButton},
    data() {
        return {
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
            let res = await this.$service.getImagePackage();
            if (res && res.code === 0) {
                this.package = res.data;
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        backgroundImageStyle() {
            return (key) => {
                let url = _.get(this.package, `${key}`);
                return `background-image: url(${url})`;
            };
        }
    },
    methods: {
        tvSuccessHandler(img) {
            _.set(this.package, 'tvUrl', img.uri);
        },
        appSuccessHandler(key) {
            return (img) => {
                _.set(this.package, `${key}`, img.uri);
            };
        },
        async putImagePackageHandler() {
            try {
                if (!this.package.tvUrl ||
                    !this.package.mobileUrl1 ||
                    !this.package.mobileUrl2 ||
                    !this.package.mobileUrl3 ||
                    !this.package.mobileUrl4) {
                    this.$message.error('请选择图片');
                    return false;
                }

                let res = await this.$service.putImagePackage(this.package);
                if (res && res.code === 0) {
                    this.$message.success(`图片保存成功`);
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
.combo-picture {
    .tv {
        .content {
            margin: 20px 0;
            display: flex;
            .left {
                width: 280px;
                height: 180px;
                margin-right: 20px;
                background-color: #2A3040;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
                border-radius: 8px;
            }
            .right {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 580px;
                height: 180px;
                background-color: #2A3040;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
                border-radius: 8px;
            }
        }
    }
    .app {
        .content {
            display: flex;
            margin: 20px 0;
            .item {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 212px;
                height: 378px;
                background-color: #2A3040;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;
                border-radius: 8px;
            }
            .item + .item {
                margin-left: 20px;
            }
        }
    }
}
</style>
