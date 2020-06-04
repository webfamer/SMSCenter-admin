<template>
  <div class="customer">
       <el-card class="search-box" shadow="hover">
      <p class="title"><i class="el-icon-menu"></i>应用管理</p>
    </el-card>
    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add"
          v-has="'addAppBtn'"
            >新增应用</el-button
          >
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
        >
          <el-table-column type="index" width="80" label="序号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="应用名称"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="departmentName"
            label="所属公司"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="当前状态"
            min-width="100"
            :formatter="formateState"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="说明"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            sortable=""
            label="更新时间"
            min-width="180"
          ></el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
              v-has="'delAppBtn'"
                @click="delApp(scope.row)"
                type="text"
                icon="el-icon-delete-solid"
                size="small"
                >删除</el-button
              >
              <el-button
                type="text"
                icon="el-icon-s-tools"
                size="small"
                v-has="'editAppBtn'"
                @click="edit(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <Pagination
        v-has="'appPaginationBtn'"
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
import appApi from "@/api/appApi";
import Pagination from "@/components/Pagination/index";
import _ from "lodash";
import { resetDataAttr } from "@/utils/index.js";
import {formatform} from '@/assets/js/tableFormatter'
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
    this.getTableData();
  },
  methods: {
    getTableData() {
      if (this.page.start > 1 && this.tableData.length === 1) {
        //如果是最后一条数据，更改请求的当前页
        this.page.start -= 1;
      }
      appApi
        .getAppList({
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
    delApp(row) {
      console.log(row);
      this.$confirm("<strong>是否删除该账户?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          appApi.delApp(row.id).then(res => {
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
      this.getTableData();
      resetDataAttr(this, "search");
    },
    formateState(row){
 return formatform(row, "cooperateState", "state");
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
  .joker-col {
    width: auto;
    margin-bottom: 10px;
  }
}
</style>
