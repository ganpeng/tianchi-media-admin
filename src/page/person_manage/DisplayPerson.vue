<!--显示人物-->
<template>
    <div class="person-container">
        <!-- <person-detail :status='1'></person-detail> -->
        <el-breadcrumb class="gp-breadcrumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col :span="10">
                <div class="block-title">节目基本信息</div>
                <div class="base-info-container">
                    <el-form status-icon :model="person" label-width="120px" class="form-block">
                        <el-form-item label="姓名">
                            <span>{{person.name}}</span>
                        </el-form-item>
                        <el-form-item label="出生日期">
                            <span>{{person.birthday | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                        <el-form-item label="所属地区">
                            <span>{{areaLabel(person.area)}}</span>
                        </el-form-item>
                        <el-form-item label="身高">
                            <span>{{person.height}}</span>
                        </el-form-item>
                        <el-form-item label="体重">
                            <span>{{person.weight}}</span>
                        </el-form-item>
                        <el-form-item label="职业">
                            <el-tag class="margin-right-s" v-for="(name, index) in mainRoleLabel(person.mainRoleList)" :key="index" type="info">{{name}}</el-tag>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <div class="block-title">人物简介</div>
                    <div class="programme-desc-container">
                        <p class="text-left">{{person.description}}</p>
                    </div>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="block-title">人物图片</div>
                <ul class="cover-list">
                    <li v-for="(img, index) in person.posterImageList" :key="index">
                        <div
                            class="image-box"
                            :style="{'background-image': 'url(' + appendImagePrefix(img.uri) + ')'}"
                            @click="displayImage(index)">
                        </div>
                    </li>
                </ul>
            </el-col>
        </el-row>
        <el-button @click="goBack" plain>返回人物列表</el-button>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
    import PersonDetail from './PersonDetail';
    export default {
        name: 'DisplayPerson',
        components: {
            PersonDetail,
            PreviewMultipleImages
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
            this.resetPerson();
            this.getPersonById(id);
        },
        methods: {
            ...mapMutations({
                resetPerson: 'person/resetPerson'
            }),
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
.base-info-container, .programme-desc-container {
    background-color: #fff;
    padding: 20px;
}
.base-info-container {
    margin-right: 20px;
}
</style>
