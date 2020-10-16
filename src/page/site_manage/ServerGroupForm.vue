<template>
    <div class="server-group-form-container">
        <div class="form-container">
            <el-col :span="8">
                <el-form :model="serverGroup" :rules="infoRules" status-icon
                        label-width="140px"
                        ref="serverGroupForm"
                        @submit.native.prevent
                        class="form-block my-form">
                    <el-form-item label="组类型" prop="typeList">
                        <div class="my-tags">
                            <el-tag
                                :key="index"
                                v-for="(type, index) in serverGroup.typeList"
                                closable
                                :disable-transitions="false"
                                @close="deleteTypeHandler(type)">
                                {{typeName(type)}}
                            </el-tag>
                        </div>
                        <search-input
                            :restaurants="serverGroupTypeOPtions"
                            :handleSelect="selectTypeHandler"
                        ></search-input>
                    </el-form-item>
                    <el-form-item label="组名称" prop="name">
                        <el-input
                            :value="serverGroup.name"
                            :maxlength="11"
                            @input="inputHandler($event, 'name')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="服务器IP" prop="ip">
                        <el-input
                            :value="serverGroup.ip"
                            @input="inputHandler($event, 'ip')"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="最大频道数" prop="currentCount">
                        <el-input
                            :value="serverGroup.currentCount"
                            @input="inputHandler($event, 'currentCount')"
                        ></el-input>
                    </el-form-item>

                </el-form>
            </el-col>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import role from '@/util/config/role';
import constants from '@/util/constants';
import SearchInput from 'sysComponents/custom_components/custom/SearchInput';
export default {
    name: 'ServerGroupForm',
    components: {SearchInput},
    data() {
        return {
            serverGroupTypeOPtions: role.SERVER_GROUP_TYPE_OPTIONS,
            infoRules: {
                typeList: [
                    { required: true, message: '请选择组类型' }
                ],
                name: [
                    { required: true, message: '请输入组名称' }
                ],
                ip: [
                    { required: true, message: '请输入服务组IP' },
                    {
                        pattern: constants.IP_ADDRESS,
                        message: '请输入正确的IP地址'
                    }
                ],
                currentCount: [
                    { required: true, message: '请输入最大频道数' },
                    {
                        pattern: /^\+?[1-9][0-9]*$/,
                        message: '最大频道数只能是大于0的整数'
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters({
            serverGroup: 'serverGroup/currentServerGroup'
        }),
        typeName() {
            return (type) => {
                let obj = this.serverGroupTypeOPtions.find((item) => item.value === type);
                return _.get(obj, 'name') || '';
            };
        }
    },
    methods: {
        ...mapMutations({
            updateCurrentServerGroup: 'serverGroup/updateCurrentServerGroup'
        }),
        inputHandler(value, key) {
            this.updateCurrentServerGroup({key, value});
        },
        deleteTypeHandler(type) {
            let typeList = this.serverGroup.typeList.filter((item) => item !== type);
            this.updateCurrentServerGroup({key: 'typeList', value: typeList});
        },
        selectTypeHandler(obj) {
            let typeList = _.chain(this.serverGroup.typeList)
                            .concat([obj.value])
                            .uniqBy()
                            .value();
            this.updateCurrentServerGroup({key: 'typeList', value: typeList});
        },
        validate() {
            return this.$refs.serverGroupForm.validate();
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
