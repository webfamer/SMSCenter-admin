<template>
  <el-dialog
    title="新增角色"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="角色名：">
        <el-input v-model="form.roleName"></el-input>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="角色权限：">
        <el-tree
          :data="rightsList"
          :props="treeProps"
          ref="treeRef"
          show-checkbox
          node-key="key"
          default-expand-all
        ></el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveForm" icon="el-icon-check"
        >提交</el-button
      >
      <el-button @click="resetform" icon="el-icon-refresh-right"
        >重置</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import rolesApi from "@/api/rolesApi";
export default {
  data() {
    return {
      form: {},
      dialogVisible: false,
      treeData: [],
      // 权限树
      rightsList: [],
      treeProps: {
        label: "title",
        children: "children"
      }
    };
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    openDialog(data) {
      this.resetform();
      if (data) {
        this.form = data;
      }
      this.dialogVisible = true;
      if (data) {
        this.getTreeNode(data.id);
      } else {
        this.getTreeNode();
      }
    },
    getTreeNode(id) {
      if (id) {
        rolesApi.getRolesTree({ platform: 2, id: id }).then(res => {
          this.rightsList = res.data.rightTree;
          console.log(res.data.rightIds);
          this.$refs.treeRef.setCheckedKeys(res.data.rightIds);
        });
      } else {
        rolesApi.getRolesTree({ platform: 2 }).then(res => {
          this.rightsList = res.data.rightTree;
        });
      }
    },
    getCheckNode() {
      console.log(this.$refs.treeRef.getCheckedKeys(true, true));
      //获取选中的节点
    },
    resetform() {
      resetDataAttr(this, "form");
      this.$nextTick(() => {
        this.$refs.treeRef.setCheckedKeys([]);
      });
    },

    saveForm() {
      let rightIds = this.$refs.treeRef.getCheckedKeys();
      if (this.form.id) {
        //编辑的调用
        rolesApi
          .eidtRoles({
            ...this.form,
            rightIds,
            platform: 2
          })
          .then(res => {
            if (res.code == 0) {
              this.dialogVisible = false;
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$emit("getList");
            } else {
              this.$message.error(res.msg);
            }
          });
      } else {
        //新增的调用
        rolesApi
          .addRoles({
            ...this.form,
            rightIds,
            platform: 2
          })
          .then(res => {
            if (res.code == 0) {
              this.dialogVisible = false;
              this.$message({
                message: "保存成功",
                type: "success"
              });
              this.$emit("getList");
            } else {
              this.$message.error(res.message);
            }
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
/deep/#testTree {
  .el-checkbox .el-checkbox__inner {
    display: none;
  }
  div[role="group"] {
    .el-checkbox .el-checkbox__inner {
      display: inline-block;
    }
  }
}
</style>
