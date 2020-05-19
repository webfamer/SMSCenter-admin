<template>
  <div class="apiManage">
    <el-card class="search-box" shadow="hover">
      <p class="title"><i class="el-icon-menu"></i>角色管理</p>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <el-button type="primary" icon="el-icon-plus" @click="add"
            >添加</el-button
          >
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column
            prop="roleName"
            label="角色名"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="createAdminId"
            label="创建者id"
            min-width="120"
          ></el-table-column>

          <el-table-column
            prop="platform"
            label="身份类型"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="updateAdminId"
            label="更新者id"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="120"
          ></el-table-column>
          <el-table-column
            prop="updateTime"
            label="修改时间"
            min-width="120"
          ></el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button
                @click="deleteApiGroup(scope.row)"
                type="text"
                icon="el-icon-delete-solid"
                size="small"
                >删除</el-button
              >
              <el-button
                type="text"
                icon="el-icon-s-tools"
                size="small"
                @click="edit(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div
          class="block"
          style="float:right; margin-top:30px;margin-bottom:30px;"
        >
          <Pagination
            :page="page"
            @sizeChange="handleSizeChange"
            @currentChange="handleCurrentChange"
          ></Pagination>
        </div>
      </el-card>
    </div>
    <Detail ref="detail" @getList="getCustomerList"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
import rolesApi from "@/api/rolesApi";
import PageMixins from "@/mixins/pageMixins";
import Pagination from "@/components/Pagination/index";
import { resetDataAttr } from "@/utils/index.js";
export default {
  mixins: [PageMixins],
  data() {
    return {
      input: "",
      value1: "",
      tableData: [],
      value: ""
    };
  },
  methods: {
    edit(data) {
      this.$refs.detail.openDialog(data);
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
    getTableData() {
      rolesApi
        .getRolesList({
          platform: 2,
          page: {
            current: this.page.start,
            size: this.page.limit
          }
        })
        .then(res => {
          this.tableData = res.data;
          this.page.total = res.data.total;
          this.page.start = res.data.current;
        });
    },
    deleteApi(row) {
      console.log(row);
      this.$confirm("<strong>是否删除api?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          rolesApi
            .delRoles({
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
    }
  },
  created() {
    this.getTableData();
  },
  components: {
    Detail,
    Pagination
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
