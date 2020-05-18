<template>
  <div class="apiManage">
    <el-card class="search-box" shadow="hover">
      <p class="title"><i class="el-icon-menu"></i>短信机构管理</p>
    </el-card>

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
import customerApiGroup from "@/api/customerGroupApi";

import { resetDataAttr, getPagination } from "@/utils/index.js";
export default {
  components: {
    Detail
  },
  data() {
    return {
      ...getPagination(),
      table: {
        body: [
          { fieldName: "groupChiName", fieldText: "机构ID" },
          {
            fieldName: "gmtCreate",
            fieldText: "接入时间",
            sortable: true,
            type: "time"
          },
          { fieldName: "apiCount", fieldText: "机构名称" },
          { fieldName: "apiCount", fieldText: "单价/条" },
          { fieldName: "apiCount", fieldText: "状态" },
          { fieldName: "apiCount", fieldText: "默认优先级" },
          { fieldName: "apiCount", fieldText: "备注" },
          {
            fieldName: "gmtModified",
            fieldText: "最后操作时间",
            sortable: true,
            type: "time"
          },
          {
            fieldText: "操作",
            type: "buttons",
            content: [
              {
                fieldText: "删除",
                icon: "el-icon-edit"
              },
              {
                fieldText: "配置",
                icon: "el-icon-s-shop"
              }
            ]
          }
        ],
        tableAttributes: {
          data: []
        }
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    edit(data) {
      this.$refs.detail.openDialog(data);
    },
    add() {
      this.$refs.detail.openDialog();
    },
    deleteApiGroup(row) {
      this.$confirm("<strong>是否删除api组?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          customerApiGroup
            .delApiGroup({
              groupId: row.id,
              status: 99
            })
            .then(res => {
              if (res.code === 0) {
                this.getTableData();
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
              } else {
                this.$message.error(res.msg);
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
    getTableData(obj) {
      if (obj && obj.page) {
        this.currentPage = obj.page;
        this.pageSize = obj.limit;
      }
      if (
        this.currentPage > 1 &&
        this.table.tableAttributes.data.length === 1
      ) {
        this.currentPage = 1;
      }

      customerApiGroup
        .getApiGroup({
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
    buttonsEvent({ scope, btnIndex }) {
      switch (btnIndex) {
        case 0:
          this.deleteApiGroup(scope.row);
          break;
        case 1:
          this.edit(scope.row);
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.apiManage {
  .search-box {
    .title {
      color: #666666;
      font-size: 20px;
      padding-left: 20px;
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
