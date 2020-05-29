<template>
  <div class="apiManage">
    <el-card class="search-box" shadow="hover">
      <p class="title"><i class="el-icon-menu"></i>权限管理</p>
    </el-card>

    <div class="content-box">
      <el-card shadow="never">
        <el-table
          :data="tableData"
          style="width: 100%,margin-top:20px"
          border
          row-key="id"
          :default-sort="{ prop: 'date', order: 'descending' }"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            :expand-row-keys="expands"
        >
          <el-table-column
            prop="rightName"
            label="菜单名称"
            min-width="140"
          ></el-table-column>
          <el-table-column
            prop="component"
            label="前端页面"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="platform"
            min-width="100"
            label="权限类型"
            :formatter=" formatType"
          ></el-table-column>
          <el-table-column
            prop="requireAuth"
            label="是否需要授权"
            min-width="100"
            :formatter="formatAuth"
          ></el-table-column>
          <el-table-column
            prop="rightLevel"
            min-width="100"
            label="权限级别"
            :formatter="formatLevel"
          ></el-table-column>
          <el-table-column
            prop="rightOrder"
            min-width="100"
            label="排序"
          ></el-table-column>
          <el-table-column
            prop="rightPath"
            min-width="100"
            label="前端路径"
          ></el-table-column>
          <!-- <el-table-column prop="rightPic" label="图标"></el-table-column> -->
          <el-table-column
            prop="rightType"
            min-width="100"
            label="类型"
            :formatter="formatType"
          ></el-table-column>
          <el-table-column
            prop="rightUrl"
            min-width="100"
            label="请求路径"
          ></el-table-column>
          <el-table-column
            prop="rightVisible"
            label="权限是否可见"
            min-width="100"
            :formatter="formatrightVisible"
          ></el-table-column>
          <el-table-column
            prop="uniqueSign"
            label="系统唯一标志"
            min-width="100"
          ></el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-row v-if="scope.row.superId != 0">
                <el-button
                v-has="'delRightBtn'"
                  @click="deleteApiGroup(scope.row)"
                  type="text"
                  icon="el-icon-delete-solid"
                  size="small"
                  >删除</el-button
                >
                <el-button
                v-has="'editRightBtn'"
                  type="text"
                  icon="el-icon-s-tools"
                  size="small"
                  @click="edit(scope.row)"
                  >编辑</el-button
                >
                <el-popover placement="bottom" trigger="click"  
                v-has="'addRightBtn'"
                >
                  <el-row>
                    <el-button
                      type="primary"
                      size="mini"
                      round
                      @click="SetParentId(scope.row)"
                      >增加平级</el-button
                    >

                    <el-button
                      type="primary"
                      size="mini"
                      round
                      @click="SetMyselfId(scope.row)"
                      >增加子级</el-button
                    >
                  </el-row>
                  <el-button slot="reference" type="text" icon="el-icon-plus"
                    >新增</el-button
                  >
                </el-popover>
              </el-row>
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
      tableData: [],
      expands:['1']
    };
  },
  methods: {
    edit(data) {
      this.$refs.detail.openDialog(data.id);
    },
    add() {
      this.$refs.detail.openDialog();
    },
    SetMyselfId(row) {
      let myselfId = row.id;
      window.localStorage.setItem("myselfId", myselfId),
        window.localStorage.setItem("addStatus", 0);
      this.add();
    },
    SetParentId(row) {
      let ParentId = row.superId;
      window.localStorage.setItem("myselfId", ParentId),
        window.localStorage.setItem("addStatus", 1);
      this.add();
    },
    deleteApiGroup(row) {
      this.$confirm("<strong>是否删除权限?</strong>", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning"
      })
        .then(() => {
          rightApi
            .delright({
              id: row.id
            })
            .then(res => {
              if (res.code == 0) {
                this.getTableData();
                this.$message({
                  message: "删除成功",
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
            message: "已取消停用"
          });
        });
    },
    getTableData() {
      rightApi.getrightTree({ platform: 2 }).then(res => {
        this.tableData = [res.data];
      });
    },
    // 格式化表格数据
    formatLevel(row) {
      return this.processData(row, "rightLevel");
    },
    formatType(row) {
      return this.processData(row, "rightType");
    },
    formatAuth(row) {
      return this.processData(row, "requireAuth");
    },
    formatrightVisible(row){
      return this.processData(row, "rightVisible");
    },
    processData(row, itemName) {
       let newItem = "";
      this.$selectOptions[itemName].forEach(item => {
        if (item.value === row[itemName]) {
          newItem = item.label;
        }
      });
      return newItem;
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
