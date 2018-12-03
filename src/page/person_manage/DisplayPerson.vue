<!--显示人物-->
<template>
    <div class="person-detail-container">
        <h2 class="content-title">人物详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section person">
                <div class="visible-wrapper">
                    <span :class="['visible', person.visible ? 'is-visible' : 'dis-visible']">
                        {{person.visible ? '已上架' : '已下架'}}
                    </span>
                </div>
                <img v-if="person.avatarImage" :src="person.avatarImage.uri | fileUrl" alt="" width="200" height="200">
                <img v-else src="" alt="" width="200" height="200">
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <span class="title">{{person.name}}</span>
                    <div class="date">
                        <span class="create-date">
                            创建于{{person.createdAt | formatDate('yyyy-MM-DD')}}
                        </span>
                        <span class="update-date">
                            更新于{{person.updatedAt | formatDate('yyyy-MM-DD')}}
                        </span>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="tags-section">
                    <span class="address-tag">
                        {{areaLabel(person.area)}}
                    </span>
                    <span v-for="(name, index) in mainRoleLabel(person.mainRoleList)" :key="index" class="role-tag">
                        {{name}}
                    </span>
                </div>
                <div class="attributes">
                    <div class="attribute-item">
                        <label class="item-label">别名:</label>
                        <span class="value">{{person.alias}}</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">英文名:</label>
                        <span class="value">{{person.englishName}}</span>
                    </div>
                </div>
                <p class="description">
                    {{person.description}}
                </p>
            </div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
        </div>
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
                areaOptions: store.get('areaList'),
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
                let reg = /^\d+(\.\d+)?$/;
                if (reg.test(code)) {
                    let area = this.areaOptions.find((area) => area.code === code);
                    return area ? area.name : '';
                } else {
                    return code;
                }
            },
            goBack() {
                this.$router.back();
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
