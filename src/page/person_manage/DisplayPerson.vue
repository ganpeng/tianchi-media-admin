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
            <el-col :span="12">
                <div class="grid-content text-left">
                    <h3 class="gp-title text-left">人物基本信息</h3>
                    <div class="info-container">
                        <div class="info-item">
                            <span class="gp-label">人物姓名</span>
                            <span class="gp-text">{{person.name}}</span>
                        </div>
                        <div class="info-item">
                            <span class="gp-label">出生日期</span>
                            <span class="gp-text">{{person.birthday}}</span>
                        </div>
                        <div class="info-item">
                            <span class="gp-label">所属地区</span>
                            <span class="gp-text">{{areaLabel(person.area)}}</span>
                        </div>
                        <div class="info-item">
                            <span class="gp-label">身高</span>
                            <span class="gp-text">{{person.height}}</span>
                        </div>
                        <div class="info-item">
                            <span class="gp-label">体重</span>
                            <span class="gp-text">{{person.weight}}</span>
                        </div>
                        <div class="info-item">
                            <span class="gp-label">职业</span>
                            <span class="gp-text">{{mainRoleLabel(person.mainRoleList)}}</span>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content text-left">
                    <h3 class="gp-title">人物简介</h3>
                    <div class="info-container">
                        <p class="gp-text">
                            {{person.description}}
                        </p>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <div class="grid-content">
                    <h3 class="gp-title text-left">人物图片</h3>
                    <ul class="cover-list">
                        <li v-for="(img, index) in person.posterImageList" :key="index">
                            <div
                                class="image-box"
                                :style="{'background-image': 'url(' + appendImagePrefix(img.uri) + ')'}"
                                @click="displayImage(index)">
                            </div>
                        </li>
                    </ul>
                </div>
            </el-col>
        </el-row>
        <el-button type="primary" @click="goBack">返回人物列表</el-button>
        <preview-multiple-images :previewMultipleImages="previewImage"></preview-multiple-images>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PreviewMultipleImages from 'sysComponents/custom_components/global/PreviewMultipleImages';
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
.info-container {
    padding: 20px;
    .info-item {
        .gp-label,
        .gp-text {
            display: inline-block;
            line-height: 30px;
        }
        .gp-label {
            width: 100px;
            text-align: right;
        }
        .gp-text {
            margin-left: 50px;
        }
    }

}
</style>
