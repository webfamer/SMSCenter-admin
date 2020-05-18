<template>
  <div class="customer">
    <pan-shi-search>
      <template #1>
        <el-input v-model="search.merchantChiName" maxlength="10" placeholder="搜索客户名称"></el-input>
      </template>
      <template #2>
        <el-date-picker
          v-model="search.date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </template>
      <template #3>
        <pan-shi-button type="search" @click="getTableData(undefined)">查询</pan-shi-button>
        <pan-shi-button type="reset" @click="resetForm">重置</pan-shi-button>
      </template>
    </pan-shi-search>

    <pan-shi-table
      :table="table"
      :total="total"
      :currentPage.sync="currentPage"
      :pageSize.sync="pageSize"
      @buttonsEvent="buttonsEvent"
      @pagination="getTableData"
    >
      <pan-shi-button type="add" @click="add">新增</pan-shi-button>
    </pan-shi-table>
    <Detail ref="detail" @getList="getTableData"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";

import customerApi from "@/api/customer.js";
import _ from "lodash";
import { resetDataAttr, getPagination } from "@/utils/index.js";

export default {
  components: {
    Detail
  },
  data() {
    return {
      // 表格数据
      ...getPagination(),
      table: {
        body: [
          { fieldName: "merchantChiName", fieldText: "客户名称" },
          { fieldName: "openedApiAmount", fieldText: "已开通服务" },
          { fieldName: "follower", fieldText: "首联系人" },
          { fieldName: "phoneNumber", fieldText: "手机号码" },
          {
            fieldName: "createTime",
            fieldText: "创建时间",
            sortable: true,
            type: 'time'
          },
          {
            fieldName: "updateTime",
            fieldText: "修改时间",
            sortable: true,
            type: 'time'
          },
          {
            fieldText: "操作",
            type: "buttons",
            content: [
              {
                fieldText: "APP",
                icon: "el-icon-menu"
              },
              {
                fieldText: "开通服务",
                icon: "el-icon-s-custom"
              },
              {
                fieldText: "编辑",
                icon: "el-icon-s-tools"
              },
              {
                fieldText: "停用",
                icon: "el-icon-remove"
              },
              {
                fieldText: "启用",
                icon: "el-icon-remove"
              },
              {
                fieldText: "删除",
                icon: "el-icon-delete-solid"
              }
            ],
            tableColumnAttributes: {
              width: 400
            }
          }
        ],
        tableAttributes: {
          data: []
        },
      },
      //
      input: "",
      search: {
        date: []
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData(obj) {
      if (obj && obj.page) {
        this.currentPage = obj.page;
        this.pageSize = obj.limit;
      }

      if (this.currentPage > 1 && this.table.tableAttributes.data.length === 1) {
        // 如果是最后一条数据，更改请求的当前页
        this.currentPage = 1;
      }

      let params = {
        merchantChiName: _.trim(this.search.merchantChiName),
        startTime: this.search.date[0],
        endTime: this.search.date[1]
      };
      customerApi
        .getCustomer({
          ...params,
          pageVo: {
            currentPage: this.currentPage,
            pageSize: this.pageSize
          }
        })
        .then(res => {
          this.table.tableAttributes.data = res.data.records;
          this.total = res.data.total;
        });
    },
    resetForm() {
      resetDataAttr(this, "search");
      this.getTableData();
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
                this.getTableData();
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
                this.getTableData();
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
      this.$confirm("<strong>是否确定删除客户?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          customerApi
            .delCustomer({
              merchantId: row.id,
              status: 99
            })
            .then(res => {
              if (res.code === 0) {
                this.$message({
                  type: "success",
                  message: "已成功删除"
                });
                this.getTableData();
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
      this.$refs.detail.openDialog(row.id);
    },
    add(formName) {
      resetDataAttr(this, "search");
      this.$refs.detail.openDialog();
    },
    jumpsAppItem(row) {
      this.$router.push({ name: "app", params: row });
    },
    jumpAppservice(row) {
      this.$router.push({ name: "service", params: row });
    },
    buttonsEvent({scope, btnIndex}) {
      switch (btnIndex) {
        case 0:
          this.jumpsAppItem(scope.row);
          break;
        case 1:
          this.jumpAppservice(scope.row);
          break;
        case 2:
          this.edit(scope.row);
          break;
        case 3:
          this.disableCustomer(scope.row);
          break;
        case 4:
          this.enableCustomer(scope.row);
          break;
        case 5:
          this.delCustomer(scope.row);
          break;
      }
    }
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
.joker-col {
  width: auto;
  margin-bottom: 10px;
}
</style>
