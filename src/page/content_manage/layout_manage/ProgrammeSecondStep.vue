<!--内容管理-栏目管理-节目选择第二步组件-->
<template>
    <div>
        <div class="text-left">符合该位置的图片如下，请选择：</div>
        <ul>
            <li v-for="(item,index) in posterImages" v-bind:key="index">
                <img :src="item.uri" :alt="item.name" @click="displayImage(index)">
                <el-radio v-model="programmeImage" :label="item.id" @change="setPosterImage(index)">{{item.name}}
                </el-radio>
            </li>
            <li @click="toEditProgramme">
                <i class="el-icon-plus"></i>
            </li>
        </ul>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>

<script>
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';

    export default {
        name: 'ProgrammeSecondStep',
        components: {PreviewMultipleImages},
        props: ['programmeId', 'posterImages'],
        data() {
            return {
                programmeImage: '',
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        methods: {
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.posterImages;
                this.previewImage.activeIndex = index;
            },
            // 选择海报图片
            setPosterImage(index) {
                this.$emit('setPosterImage', this.posterImages[index]);
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
                height: 180px;
                cursor: zoom-in;
            }
            .el-radio {
                font-size: 16px;
            }
        }
    }
</style>
