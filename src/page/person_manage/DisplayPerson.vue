<!--显示人物-->
<template>
    <div class="person-container">
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'人物资源管理'},
            {name:'人物列表-详情'}]">
        </custom-breadcrumb>
        <el-row>
            <el-col :span="10">
                <div class="vice-block">
                    <h3 class="block-vice-title">节目基本信息</h3>
                </div>
                <div class="base-info-container">
                    <div class="form-block">
                        <div class="info-wrapper">
                            <span class="label">姓名</span>
                            <span class="text">{{person.name}}</span>
                        </div>
                        <div class="info-wrapper">
                            <span class="label">出生日期</span>
                            <span class="text">{{person.birthday | formatDate('yyyy-MM-DD')}}</span>
                        </div>
                        <div class="info-wrapper">
                            <span class="label">所属地区</span>
                            <span class="text">{{areaLabel(person.area)}}</span>
                        </div>
                        <div class="info-wrapper">
                            <span class="label">身高</span>
                            <span class="text">{{person.height}}</span>
                        </div>
                        <div class="info-wrapper">
                            <span class="label">体重</span>
                            <span class="text">{{person.weight}}</span>
                        </div>
                        <div class="info-wrapper">
                            <span class="label">职业</span>
                            <el-tag size="small" class="margin-right-s" v-for="(name, index) in mainRoleLabel(person.mainRoleList)" :key="index" type="info">{{name}}</el-tag>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <div class="vice-block">
                        <h3 class="block-vice-title">人物简介</h3>
                    </div>
                    <div class="programme-desc-container text-left">
                        <p class="desc">
                            {{person.description}}
                        </p>
                    </div>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="vice-block">
                    <h3 class="block-vice-title">人物图片</h3>
                </div>
                <thumbnail
                    :removeSign="false"
                    :imageList="person.posterImageList">
                </thumbnail>
            </el-col>
        </el-row>
        <el-button class="bak-btn" @click="goBack" plain>返回人物列表</el-button>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
    import PersonDetail from './PersonDetail';
    import Thumbnail from '../../components/custom_components/custom/Thumbnail';
    export default {
        name: 'DisplayPerson',
        components: {
            PersonDetail,
            PreviewMultipleImages,
            Thumbnail
        },
        data() {
            return {
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        computed: {
            ...mapGetters({
                person: 'person/currentPerson',
                mainRoleLabel: 'person/mainRoleLabel'
            })
        },
        created() {
            let {id} = this.$route.params;
            this.getPersonById(id);
        },
        methods: {
            ...mapMutations({}),
            ...mapActions({
                getPersonById: 'person/getPersonById'
            }),
            displayImage(index) {
                this.previewImage.display = true;
                this.previewImage.list = this.person.posterImageList;
                this.previewImage.activeIndex = index;
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            areaLabel(code) {
                let area = store.get('areaList').find((area) => area.code === code);
                return area ? area.name : '';
            },
            goBack() {
                this.$router.push({name: 'PersonList'});
            }
        }
    };
</script>
<style lang="less" scoped>
.desc {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 18px;
    color: #909399;
    letter-spacing: 0;
}
.el-tag {
    border: none;
}
.bak-btn {
    position: absolute;
    bottom: 164px;
}
</style>
