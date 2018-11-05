<!--节目详情-->
<template>
    <div class="program-display-container">
        <div class="common-details">
            <div class="poster-section programme">
                <div class="visible-wrapper">
                    <span :class="['visible', programme.visible ? 'is-visible' : 'dis-visible']">
                        {{programme.visible ? '已上架' : '已下架'}}
                    </span>
                </div>
                <img :src="programme.posterImageList[0] ? programme.posterImageList[0].uri : ''" alt="" width="200" height="200">
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <div class="left-side">
                        <span class="title">{{programme.name}}</span>
                        <span class="release-at">[{{programme.releaseAt | formatDate('yyyy.MM.DD')}}]</span>
                        <span class="score">{{programme.score}}</span>
                    </div>
                    <div class="date">
                        <span class="create-date">
                            创建于{{programme.createdAt | formatDate('yyyy.MM.DD')}}
                        </span>
                        <span class="update-date">
                            更新于{{programme.updatedAt | formatDate('yyyy.MM.DD')}}
                        </span>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="tags-section">
                    <span v-for="(name, index) in getAreaName(programme.produceAreaList)" :key="index" class="address-tag">
                        {{name}}
                    </span>
                    <span class="role-tag">
                        haha
                    </span>
                </div>
                <div class="attributes">
                    <div class="attribute-item">
                        <label class="item-label">别名:</label>
                        <span class="value">小张</span>
                    </div>
                    <div class="attribute-item">
                        <label class="item-label">英文名:</label>
                        <span class="value">xiaozhang</span>
                    </div>
                </div>
                <p class="description programme">
                    {{programme.description}}
                </p>
                <ul class="person-posters">
                    <li v-for="(person, index) in getAllRoleList" :key="index" class="poster">
                        <img :src="person.avatarUri" alt="" width="80" height="80">
                        <span class="person-name">{{person.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="other-info">
            <h4 class="content-sub-title">其他信息</h4>
            <div class="other-content">
                <div class="left-side">
                    <div class="attributes">
                        <div class="attribute-item">
                            <label class="label">版权起止时间</label>
                            <span class="value">{{programme.copyrightStartedAt | formatDate('yyyy.MM.DD')}}-{{programme.copyrightEndedAt | formatDate('yyyy.MM.DD')}}</span>
                        </div>
                        <div class="attribute-item">
                            <label class="label">牌照方</label>
                            <span class="value">
                                {{fixedEmptyValue(programme.licence)}}
                            </span>
                        </div>
                        <div class="attribute-item">
                            <label class="label">版权方</label>
                            <span class="value">{{fixedEmptyValue(programme.copyrightReserved)}}</span>
                        </div>
                        <div class="attribute-item">
                            <label class="label">发行方</label>
                            <span class="value">{{fixedEmptyValue(programme.announcer)}}</span>
                        </div>
                        <div class="attribute-item">
                            <label class="label">播放平台</label>
                            <span class="value">
                                {{programme.platformList.join(', ')}}
                            </span>
                        </div>
                        <div class="attribute-item">
                            <label class="label">定时上架</label>
                            <span class="value">2018.10.31 00:00:00</span>
                        </div>
                        <div class="attribute-item">
                            <label class="label">定时下架</label>
                            <span class="value">2018.10.31 00:00:00</span>
                        </div>
                    </div>
                </div>
                <div class="right-side">
                    <div class="attribute-item play-count">
                        <label class="label">播放量</label>
                        <span class="value">{{programme.playCountBasic}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="other-poster">
            <h4 class="content-sub-title">其他海报</h4>
                <thumbnail
                    :removeSign="false"
                    :imageList="programme.posterImageList">
                </thumbnail>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import _ from 'lodash';
    import store from 'store';
    import Thumbnail from '../../components/custom_components/custom/Thumbnail';
    export default {
        name: 'ProgrammeBasicInfo',
        components: { Thumbnail },
        props: {
            status: { // status 有三种状态，0代表创建 "create", 1代表显示 "display", 2代表编辑 "edit"
                type: Number
            }
        },
        data() {
            return { };
        },
        computed: {
            ...mapGetters({
                programme: 'programme/programme',
                global: 'programme/global',
                isTvPlay: 'programme/isTvPlay',
                isMovie: 'programme/isMovie',
                isEducation: 'programme/isEducation',
                isShow: 'programme/isShow',
                isSports: 'programme/isSports',
                getAllRoleList: 'programme/getAllRoleList'
            }),
            getYear() {
                return (timeStamp) => {
                    return timeStamp ? new Date(timeStamp).getFullYear() : '';
                };
            },
            getAreaName() {
                return (codeList) => {
                    let areaList = store.get('areaList');
                    return codeList.map((code) => {
                        let area = areaList.find((area) => {
                            return area.code === code;
                        });
                        return area ? area.name : '';
                    });
                };
            },
            getPersonNameList() {
                return (role) => {
                    let personList = this.programme.figureListMap[role];
                    if (personList) {
                       return personList.map((item) => item.name);
                    } else {
                        return [];
                    }
                };
            },
            getCategoryNameList() {
                return (categoryIdList) => {
                    return categoryIdList.map((id) => {
                        let category = this.global.categoryList.find((category) => category.id === id);
                        return category ? category.name : '';
                    });
                };
            },
            getTypeNameList() {
                return (typeIdList) => {
                    let typeList = this.global.categoryList.reduce((prev, curr) => {
                        return prev.concat(curr.programmeTypeList);
                    }, []);

                    return typeIdList.map((id) => {
                        let type = typeList.find((type) => type.id === id);
                        return type ? type.name : '';
                    });
                };
            },
            fixedEmptyValue() {
                return (value) => {
                    return _.isEmpty(value) ? '无' : value;
                };
            }
        }
    };
</script>
<style lang="less" scoped>
.el-tag {
    border: none;
}
.other-info {
    margin-left: 20px;
    margin-bottom: 10px;
    .other-content {
        display: flex;
        .left-side {
            flex: 1;
        }
        .right-side {
            position: relative;
            flex: 1;
            .play-count {
                position: absolute;
                bottom: 0;
                left: 0;
                .label {
                    color: #6F7480;
                    margin-right: 20px;
                }
                .value {
                    font-size: 36px;
                    color: #637497;
                }
            }
        }
        .attributes {
            .attribute-item {
                font-size: 16px;
                line-height: 32px;
                color: #6F7480;
                text-align: left;
                .label {
                    display: inline-block;
                    width: 100px;
                    text-align: right;
                    margin-right: 20px;
                }
                .value {

                }
            }
        }
    }
}
</style>
