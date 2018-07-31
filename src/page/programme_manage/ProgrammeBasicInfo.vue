<!--添加节目-->
<template>
    <div class="program-container">
        <el-row>
            <el-col :span="10">
                <div class="block-title">节目基本信息</div>
                <div class="base-info-container">
                    <el-form status-icon :model="programme" label-width="120px" class="form-block">
                        <el-form-item label="全平台通用ID">
                            <span>{{programme.code}}</span>
                        </el-form-item>
                        <el-form-item label="节目来源">
                            <span>内容中心</span>
                        </el-form-item>
                        <el-form-item label="节目名称" prop="name">
                            <span>{{programme.name}}</span>
                        </el-form-item>
                        <el-form-item label="内部节目名称" prop="innerName">
                            <span>{{programme.innerName}}</span>
                        </el-form-item>
                        <el-form-item label="上映年" prop="releaseAt">
                            <span>{{getYear(programme.releaseAt)}}</span>
                        </el-form-item>
                        <el-form-item label="所属地区" prop="produceAreaList">
                            <span>{{getAreaName(programme.produceAreaList)}}</span>
                        </el-form-item>
                        <el-form-item label="版权起始日期" prop="copyrightRange">
                            <span>{{programme.copyrightStartedAt | formatDate('yyyy-MM-DD')}} ~ {{programme.copyrightEndedAt | formatDate('yyyy-MM-DD')}}</span>
                        </el-form-item>
                        <el-form-item label="牌照方" prop="licence">
                            <span>{{programme.licence}}</span>
                        </el-form-item>
                        <el-form-item label="版权方" prop="copyrightReserved">
                            <span>{{programme.copyrightReserved}}</span>
                        </el-form-item>
                        <el-form-item label="总集数" prop="totalSets">
                            <span>{{programme.totalSets}}</span>
                        </el-form-item>
                        <el-form-item label="评分" prop="score">
                            <span>{{programme.score}}</span>
                        </el-form-item>
                        <el-form-item label="显示播放量" prop="playCountBasic">
                            <span>{{programme.playCountBasic}}</span>
                        </el-form-item>
                        <el-form-item label="实际播放量">
                            <span>{{programme.playCountReal}}</span>
                        </el-form-item>
                        <el-form-item label="发行方" prop="announcer">
                            <span>{{programme.announcer}}</span>
                        </el-form-item>
                        <el-form-item label="规格" prop="specList">
                            <el-tag class="margin-right-s" v-for="(name, index) in programme.specList" :key="index" type="info">{{name}}</el-tag>
                        </el-form-item>
                        <el-form-item label="年级" prop="grade">
                            <span>{{programme.grade}}</span>
                        </el-form-item>
                        <el-form-item label="科目" prop="subject">
                            <span>{{programme.subject}}</span>
                        </el-form-item>
                        <el-form-item label="赛事">
                            <span>{{programme.contest}}</span>
                        </el-form-item>
                        <el-form-item label="播放平台">
                            <el-tag class="margin-right-s" v-for="(name, index) in programme.platformList" :key="index" type="info">{{name}}</el-tag>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="12">
                <el-row>
                    <div class="block-title">节目类型/简介</div>
                    <div class="programme-desc-container">
                        <el-form status-icon :model="programme" label-width="120px" class="form-block">
                            <el-form-item label="节目分类" prop="categoryList">
                                <el-tag class="margin-right-s" v-for="(name, index) in getCategoryNameList(programme.categoryList)" :key="index" type="info">{{name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="节目类型" prop="typeList">
                                <el-tag class="margin-right-s" v-for="(name, index) in getTypeNameList(programme.typeList)" :key="index" type="info">{{name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="关键字" prop="tagList">
                                <el-tag class="margin-right-s" v-for="(name, index) in programme.tagList" :key="index" type="info">{{name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="节目看点" prop="desc">
                                <span>{{programme.desc}}</span>
                            </el-form-item>
                            <el-form-item label="节目简介" prop="description">
                                <span>{{programme.description}}</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-row>
                <el-row>
                    <div class="block-title">演职人员</div>
                    <div class="person-container">
                        <el-form status-icon :model="programme" label-width="120px" class="form-block">
                            <el-form-item label="节目主演">
                                <el-tag class="margin-right-s" v-for="(name, index) in getPersonNameList('CHIEF_ACTOR')" :key="index" type="info">{{name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="节目导演">
                                <el-tag class="margin-right-s" v-for="(name, index) in getPersonNameList('DIRECTOR')" :key="index" type="info">{{name}}</el-tag>
                            </el-form-item>
                            <el-form-item label="节目编剧">
                                <el-tag class="margin-right-s" v-for="(name, index) in getPersonNameList('SCENARIST')" :key="index" type="info">{{name}}</el-tag>
                            </el-form-item>
                        </el-form>
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
                global: 'programme/global'
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
.base-info-container, .programme-desc-container, .person-container {
    background-color: #fff;
    padding: 20px;
}
.base-info-container {
    margin-right: 20px;
}
</style>
