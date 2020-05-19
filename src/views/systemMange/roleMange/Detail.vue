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
        <el-row>
          <span
            style="margin-right:4px"
            v-for="item in tagValue"
            :key="item.id"
          >
            <el-tag size="mini">{{ item.title }}</el-tag>
          </span>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
      append-to-body
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
        show-checkbox
        node-key="key"
        default-expand-all
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCheckNode">确 定</el-button>
      </span>
    </el-dialog>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveForm" icon="el-icon-check"
        >提交</el-button
      >
      <el-button type="primary" @click="openTreeDialog" icon="el-icon-check"
        >配置权限框</el-button
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
      tagValue: [],
      // 分配权限框
      setRightDialogVisible: false,
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
      this.getTreeNode();
      console.log(this.form, "this.form");
    },
    openTreeDialog() {
      this.setRightDialogVisible = true;
      this.$nextTick(() => {
        if (this.tagValue.length == 0) {
          this.$refs.treeRef.setCheckedNodes([]);
        }
      });
    },
    getTreeNode() {
      console.log(123);
      rolesApi.getRolesTree({ platform: 2 }).then(res => {
        this.rightsList = res.data.rightTree;
      });
    },
    setRightDialogClosed() {
      this.setRightDialogVisible = false;
    },
    getCheckNode() {
      //获取选中的节点
      this.setRightDialogVisible = false;
      this.tagValue = this.$refs.treeRef.getCheckedNodes(true, true);
    },
    // 添加角色对话框的关闭
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    resetform() {
      this.tagValue = [];
      resetDataAttr(this, "form");
    },

    saveForm() {
      if (this.form.id) {
        //编辑的调用
        rolesApi
          .editApi({
            ...this.form
          })
          .then(res => {
            if (res.code === 0) {
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
        console.log(this.tagValue)
        let rightIds = this.tagValue.map(item => {
          return item.key;
        });
        //新增的调用
        rolesApi
          .addRoles({
            ...this.form,
            rightIds,
            platform:2
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
