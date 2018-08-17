<!--添加节目-->
<template>
    <div class="program-container">
        <el-row>
            <el-col :span="10">
                <div class="vice-block">
                    <h3 class="block-vice-title">节目基本信息</h3>
                    <div class="base-info-container">
                        <div class="form-block">
                            <div class="info-wrapper">
                                <span class="label">全平台通用ID</span>
                                <span class="text">{{programme.code}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">节目来源</span>
                                <span class="text">内容中心</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">节目名称</span>
                                <span class="text">{{programme.name}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">内部节目名称</span>
                                <span class="text">{{programme.innerName}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">上映年</span>
                                <span class="text">{{getYear(programme.releaseAt)}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">所属地区</span>
                                <span class="text">{{getAreaName(programme.produceAreaList)}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">版权起始日期</span>
                                <span class="text">{{programme.copyrightStartedAt | formatDate('yyyy-MM-DD')}} ~ {{programme.copyrightEndedAt | formatDate('yyyy-MM-DD')}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">牌照方</span>
                                <span class="text">{{programme.licence}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">版权方</span>
                                <span class="text">{{programme.copyrightReserved}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">总集数</span>
                                <span class="text">{{programme.totalSets}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">评分</span>
                                <span class="text">{{programme.score}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">显示播放量</span>
                                <span class="text">{{programme.playCountBasic}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">实际播放量</span>
                                <span class="text">{{programme.playCountReal}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">发行方</span>
                                <span class="text">{{programme.announcer}}</span>
                            </div>
                            <div v-if="isMovie" class="info-wrapper">
                                <span class="label">规格</span>
                                <el-tag size="small" class="margin-right-s" v-for="(name, index) in programme.specList" :key="index" type="info">{{name}}</el-tag>
                            </div>
                            <div v-if="isEducation" class="info-wrapper">
                                <span class="label">年级</span>
                                <span class="text">{{programme.grade}}</span>
                            </div>
                            <div v-if="isEducation" class="info-wrapper">
                                <span class="label">科目</span>
                                <span class="text">{{programme.subject}}</span>
                            </div>
                            <div v-if="isSports" class="info-wrapper">
                                <span class="label">赛事</span>
                                <span class="text">{{programme.contest}}</span>
                            </div>
                            <div class="info-wrapper">
                                <span class="label">播放平台</span>
                                <el-tag size="small" class="margin-right-s" v-for="(name, index) in programme.platformList" :key="index" type="info">{{name}}</el-tag>
                            </div>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <div class="vice-block">
                        <h3 class="block-vice-title">节目类型/简介</h3>
                        <div class="programme-desc-container">
                            <div class="form-block">
                                <div class="info-wrapper">
                                    <span class="label">节目分类</span>
                                    <el-tag size="small" class="margin-right-s" v-for="(name, index) in getCategoryNameList(programme.categoryList)" :key="index" type="info">{{name}}</el-tag>
                                </div>
                                <div class="info-wrapper">
                                    <span class="label">节目类型</span>
                                    <el-tag size="small" class="margin-right-s" v-for="(name, index) in getTypeNameList(programme.typeList)" :key="index" type="info">{{name}}</el-tag>
                                </div>
                                <div class="info-wrapper">
                                    <span class="label">关键字</span>
                                    <el-tag size="small" class="margin-right-s" v-for="(name, index) in programme.tagList" :key="index" type="info">{{name}}</el-tag>
                                </div>
                                <div class="info-wrapper">
                                    <span class="label">节目看点</span>
                                    <span class="text">{{programme.desc}}</span>
                                </div>
                                <div class="info-wrapper">
                                    <span class="label">节目简介</span>
                                    <span style="line-height:18px;" class="text desc">{{programme.description}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-row>
                <el-row>
                    <div class="vice-block">
                        <h3 class="block-vice-title">演职人员</h3>
                        <div class="programme-person-container">
                            <div class="form-block">
                                <div class="info-wrapper">
                                    <span class="label">节目主演</span>
                                    <el-tag size="small" class="margin-right-s" v-for="(name, index) in getPersonNameList('CHIEF_ACTOR')" :key="index" type="info">{{name}}</el-tag>
                                </div>
                                <div class="info-wrapper">
                                    <span class="label">节目导演</span>
                                    <el-tag size="small" class="margin-right-s" v-for="(name, index) in getPersonNameList('DIRECTOR')" :key="index" type="info">{{name}}</el-tag>
                                </div>
                                <div class="info-wrapper">
                                    <span class="label">节目编剧</span>
                                    <el-tag size="small" class="margin-right-s" v-for="(name, index) in getPersonNameList('SCENARIST')" :key="index" type="info">{{name}}</el-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import store from 'store';
    export default {
        name: 'ProgrammeBasicInfo',
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
                isSports: 'programme/isSports'
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
                    }).join(', ');
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
            }
        }
    };
</script>
<style lang="less" scoped>
.block-title {
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #283841;
    margin: 15px 0;
    padding: 0;
}
.el-tag {
    border: none;
}
</style>
