<!--节目详情-->
<template>
    <div class="program-display-container">
        <div class="common-details">
            <div class="poster-section programme">
                <div class="visible-wrapper">
                    <span :class="['visible', programme.visible ? 'is-visible' : 'dis-visible']">
                        {{programme.visible ? '上架' : '下架'}}
                    </span>
                </div>
                <img v-if="programme.coverImage && programme.coverImage.uri" :src="programme.coverImage ? programme.coverImage.uri : ''" alt="">
                <div v-else class="default-poster"></div>
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <div class="left-side">
                        <span class="title">{{programme.name}}</span>
                        <span v-if="programme.releaseAt" class="release-at">[{{programme.releaseAt | formatDate('yyyy.MM.DD')}}]</span>
                        <span v-if="programme.score" class="score">{{programme.score}}</span>
                        <span v-if="isTvPlay && programme.totalSets" class="total-sets">{{programme.totalSets}}集</span>
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
                        <svg-icon icon-class="location"></svg-icon>
                        {{name}}
                    </span>
                    <span v-for="(item) in programme.categoryList" :key="item.id" class="category-tag">
                        {{item.name}}
                    </span>
                    <span v-for="(item) in programme.typeList" :key="item.id" class="category-tag">
                        {{item.name}}
                    </span>
                    <span v-for="(item, index) in programme.tagList" :key="`${index}_tag`" class="type-tag">
                        {{item}}
                    </span>
                    <span v-for="(item, index) in programme.specList" :key="`${index}_spec`" class="spec-tag">
                        {{item}}
                    </span>
                </div>
                <p class="inner-name">{{programme.desc}}</p>
                <p class="description programme">
                    {{programme.description}}
                </p>
                <ul class="person-posters">
                    <li v-for="(person, index) in getAllRoleList" :key="index" class="poster">
                        <img v-if="person.avatarUri" :src="person.avatarUri" alt="" width="80" height="80">
                        <div v-else class="default-poster"></div>
                        <span class="person-name my-ellipsis">{{person.name}}</span>
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
                            <label class="label">付费情况</label>
                            <span class="value">
                                {{paymentTypeLabel(programme.paymentType)}}
                                {{programme.paymentType === 'EXTRAS' ? programme.price : ''}}
                            </span>
                        </div>
                        <!--
                        <div class="attribute-item">
                            <label class="label">适用客户端</label>
                            <span class="value">
                                {{programme.applicableClientList.join(', ')}}
                            </span>
                        </div>
                        -->
                    </div>
                </div>
                <div class="right-side">
                    <div class="attribute-item mark">
                        <label class="label">角标</label>
                        <div class="mark-container">
                            <!--
                            <div class="left-top">
                                左上角
                                <span>{{getMark('leftTop')}}</span>
                            </div>
                            <div class="left-bottom">
                                左下角
                                <span>{{getMark('leftBottom')}}</span>
                            </div>
                            -->
                            <div class="right-top">
                                右上角
                                <span>{{getMark('rightTop')}}</span>
                            </div>
                            <div class="right-bottom">
                                右下角
                                <span>{{getMark('rightBottom')}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="attribute-item play-count">
                        <label class="label">播放量</label>
                        <span class="value">{{programme.playCountDisplay}}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div v-if="tvImageList.length > 0" class="other-poster">
            <h4 class="content-sub-title" style="margin-left:20px;">其他海报</h4>
            <thumbnail :removeSign="false" :imageList="tvImageList"></thumbnail>
        </div>
        <div v-if="appImageList.length > 0" class="other-poster">
            <h4 class="content-sub-title" style="margin-left:20px;">APP海报</h4>
            <thumbnail :removeSign="false" :imageList="appImageList"></thumbnail>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import _ from 'lodash';
    import store from 'store';
    import role from '@/util/config/role';
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
            tvImageList() {
                return this.programme.posterImageList.filter((image) => {
                    return parseInt(image.width) !== 260 && parseInt(image.height) !== 380;
                }).filter((posterImage) => {
                    let index = role.PROGRAMME_ALLOW_PICTURE_DIMENSIONS.findIndex((item) => {
                        return parseInt(item.width) === parseInt(posterImage.width) && parseInt(item.height) === parseInt(posterImage.height);
                    });
                    return index > -1;
                });
            },
            appImageList() {
                return this.programme.posterImageListForApp;
            },
            getMark() {
                return (position) => {
                    if (position === 'rightTop') {
                        return _.get(this.programme, `cornerMark.${position}.caption`);
                    } else {
                        return (_.get(this.programme, `cornerMark.rightBottom.caption`) ||
                        _.get(this.programme, `cornerMark.leftBottom.caption`));
                    }
                };
            },
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
            fixedEmptyValue() {
                return (value) => {
                    return _.isEmpty(value) ? '无' : value;
                };
            },
            paymentTypeLabel() {
                return (value) => {
                    let payment = role.PAYMENT_OPTIONS.find((item) => item.value === value);
                    return _.get(payment, 'label');
                };
            }
        }
    };
</script>
<style lang="less" scoped>
.el-tag {
    border: none;
}
.title-wrapper {
    .score {
        margin-left: 10px;
    }
    .total-sets {
        margin-left: 20px;
        font-size: 16px;
        color: #A8ABB3;
    }
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
            .mark {
                display: flex;
                .mark-container {
                    width: 420px;
                    display: flex;
                    flex-wrap: wrap;
                    .left-top,
                    .right-top,
                    .left-bottom,
                    .right-bottom {
                        width: 210px;
                    }
                }
            }
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
            }
        }
    }
}
.other-poster {
    margin-bottom: 10px;
}
</style>
