<template>
    <div class="combo-picture">
        <div class="tv">
            <h2 class="content-title">TV端页面</h2>
            <div class="seperator-line">
            </div>
            <div class="content">
                <div class="left"></div>
                <div class="right">
                    <single-image-uploader-with-button
                        id="tv"
                        :allowResolutions="[{width: 560, height: 315}]"
                        :uploadSuccessHandler="tvSuccessHandler"
                    ></single-image-uploader-with-button>
                </div>
            </div>
        </div>
        <div class="app">
            <h2 class="content-title">手机端页面</h2>
            <div class="seperator-line"></div>
            <div class="content">
                <div class="one item">
                    <single-image-uploader-with-button
                        id="app-one"
                        :allowResolutions="[{width: 560, height: 315}]"
                        :uploadSuccessHandler="appSuccessHandler(1)"
                    ></single-image-uploader-with-button>
                </div>
                <div class="two item">
                    <single-image-uploader-with-button
                        id="app-two"
                        :allowResolutions="[{width: 560, height: 315}]"
                        :uploadSuccessHandler="appSuccessHandler(2)"
                    ></single-image-uploader-with-button>
                </div>
                <div class="three item">
                    <single-image-uploader-with-button
                        id="app-three"
                        :allowResolutions="[{width: 560, height: 315}]"
                        :uploadSuccessHandler="appSuccessHandler(3)"
                    ></single-image-uploader-with-button>
                </div>
                <div class="four item">
                    <single-image-uploader-with-button
                        id="app-four"
                        :allowResolutions="[{width: 560, height: 315}]"
                        :uploadSuccessHandler="appSuccessHandler(4)"
                    ></single-image-uploader-with-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SingleImageUploaderWithButton from 'sysComponents/custom_components/custom/SingleImageUploaderWithButton';
export default {
    name: 'ComboPicture',
    components: {SingleImageUploaderWithButton},
    methods: {
        tvSuccessHandler(img) {
            console.log(img);
        },
        appSuccessHandler(count) {
            return (img) => {
                console.log(count);
                console.log(img);
            };
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
                background-size: 100% 100%;
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
                background-size: 100% 100%;
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
                background-size: 100% 100%;
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
