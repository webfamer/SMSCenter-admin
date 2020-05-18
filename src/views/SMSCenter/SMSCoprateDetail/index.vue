<template>
  <div class="apiManage">
    <el-card class="search-box" shadow="hover">
      <p class="title">
        <i class="el-icon-menu"></i>短信合作详情
      </p>
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
import customerApiList from "@/api/customerApi";

import { resetDataAttr, getPagination } from "@/utils/index.js";
export default {
  components: {
    Detail,
  },
  data() {
    return {
      // 表格数据
      ...getPagination(),
      table: {
        body: [
          { fieldName: "apiChiName", fieldText: "合作ID" },
          { fieldName: "status", fieldText: "输出产品名称" },
          { fieldName: "apiPath", fieldText: "所属公司名称" },
          { fieldName: "remark", fieldText: "接入短信机构名称" },
          { fieldName: "remark", fieldText: "单价/条" },
          { fieldName: "remark", fieldText: "状态" },
          { fieldName: "remark", fieldText: "优先级切换设置" },
          { fieldName: "remark", fieldText: "备注" },
          {
            fieldName: "gmtModified",
            fieldText: "修改时间",
            sortable: true,
            type: "time"
          },
          {
            fieldText: "操作",
            type: "buttons",
            content: [
              {
                fieldText: "下架",
                icon: "el-icon-edit"
              },
              {
                fieldText: "配置",
                icon: "el-icon-s-cooperation"
              }
            ],
            tableColumnAttributes: {}
          }
        ],
        tableAttributes: {
          data: []
        },
      },
      //
      input: "",
      value1: "",
      tableData: [],
      value: ""
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
    formatter({ gmtModified }) {
      return gmtModified.replace(/T/g, "   ");
    },
    formatterStatus(row) {
      if (row.status === 1) {
        return "上架中";
      } else {
        return "已下架";
      }
    },
    getTableData(obj) {
      if (obj && obj.page) {
        this.currentPage = obj.page;
        this.pageSize = obj.limit;
      }
      if (this.currentPage > 1 && this.table.tableAttributes.data.length === 1) {
        // 如果是最后一条数据，更改请求的当前页
        this.currentPage = 1;
      }

      customerApiList
        .getApi({
          api: {},
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
    deleteApi(row) {
      this.$confirm("<strong>是否删除api?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          customerApiList
            .delApi({
              apiId: row.id,
              status: 99
            })
            .then(res => {
              if (res.code === 0) {
                this.dialogVisible = false;
                this.getTableData();
                this.$message({
                  message: res.msg,
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
    buttonsEvent({ scope, btnIndex }) {
      switch (btnIndex) {
        case 0:
          this.deleteApi(scope.row);
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
