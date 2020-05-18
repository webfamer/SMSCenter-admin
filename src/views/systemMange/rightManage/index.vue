<template>
  <div class="apiManage">
    <el-card class="search-box" shadow="hover">
      <p class="title"><i class="el-icon-menu"></i>权限管理</p>
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
          style="width: 100%,margin-top:20px"
          border
          row-key="id"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            prop="component"
            label="前端页面"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="id"
            label="用户类型"
            width="180"
          ></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column prop="platform" label="权限类型"></el-table-column>
          <el-table-column
            prop="requireAuth"
            label="是否需要授权"
          ></el-table-column>
          <el-table-column prop="rightLevel" label="权限级别"></el-table-column>
          <el-table-column prop="rightName" label="菜单名称"></el-table-column>
          <el-table-column prop="rightOrder" label="排序"></el-table-column>
          <el-table-column prop="rightPath" label="前端路径"></el-table-column>
          <el-table-column prop="rightPic" label="图标"></el-table-column>
          <el-table-column prop="rightType" label="类型"></el-table-column>
          <el-table-column prop="rightUrl" label="请求路径"></el-table-column>
          <el-table-column
            prop="rightVisible"
            label="权限是否可见"
          ></el-table-column>
          <el-table-column prop="superId" label="superId"></el-table-column>
          <el-table-column
            prop="uniqueSign"
            label="系统唯一标志"
          ></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column label="操作" width="150">
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
      </el-card>
    </div>
    <Detail ref="detail" @getList="getTableData"></Detail>
  </div>
</template>
<script>
import Detail from "./Detail";
import rightApi from "@/api/rightApi";
import { resetDataAttr } from "@/utils/index.js";
export default {
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
      console.log(data);
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
          rightApi
            .delright({
              groupId: row.id,
              status: 99
            })
            .then(res => {
              if (res.code === 0) {
                this.getCustomerGroup();
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
    getTableData() {
      rightApi.getrightTree({ platform: 2 }).then(res => {
        this.tableData = [res.data];
      });
    }
  },
  created() {
    this.getTableData();
  },
  components: {
    Detail
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
