<template>
  <div class="device-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="searchFields.no"
                            placeholder="请输入关键字"
                            @input="inputSearchFieldHandler($event, 'no')"
                            clearable
                            class="border-input">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="searchHandler" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">到期时间</label>
                        <el-date-picker
                            :value="searchFields.registeredAt"
                            type="daterange"
                            :unlink-panels="true"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'registeredAt')"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <el-button class="btn-style-one" type="primary" @click="clearSearchFields" plain>
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                    <span
                        @click="toggleSearchField"
                        :class="['el-dropdown-link', searchFieldVisible ? 'active' : '']">
                        更多筛选<i v-if="searchFieldVisible" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i><i
                        v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                    </span>
                </div>
                <div v-show="searchFieldVisible" class="field-row">
                    <div class="search-field-item">
                        <label class="search-field-item-label">创建时间</label>
                        <el-date-picker
                            :value="searchFields.registeredAt"
                            type="daterange"
                            :unlink-panels="true"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'registeredAt')"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">更新时间</label>
                        <el-date-picker
                            :value="searchFields.registeredAt"
                            type="daterange"
                            :unlink-panels="true"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'registeredAt')"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">设备准入列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <sort-item :sortKeyList="sortKeyList" :sortQueryChangeHandler="sortQueryChangeHandler"></sort-item>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createDeviceEnter">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                        <el-button
                            @click="importDevice"
                            class="btn-style-two contain-svg-icon">
                            <svg-icon icon-class="import"></svg-icon>
                            导入
                        </el-button>
                    </div>
                </div>
                <el-table
                    header-row-class-name="common-table-header"
                    class="my-table-style"
                    @sort-change="sortChangeHandler"
                    :data="list" border>
                    <el-table-column width="60" align="center" label="id">
                        <template slot-scope="scope">
                            {{scope.row.id | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150" align="center" label="序列号">
                        <template slot-scope="scope">
                            {{scope.row.no | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="到期时间">
                        <template slot-scope="scope">
                            {{scope.row.caNo | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="受理时间">
                        <template slot-scope="scope">
                            {{scope.row.currentHardVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.currentVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.currentVersion | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="editDeviceEnter(scope.row.id)">编辑</span>
                                <span class="btn-text text-danger" @click="deleteDevice(scope.row.id)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
  </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import role from '@/util/config/role';
import SortItem from 'sysComponents/custom_components/custom/SortItem';
export default {
  name: 'DeviceEnterList',
  components: {SortItem},
  data() {
      return {
          searchFieldVisible: false,
          status: 0, // 0 是创建，1 是编辑
          hardwareTypeOptions: role.HARDWARE_TYPE_OPTIONS,
          visibleOptions: [
              {value: 'NORMAL', name: '正常'}, {value: 'FORBIDDEN', name: '禁用'}
          ],
          sortKeyList: [
              {
                  label: '注册时间',
                  value: 'REGISTERED_AT'
              },
              {
                  label: '最后在线时间',
                  value: 'LAST_ONLINE_TIME'
              }
          ]
      };
  },
  created() {
      if (!this.$authority.isHasAuthority('user:stb:page')) {
          return;
      }
      this.getDeviceList();
      window.addEventListener('keyup', this.keyupHandler);
  },
  beforeDestroy() {
      window.removeEventListener('keyup', this.keyupHandler);
  },
  computed: {
      ...mapGetters({
          list: 'deviceEnter/list',
          pagination: 'deviceEnter/pagination',
          searchFields: 'deviceEnter/searchFields',
          device: 'deviceEnter/device'
      }),
      getIndex() {
          return (index) => {
              let {pageNum, pageSize} = this.pagination;
              return index + 1 + (pageNum - 1) * pageSize;
          };
      },
      getDistrictName() {
          return (districtCode) => {
              if (_.isNil(districtCode)) {
                  return '';
              } else {
                  let district = this.filialeList.find((item) => parseInt(item.code) === parseInt(districtCode));
                  return _.get(district, 'name');
              }
          };
      }
  },
  methods: {
      ...mapMutations({
          updatePagination: 'deviceEnter/updatePagination',
          updateSearchFields: 'deviceEnter/updateSearchFields',
          resetSearchFields: 'deviceEnter/resetSearchFields',
          setDevice: 'deviceEnter/setDevice',
          setCurrentId: 'deviceEnter/setCurrentId',
          resetDevice: 'deviceEnter/resetDevice'
      }),
      ...mapActions({
          getDeviceList: 'device/getDeviceList',
          deleteDeviceById: 'device/deleteDeviceById'
      }),
      importDevice() {
          let routeData = this.$router.resolve({
              name: 'DeviceImport'
          });
          window.open(routeData.href, '_blank');
      },
      clearSearchFields() {
          if (!this.$authority.isHasAuthority('user:stb:page')) {
              return;
          }
          this.resetSearchFields();
          this.searchHandler();
      },
      keyupHandler(e) {
          if (e.keyCode === 13) {
          }
      },
      handlePaginationChange(value, key) {
          if (!this.$authority.isHasAuthority('user:stb:page')) {
              return;
          }
          this.updatePagination({key, value});
          this.getDeviceList();
      },
      inputSearchFieldHandler(value, key) {
          if (!this.$authority.isHasAuthority('user:stb:page')) {
              return;
          }
          this.updateSearchFields({key, value});
          if (key !== 'no') {
              this.getDeviceList();
          }
      },
      searchHandler() {
          if (!this.$authority.isHasAuthority('user:stb:page')) {
              return;
          }
          this.getDeviceList();
      },
      createDeviceEnter() {
          if (!this.$authority.isHasAuthority('user:stb:page')) {
              return;
          }
            this.$router.push({name: 'CreateDeviceEnter'});
      },
      editDeviceEnter(id) {
            this.$router.push({name: 'EditDeviceEnter', params: {id}});
      },
      toggleSearchField() {
          this.searchFieldVisible = !this.searchFieldVisible;
      },
      // dev2.9
      sortChangeHandler(obj) {
          let {prop, order} = obj;
          if (prop === 'registeredAt') {
              let sortedListByCreatedAt = [];
              if (order === 'ascending') {
                  sortedListByCreatedAt = _.chain(this.list).sortBy('registeredAt').value();
              } else {
                  sortedListByCreatedAt = _.chain(this.list).sortBy('registeredAt').reverse().value();
              }
              this.setList({list: sortedListByCreatedAt});
          }
          if (prop === 'lastOnlineTime') {
              let sortedListByCreatedAt = [];
              if (order === 'ascending') {
                  sortedListByCreatedAt = _.chain(this.list).sortBy('lastOnlineTime').value();
              } else {
                  sortedListByCreatedAt = _.chain(this.list).sortBy('lastOnlineTime').reverse().value();
              }
              this.setList({list: sortedListByCreatedAt});
          }
      },
      sortQueryChangeHandler(obj) {
          let {sortKey, sortDirection} = obj;
          this.updateSearchFields({key: 'sortKey', value: sortKey});
          this.updateSearchFields({key: 'sortDirection', value: sortDirection});
          this.searchHandler();
      },
      deleteDevice(id) {
        console.log(id);
     }
  }
};
</script>
<style lang="scss" scoped>
</style>
