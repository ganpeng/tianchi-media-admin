<template>
  <div class="device-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row">
                    <div class="search-field-item">
                        <el-input
                            :value="searchFields.keyword"
                            placeholder="请输入关键字"
                            @input="inputSearchFieldHandler($event, 'keyword')"
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
                            :value="searchFields.expiredAt"
                            type="daterange"
                            :unlink-panels="true"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'expiredAt')"
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
                            :value="searchFields.createdAt"
                            type="daterange"
                            :unlink-panels="true"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'createdAt')"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">更新时间</label>
                        <el-date-picker
                            :value="searchFields.updatedAt"
                            type="daterange"
                            :unlink-panels="true"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            @input="inputSearchFieldHandler($event, 'updatedAt')"
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
                        <div v-show="isDisabled" class="my-disabled-dropdown">
                            批量操作
                            <i class="el-icon-arrow-down"></i>
                        </div>
                        <el-dropdown
                            trigger="click"
                            v-show="!isDisabled"
                            class="my-dropdown">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <span @click="batchDeletHandler">批量删除</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="createBoss">
                            <svg-icon icon-class="add"></svg-icon>
                            添加
                        </el-button>
                        <el-button
                            @click="importBoss"
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
                    @selection-change="handleSelectionChange"
                    :data="list" border>
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column width="60" align="center" label="id">
                        <template slot-scope="scope">
                            {{scope.row.id | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150" align="center" label="序列号">
                        <template slot-scope="scope">
                            {{scope.row.stbNo | padEmpty}}
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="到期时间">
                        <template slot-scope="scope">
                            {{scope.row.expiredAt | formatDate('yyyy-MM-DD')}} 00:00:00
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="受理时间">
                        <template slot-scope="scope">
                            {{scope.row.processedAt | formatDate('yyyy-MM-DD')}} 00:00:00
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="创建时间">
                        <template slot-scope="scope">
                            {{scope.row.createdAt | formatDate('yyyy-MM-DD')}} 00:00:00
                        </template>
                    </el-table-column>
                    <el-table-column min-width="120" align="center" label="更新时间">
                        <template slot-scope="scope">
                            {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}} 00:00:00
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="120px" label="操作">
                        <template slot-scope="scope">
                            <div class="operator-btn-wrapper">
                                <span class="btn-text" @click="editBoss(scope.row.id)">编辑</span>
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
export default {
  name: 'BossList',
  data() {
      return {
          searchFieldVisible: false,
          status: 0, // 0 是创建，1 是编辑
          selectedBossList: []
      };
  },
  created() {
      if (!this.$authority.isHasAuthority('bo:boss:page')) {
          return;
      }
      this.resetSearch();
      window.addEventListener('keyup', this.keyupHandler);
  },
  beforeDestroy() {
      window.removeEventListener('keyup', this.keyupHandler);
  },
  computed: {
      ...mapGetters({
          list: 'boss/list',
          pagination: 'boss/pagination',
          searchFields: 'boss/searchFields',
          boss: 'boss/boss'
      }),
        isDisabled() {
            return this.selectedBossList.length === 0;
        }
  },
  methods: {
      ...mapMutations({
          updatePagination: 'boss/updatePagination',
          updateSearchFields: 'boss/updateSearchFields',
          resetSearchFields: 'boss/resetSearchFields',
          resetPagination: 'boss/resetPagination'
      }),
      ...mapActions({
          getBossList: 'boss/getBossList',
          deleteBossByIdList: 'boss/deleteBossByIdList'
      }),
      importBoss() {
          if (!this.$authority.isHasAuthority('bo:boss:import')) {
              return;
          }
          let routeData = this.$router.resolve({
              name: 'BossImport'
          });
          window.open(routeData.href, '_blank');
      },
      resetSearch() {
          this.resetSearchFields();
          this.resetPagination();
          this.getBossList();
      },
      clearSearchFields() {
          if (!this.$authority.isHasAuthority('bo:boss:page')) {
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
          if (!this.$authority.isHasAuthority('bo:boss:page')) {
              return;
          }
          this.updatePagination({key, value});
          this.getBossList();
      },
      inputSearchFieldHandler(value, key) {
          if (!this.$authority.isHasAuthority('bo:boss:page')) {
              return;
          }
          this.updateSearchFields({key, value});
          if (key !== 'no') {
              this.getBossList();
          }
      },
      searchHandler() {
          if (!this.$authority.isHasAuthority('bo:boss:page')) {
              return;
          }
          this.getBossList();
      },
      createBoss() {
        if (!this.$authority.isHasAuthority('bo:boss:add')) {
            return;
        }
        this.$router.push({name: 'CreateBoss'});
      },
      editBoss(id) {
        if (!this.$authority.isHasAuthority('bo:boss:put')) {
            return;
        }
        this.$router.push({name: 'EditBoss', params: {id}});
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
      async deleteDevice(id) {
          try {
            if (!this.$authority.isHasAuthority('bo:boss:delete')) {
                return;
            }
             let confirm = await this.$confirm(`您确定要删除这个设备吗, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            });
            if (confirm) {
                let idList = [id];
                if (idList.length > 0) {
                    let res = await this.$service.deleteBossByIdList(idList);
                    if (res && res.code === 0) {
                        this.resetSearch();
                    } else {
                        this.$message.error(res.errorMsg);
                    }
                }
            }
          } catch (err) {
              console.log(err);
          }
     },
     handleSelectionChange(val) {
        this.selectedBossList = val;
     },
     async batchDeletHandler() {
         try {
            if (!this.$authority.isHasAuthority('bo:boss:delete')) {
                return;
            }
             let confirm = await this.$confirm(`您确定要删除这些设备吗, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            });
            if (confirm) {
                let idList = this.selectedBossList.map((boss) => boss.id);
                if (idList.length > 0) {
                    let res = await this.$service.deleteBossByIdList(idList);
                    if (res && res.code === 0) {
                        this.resetSearch();
                    } else {
                        this.$message.error(res.errorMsg);
                    }
                }
            }
         } catch (err) {
             console.log(err);
         }
     }
  }
};
</script>
<style lang="scss" scoped>
</style>
