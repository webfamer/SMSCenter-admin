<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <el-row :gutter="24">
        <el-col class="joker-col" :lg="6" :md="8" v-has="'accountInputBtn'">
          <div class="block">
            <el-input
              v-model="search.loginName"
              placeholder="搜索账户名称"
            ></el-input>
          </div>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8" v-has="'dataInputBtn'">
          <el-date-picker
            v-model="search.date"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col class="joker-col" :lg="6" :md="8">
          <el-button type="primary" icon="el-icon-search" @click="doSearch"
          v-has="'searchAccountBtn'"
            >查询</el-button
          >
          <el-button
          v-has="'accountResetBtn'"
            type="primary"
            icon="el-icon-refresh-right"
            @click="resetForm"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add"
          v-has="'addAccountBtn'"
            >新增</el-button
          >
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
        >
          <el-table-column
            prop="phone"
            label="手机号"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="loginName"
            label="登陆名称"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="platform"
            label="账户类型"
            min-width="90"
          :formatter="formateAccount"
          ></el-table-column>
          <el-table-column
            prop="roleId"
            label="权限id"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="superAdmin"
            label="超级管理员"
            min-width="90"
            :formatter="formateadmin"
          ></el-table-column>
           <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="180"
          ></el-table-column>
          <el-table-column
            prop="createAdminId"
            label="创建者id"
            min-width="90"
          ></el-table-column>
                   <el-table-column
            prop="lastLoginTime"
            label="最后登陆时间"
            min-width="180"
          ></el-table-column>
          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-row v-show="scope.row.roleId !== 0">
                <el-button
                v-has="'delAccountBtn'"
                  @click="delAccount(scope.row)"
                  type="text"
                  icon="el-icon-delete-solid"
                  size="small"
                  >删除</el-button
                >
                <el-button
                v-has="'editAccountBtn'"
                  type="text"
                  icon="el-icon-s-tools"
                  size="small"
                  @click="edit(scope.row)"
                  >编辑</el-button
                >
              </el-row>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
        v-has="'accountPaginationBtn'"
          :page="page"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        ></Pagination>
      </el-card>
    </div>
    <Detail ref="detail" @getList="getTableData"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
import PageMixins from "@/mixins/pageMixins";
import accountApi from "@/api/accountApi";
import Pagination from "@/components/Pagination/index";
import _ from "lodash";
import { resetDataAttr } from "@/utils/index.js";
export default {
  mixins: [PageMixins],
  data() {
    return {
      input: "",
      value1: "",
      tableData: [],
      username: "",
      search: {
        date: []
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      if (this.page.start > 1 && this.tableData.length === 1) {
        //如果是最后一条数据，更改请求的当前页
        this.page.start -= 1;
      }
      accountApi
        .getAccount({
          ...this.search,
          startDate:this.search.date[0],
          endDate:this.search.date[1],
          page: {
            current: this.page.start,
            size: this.page.limit
          }
        })
        .then(res => {
          this.tableData = res.data;
          this.page.total = res.page.total;
          this.page.start = res.page.current;
        });
    },
    delAccount(row) {
      console.log(row);
      this.$confirm("<strong>是否删除该账户?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          accountApi
            .delAccount({
              id: row.id
            })
            .then(res => {
              if (res.code == 0) {
                this.dialogVisible = false;
                this.getTableData();
                this.$message({
                  message: res.message,
                  type: "success"
                });
              } else {
                this.$message.error(res.message);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除"
          });
        });
    },

    edit(row) {
      console.log(row);
      this.$refs.detail.openDialog(row);
    },
    add() {
      this.$refs.detail.openDialog();
    },
    handleSizeChange(v) {
      this.page.limit = v;
      this.getTableData();
    },
    handleCurrentChange(v) {
      this.page.start = v;
      this.getTableData();
    },
    doSearch() {
      console.log(this.search);
      this.getTableData();
    },
    resetForm() {
      resetDataAttr(this, "search");
      this.getTableData();
    },
    jumpsAppItem(row) {
      this.$router.push({ name: "appitem", params: row });
    },
    jumpAppservice(row) {
      this.$router.push({ name: "appservice", params: row });
    },
        //格式化表单
    formatform(row, selectItem, rowItem) {
      //selelctItem是option.js里的数组名，rowITem是row里的参数名
      let newItem = "";
      this.$selectOptions[selectItem].forEach(item => {
        if (item.value === row[rowItem]) {
          newItem = item.label;
        }
      });
      return newItem;
    },
    formateAccount(row) {
      return this.formatform(row,"accountPlantform","platform");
    },
   formateadmin(row) {
      return this.formatform(row, "accountFormat","superAdmin");
    }
  },
  components: {
    Detail,
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.customer {
  .content-box {
    margin: 30px;
    box-sizing: border-box;
    .pagination {
      margin-top: 30px;
    }
  }
  .joker-col {
    width: auto;
    margin-bottom: 10px;
  }
}
</style>
