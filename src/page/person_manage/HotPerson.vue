<template>
    <div class="container">
        <el-breadcrumb class="gp-breadcrumb" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>人物资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>推荐人物管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form text-left">
            <el-form-item class="search">
                <el-input
                    :value="keyword"
                    placeholder="搜索你想要的信息"
                    clearable
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table class="my-table-style" :data="Object.keys(hotPerson.hotPerson)" border>
            <el-table-column align="center" width="240px" label="栏目/模块">
                <template slot-scope="scope">
                    {{getHotName(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column align="left" label="推荐人物">
                <template slot-scope="scope">
                    <div :id="'hot-person-list-' + scope.$index" class="hot-person-list text-left">
                        <span :data-person="JSON.stringify(person)"
                            class="margin-right-s hot-person-item"
                            v-for="(person, index) in getHotPersonList(scope.row)"
                            :key="index">
                            <el-tag closable @close="removePerson(person.figureId, scope.row)" type="info">{{person.figureName}}</el-tag>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" width="200px" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showHotPersonDialog(scope.row)">新增</el-button>
                    <el-button type="text" size="small" @click="saveHotPerson(scope.row, scope.$index)">保存</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="添加推荐人物"
            :visible.sync="hotPersonDialog"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
                <div class="wrapper">
                    <person-select
                        :value="hotPerson.persons"
                        :searchResult="hotPerson.personsResult"
                        :changeSuccessHandler="personsChangeHandler"
                        :searchSuccessHandler="personsSuccessHandler"
                    ></person-select>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addHotPerson">确定</el-button>
                    <el-button @click="closeHotPersonDialog">关闭</el-button>
                </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import PersonSelect from './PersonSelect';
export default {
    name: 'HotPerson',
    components: {
        PersonSelect
    },
    data() {
        return {
            keyword: '',
            hotPersonDialog: false
        };
    },
    computed: {
        ...mapGetters({
            hotPerson: 'person/hotPerson',
            getHotName: 'person/getHotName',
            getHotPersonList: 'person/getHotPersonList'
        })
    },
    created() {
        this.getHotPerson()
            .then(() => {
                this.$nextTick(function () {
                    let hotPersonList = document.querySelectorAll('.hot-person-list');
                    for (let i = 0; i < hotPersonList.length; i++) {
                        this.$dragula([hotPersonList[i]], {
                            direction: 'horizontal'
                        });
                    }
                });
            });
    },
    methods: {
        ...mapMutations({
            updatePersonResult: 'person/updatePersonResult',
            updatePerson: 'person/updatePerson',
            updateHotPerson: 'person/updateHotPerson'
        }),
        ...mapActions({
            putHotPerson: 'person/putHotPerson',
            getHotPerson: 'person/getHotPerson'
        }),
        addHotPerson() {
            let {hotCode, persons} = this.hotPerson;
            let hotPerson = _.cloneDeep(this.hotPerson.hotPerson);
            let currentHotPerson = hotPerson[hotCode];
            let tempPersons = persons.map((person) => {
                return {
                    figureId: person.id,
                    figureName: person.name
                };
            });

            if (currentHotPerson.length + tempPersons.length > 14) {
                this.$message.error('推荐人物不能超过14个');
                return false;
            } else {
                currentHotPerson = tempPersons.concat(currentHotPerson);
                hotPerson[hotCode] = _.uniqBy(currentHotPerson, 'figureId');
                this.updateHotPerson({key: 'hotPerson', value: hotPerson});
                this.closeHotPersonDialog();
            }
        },
        showHotPersonDialog(hotCode) {
            this.hotPersonDialog = true;
            this.updateHotPerson({key: 'hotCode', value: hotCode});
        },
        closeHotPersonDialog() {
            this.hotPersonDialog = false;
            this.updateHotPerson({key: 'hotCode', value: ''});
            this.updateHotPerson({key: 'persons', value: []});
            this.updateHotPerson({key: 'personsResult', value: []});
        },
        removePerson(personId, hotCode) {
            let hotPerson = _.cloneDeep(this.hotPerson.hotPerson);
            let currentHotPerson = hotPerson[hotCode].filter((person) => person.figureId !== personId);
            hotPerson[hotCode] = _.uniqBy(currentHotPerson, 'figureId');
            this.updateHotPerson({key: 'hotPerson', value: hotPerson});
        },
        personsChangeHandler(value) {
            this.updatePerson({key: 'persons', idList: value});
        },
        personsSuccessHandler(list) {
            this.updatePersonResult({key: 'personsResult', value: list});
        },
        saveHotPerson(hotCode, index) {
            let hotFigureList = Array.from(document.querySelectorAll(`#hot-person-list-${index} .hot-person-item`)).map((ele, index) => {
                let person = JSON.parse(ele.getAttribute('data-person'));
                let obj = {
                    figureId: person.figureId,
                    sort: index
                };
                return obj;
            });
            this.putHotPerson({hotCategory: hotCode, hotFigureList})
                .then((res) => {
                    this.$message.success('人们人物保存成功');
                });
        }
    }
};
</script>
<style lang="less" scoped>
    .hot-person-list {
        padding: 20px;
        margin-bottom: 20px;
        border: 1px solid #dcdfe6;
    }
    .wrapper {
        position: relative;
        width: 200px;
    }
</style>
