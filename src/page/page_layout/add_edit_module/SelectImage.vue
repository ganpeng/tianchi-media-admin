<template>
    <div class="select-image-container" id="select-image">
        <div class="wrapper">
            <div v-for="(image, index) in images" :key="index" :style="styleStr(index)" class="img-wrapper">
                <img :style="styleStr(index)" :src="image.uri" alt="">
                <p class="image-dimension">{{images[index].width}}*{{images[index].height}}</p>
                <el-radio :name="name" @change="changeImageHandler(image)" :value="id" :label="image.id">&nbsp;</el-radio>
                <i v-if="id === image.id && showDeleteImageBtn" @click="deleteImage" class="el-icon-error"></i>
            </div>
            <!--  修改之前
            <div v-for="(image, index) in images" :key="index" :style="styleStr" class="img-wrapper">
                <img :style="styleStr" :src="image.uri" alt="">
                <p class="image-dimension">{{allowResolutions[0].width}}*{{allowResolutions[0].height}}</p>
                <el-radio :name="name" @change="changeImageHandler(image)" :value="id" :label="image.id">&nbsp;</el-radio>
                <i v-if="id === image.id && showDeleteImageBtn" @click="deleteImage" class="el-icon-error"></i>
            </div>
            -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'SelectImage',
    props: {
        images: {
            type: Array,
            default: () => []
        },
        id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            required: true
        },
        showDeleteImageBtn: {
            type: Boolean,
            default: false
        },
        allowResolutions: {
            type: Array,
            default: () => []
        },
        changeImageHandler: {
            type: Function,
            default: () => {}
        },
        deleteImage: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        //  修改之前
        // styleStr() {
        //     if (this.allowResolutions[0]) {
        //         return `width:${this.allowResolutions[0].width * 0.3}px;height:${this.allowResolutions[0].height * 0.3}px;`;
        //     } else {
        //         return '';
        //     }
        // }
        styleStr() {
            return (index) => {
                if (this.images[index]) {
                    return `width:${this.images[index].width * 0.3}px;height:${this.images[index].height * 0.3}px;`;
                } else {
                    return '';
                }
            };
        }
    },
    data() {
        return {
            value: ''
        };
    },
    methods: {
        changeValue(id) {
            this.value = id;
        }
    }
};
</script>
<style lang="scss" scoped>
.wrapper {
    display: flex;
    .img-wrapper {
        position: relative;
        margin-right: 10px;
        border-radius: 4px;
        text-align: center;
        margin-bottom: 60px;
        img {
            display: inline-block;
            border-radius: 4px;
            border: 1px solid #3E495E;
        }
        i {
            display: none;
            position: absolute;
            top: 4px;
            right: 4px;
            color: $closeBtnHoverColor;
        }
    }
    .image-dimension {
        font-size: 12px;
        height: 22px;
        line-height: 22px;
        color: #6F7480;
        text-align: center;
    }
}

</style>
<style lang="scss">
#select-image {
    .el-radio__label {
        display: none;
    }
}
</style>
