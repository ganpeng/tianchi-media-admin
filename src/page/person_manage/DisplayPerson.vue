<!--显示人物-->
<template>
    <div class="person-detail-container">
        <h2 class="content-title">人物详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section person">
                <div class="visible-wrapper">
                    <span :class="['visible', person.visible ? 'is-visible' : 'dis-visible']">
                        {{person.visible ? '上架' : '下架'}}
                    </span>
                </div>
                <img v-if="person.avatarImage" :src="person.avatarImage.uri | fileUrl" alt="" width="200" height="200">
                <div v-else class="default-person-image">
                    <svg-icon icon-class="person_avatar"></svg-icon>
                </div>
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
                    <span v-if="person.area" class="address-tag">
                        <svg-icon icon-class="location"></svg-icon>
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
                        <span class="value">{{person.englishName ? person.englishName : '无'}}</span>
                    </div>
                </div>
                <p class="description">
                    {{person.description}}
                </p>
            </div>
        </div>
        <div class="bg-image-container">
            <h4 class="content-sub-title" style="margin-left:20px;">背景图</h4>
            <single-poster v-if="person.backgroundImage" :img="person.backgroundImage"></single-poster>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" @click="editPerson">编辑</el-button>
            <el-button class="btn-style-three" @click="goBack">返回列表</el-button>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import store from 'store';
    import PersonDetail from './PersonDetail';
    import SinglePoster from 'sysComponents/custom_components/custom/SinglePoster';
    export default {
        name: 'DisplayPerson',
        components: {
            PersonDetail,
            SinglePoster
        },
        data() {
            return {
                areaOptions: store.get('areaList')
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
            editPerson() {
                let {id} = this.$route.params;
                this.$router.push({ name: 'EditPerson', params: { id } });
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
