<template>
  <div class="customer">
      <el-card class="search-box" shadow="hover">
      <p class="title"><i class="el-icon-menu"></i>公司管理</p>
    </el-card>
    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add"
          v-has="'addCompanyBtn'"
            >新增公司</el-button
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
            label="公司名称"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            sortable=""
            label="合作开始时间"
            min-width="120"
          ></el-table-column>
          <el-table-column
          :formatter="formattercooperationType"
            prop="cooperationTypes"
            label="合作类型"
            min-width="100"
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
            min-width="120"
          ></el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
                @click="delCompany(scope.row)"
                type="text"
                icon="el-icon-delete-solid"
                size="small"
          v-has="'delCompanyBtn'"
                >删除</el-button
              >
              <el-button
                type="text"
                icon="el-icon-s-tools"
                size="small"
                @click="edit(scope.row)"
          v-has="'editCompanyBtn'"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <Pagination
        v-has="'companyPaginantionBtn'"
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
import companyApi from "@/api/companyApi";
import Pagination from "@/components/Pagination/index";
import _ from "lodash";
import { resetDataAttr } from "@/utils/index.js";
import {formatArr} from '@/assets/js/tableFormatter'
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
      companyApi
        .getCompanyList({
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
          companyApi.delCompany(row.id).then(res => {
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
    jumpsAppItem(row) {
      this.$router.push({ name: "appitem", params: row });
    },
    jumpAppservice(row) {
      this.$router.push({ name: "appservice", params: row });
    },
        formattercooperationType(row) {
      // if (row.cooperationTypes) {
      //   let selectItem=this.$selectOptions.cooperateType;
      //   let newarr = row.cooperationTypes.map(item => {  //newarr接受map的返回值
      //     for (let i = 0; i < selectItem.length; i++) {
      //       if (item == selectItem[i].value) {
      //         return selectItem[i].label;
      //       }
      //     }
      //   });
      //   return newarr.join(",");

      // }
      return formatArr(row,'cooperateType','cooperationTypes')
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
