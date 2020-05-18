<template>
  <el-dialog
    title="新增API服务"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="分组中文名称：">
        <el-input v-model="form.groupChiName"></el-input>
      </el-form-item>
      <el-form-item label="分组英文名称：">
        <el-input v-model="form.groupEngName"></el-input>
      </el-form-item>
      <el-form-item label="上级分组：">
        <el-select
          v-model="value1"
          multiple
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option style="height: auto" :value="treeData">
            <el-tree
            id="testTree"
              :data="treeData"
              show-checkbox
              ref="tree"
              @check-change="handleCheckChange"
              node-key="id"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述：">
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="form.description"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="saveForm"
        icon="el-icon-check"
        >提交</el-button
      >
      <el-button @click="dialogVisible = false" icon="el-icon-refresh-right"
        >重置</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import customerApiGroup from "@/api/customerGroupApi";
import customerApiList from "@/api/customerApi";
export default {
  data() {
    return {
      form: {},
      treeData: [],
      value1: [],
      dialogVisible: false,
      num: 0
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
    handleCheckChange(data) {
      let treeNode = this.$refs.tree.getCheckedNodes(true, true);
      console.log(data, "haa");

if(treeNode.length>1){
    this.$refs.tree.setCheckedKeys([data.id])
}

      let arrNode = [];
      let arrlabel = [];
      treeNode.forEach(item => {
        arrlabel.push(item.label);
        arrNode.push(item);
      });
      console.log(treeNode);
      this.value1 = arrlabel;
      this.saveNode = arrNode;
    },
    selectChange(e) {
      let newarr = [];
      for (var i = 0; i < this.saveNode.length; i++) {
        for (var j = 0; j < e.length; j++) {
          if (e[j] === this.saveNode[i].label) {
            newarr.push(this.saveNode[i]);
          }
        }
      }
      console.log(newarr, "saveNode");
      this.$refs.tree.setCheckedNodes(newarr);
    },
    saveForm() {
      let groupKey = this.$refs.tree.getCheckedKeys();
      customerApiGroup
        .addApiGroup({
            ...this.form,
            parentGroupId: groupKey[0]
      
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
            this.$message.error("保存失败");
          }
        });
    },
    getTreeNode() {
      console.log(123);
      customerApiList.getSetApiTree().then(res => {
        this.treeData = res.data;
      });
    },
    openDialog(data) {
      resetDataAttr(this, "form");
      if (data) {
        this.form = data;
        let newarr = [];
        newarr.push(data.parentGroupId)
        this.$nextTick(res=>{
          this.$refs.tree.setCheckedKeys(newarr)

        })
      }
      this.getTreeNode();
      this.dialogVisible = true;
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
