<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="3">
          <div class="block">
            <el-input v-model="search.merchantChiName" placeholder="搜索客户名称"></el-input>
          </div>
        </el-col>
        <el-col :span="5" :offset="1">
          <el-date-picker
            v-model="search.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="4" :offset="1" :lg="6" :md="8">
          <el-button type="primary" icon="el-icon-search" @click="doSearch">查询</el-button>
          <el-button type="primary" icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
        >
          <el-table-column prop="merchantChiName" label="客户名称" width="180"></el-table-column>
          <el-table-column prop="openedApiAmount" label="已开通服务" width="180"></el-table-column>
          <el-table-column prop="follower" label="首联系人"></el-table-column>
          <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
          <el-table-column prop="createTime" sortable label="创建时间"></el-table-column>
          <el-table-column fixed="right" label="操作" width="400">
            <template slot-scope="scope">
              <el-button
                @click="jumpsAppItem(scope.row)"
                type="text"
                icon="el-icon-menu"
                size="small"
              >APP</el-button>
              <el-button
                type="text"
                icon="el-icon-s-custom"
                size="small"
                @click="jumpAppservice(scope.row)"
              >开通服务</el-button>
              <el-button @click="edit(scope.row)" type="text" icon="el-icon-s-tools" size="small">编辑</el-button>

              <el-button
                type="text"
                slot="reference"
                size="small"
                icon="el-icon-remove"
                v-show="scope.row.status === 1"
                @click="disableCustomer(scope.row)"
              >停用</el-button>
              <el-button
                type="text"
                slot="reference"
                size="small"
                icon="el-icon-remove"
                v-show="scope.row.status === 98"
                @click="enableCustomer(scope.row)"
              >启用</el-button>
              <el-button
                type="text"
                slot="reference"
                size="small"
                icon="el-icon-delete-solid"
                @click="delCustomer(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :page="page"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        ></Pagination>
      </el-card>
    </div>
    <Detail ref="detail" @getList="getCustomerList"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
import customerApi from "@/api/customer.js";
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
    console.log("created");
    this.getCustomerList();
  },
  methods: {
    getCustomerList() {
      let params = {
        merchantChiName: this.search.merchantChiName,
        startTime: this.search.date[0],
        endTime: this.search.date[1]
      };
      customerApi
        .getCustomer({
          ...params,
          pageVo: {
            currentPage: this.page.start,
            pageSize: this.page.limit
          }
        })
        .then(res => {
          this.tableData = res.data.records;
          this.page.total = res.data.totalPage;
          this.page.start = res.data.currentPage;
        });
    },
    disableCustomer(row) {
      //停用商户
      console.log(row);
      this.$confirm(
        "<strong>是否确定停用客户?</strong><br>停用客户后无法使用所有服务",
        "确认提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          customerApi
            .delCustomer({
              merchantId: row.id,
              status: 98
            })
            .then(res => {
              if ((res.msg = "success")) {
                this.$message({
                  type: "success",
                  message: "已成功停用"
                });
                this.flag = false;
                this.getCustomerList();
              } else {
                this.$message.error("保存失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用"
          });
        });
    },

    enableCustomer(row) {
      this.$confirm(
        "<strong>是否确定启用客户?</strong><br>启用后恢复服务的使用",
        "确认提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          customerApi
            .delCustomer({
              merchantId: row.id,
              status: 1
            })
            .then(res => {
              if ((res.msg = "success")) {
                this.$message({
                  type: "success",
                  message: "已成功启用"
                });
                this.flag = false;
                this.getCustomerList();
              } else {
                this.$message.error("保存失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    delCustomer(row) {
      this.$confirm(
        "<strong>是否确定删除客户?</strong>",
        "确认提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning"
        }
      )
        .then(() => {
          customerApi
            .delCustomer({
              merchantId: row.id,
              status: 99
            })
            .then(res => {
              if ((res.msg = "success")) {
                this.$message({
                  type: "success",
                  message: "已成功删除"
                });
                this.flag = false;
                this.getCustomerList();
              } else {
                this.$message.error("删除失败");
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    edit(row) {
      console.log(row);
      this.$refs.detail.openDialog(row.id);
    },
    add() {
      this.$refs.detail.openDialog();
    },
    handleSizeChange(v) {
      this.page.limit = v;
      this.getCustomerList();
    },
    handleCurrentChange(v) {
      this.page.start = v;
      this.getCustomerList();
    },
    doSearch() {
      console.log(this.search);
      this.getCustomerList();
    },
    resetForm() {
      this.getCustomerList();
      resetDataAttr(this, "search");
    },
    jumpsAppItem(row) {
      this.$router.push({ name: "appitem", params: row });
    },
    jumpAppservice(row) {
      this.$router.push({ name: "appservice", params: row });
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
  .search-box {
    .el-row {
      padding-left: 7px;
    }
  }
  .content-box {
    margin: 30px;
    box-sizing: border-box;
    .pagination {
      margin-top: 30px;
    }
  }
}
</style>
