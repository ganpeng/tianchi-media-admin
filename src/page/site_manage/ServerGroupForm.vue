<template>
    <div class="server-group-form-container">
        <div class="form-container">
            <el-col :span="8">
                <el-form :model="serverGroup" :rules="infoRules" status-icon ref="createVersion"
                        label-width="140px"
                        @submit.native.prevent
                        class="form-block my-form">
                    <el-form-item label="组类型" prop="type">
                        <el-select
                            clearable
                            filterable
                            :value="serverGroup.type"
                            placeholder="请选择组类型"
                            @input="inputHandler($event, 'type')"
                        >
                            <el-option
                                v-for="(item, index) in []"
                                :key="index"
                                :label="item.name"
                                :value="item.value">
                            </el-option>
                        </el-select>
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
                    <el-form-item label="最大频道数" prop="no">
                        <el-input
                            :value="serverGroup.no"
                            @input="inputHandler($event, 'no')"
                        ></el-input>
                    </el-form-item>

                </el-form>
            </el-col>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
export default {
    name: 'ServerGroupForm',
    data() {
        return {
            infoRules: {}
        };
    },
    computed: {
        ...mapGetters({
            serverGroup: 'serverGroup/currentServerGroup'
        })
    },
    methods: {
        ...mapMutations({
            updateCurrentServerGroup: 'serverGroup/updateCurrentServerGroup'
        }),
        inputHandler(value, key) {
            this.updateCurrentServerGroup({key, value});
        }
    }
};
</script>
<style lang="scss" scoped>
</style>
