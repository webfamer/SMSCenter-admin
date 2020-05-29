<template>
  <div class="customer">
    <el-card class="search-box" shadow="hover">
      <p class="title"><i class="el-icon-menu"></i>合作详情管理</p>
    </el-card>
    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="add"
            v-has="'cooperateAddBtn'"
            >新增合作</el-button
          >
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          :default-sort="{ prop: 'createTime', order: 'ascending' }"
        >
          <el-table-column
            prop="id"
            label="合作ID"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="applicationName"
            label="产品名称"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="channelName"
            label="公司名称"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="departmentName"
            label="短信机构"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="price"
            label="单价/条"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            :formatter="formatterState"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="priorityType"
            label="优先级设置"
            min-width="100"
            :formatter="formatterPriority"
          ></el-table-column>
          <el-table-column
            prop="lastModifyTime"
            sortable=""
            label="最后操作时间"
            min-width="160"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="说明"
            min-width="120"
          ></el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
                v-has="'cooperateDelBtn'"
                @click="delCompany(scope.row)"
                type="text"
                icon="el-icon-delete-solid"
                size="small"
                >删除</el-button
              >
              <el-button
                v-has="'cooperateEditBtn'"
                type="text"
                icon="el-icon-s-tools"
                size="small"
                @click="edit(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          v-has="'coopratePageNationBtn'"
          :page="page"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
        ></Pagination>
      </el-card>
    </div>
    <Detail
      ref="detail"
      @getList="getTableData"
      :organiName="organiName"
    ></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
import PageMixins from "@/mixins/pageMixins";
import cooperateApi from "@/api/cooperateApi";
import organiApi from "@/api/organiApi";
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
      organiName: [],
      search: {
        date: []
      }
    };
  },
  created() {
    this.getOrganiName();
    this.getTableData();
  },
  methods: {
    getTableData() {
      if (this.page.start > 1 && this.tableData.length === 1) {
        //如果是最后一条数据，更改请求的当前页
        this.page.start -= 1;
      }
      cooperateApi
        .getCooperationData({
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
    delCompany(row) {
      console.log(row);
      this.$confirm("<strong>是否删除该账户?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          cooperateApi.delCooperation(row.id).then(res => {
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
      this.$refs.detail.openDialog(row.id);
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
    getOrganiName() {
      organiApi.getorganiAll().then(res => {
        this.$nextTick(() => {
          this.organiName = res.data;
        });
      });
    },
    formatterPriority(row) {
      let newItem = "";
      this.$selectOptions.priorityType.forEach(item => {
        if (item.value == row.priorityType) {
          newItem = item.label;
        }
      });
      return newItem;
    },
    formatterState(row) {
      let newItem = "";
      this.$selectOptions.cooperateState.forEach(item => {
        if (item.value == row.state) {
          newItem = item.label;
        }
      });
      return newItem;
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
