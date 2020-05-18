<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="formRules" :model="form" label-width="150px">
      <el-form-item label="机构ID：" prop="groupChiName">
        <el-input v-model="form.groupChiName"></el-input>
      </el-form-item>
      <el-form-item label="机构名称：" prop="groupEngName">
        <el-input v-model="form.groupEngName"></el-input>
      </el-form-item>
      <el-form-item label="单价：元/条：" prop="groupEngName">
        <el-input v-model="form.groupEngName"></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="value1" multiple placeholder="请选择" @change="selectChange">
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
         <el-form-item label="默认优先级：">
        <el-select v-model="value1" multiple placeholder="请选择" @change="selectChange">
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
      <el-form-item label="备注：" prop="description">
        <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.description" maxlength="100"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveForm('form')" icon="el-icon-check">提交</el-button>
      <el-button @click="resetForm" icon="el-icon-refresh-right">重置</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import customerApiGroup from "@/api/customerGroupApi";
import customerApiList from "@/api/customerApi";
import { validateChinese, validateEnglish } from "@/utils/validate";
export default {
  data() {
    return {
      form: {},
      treeData: [],
      value1: [],
      dialogVisible: false,
      title: "新增API组服务",
      num: 0,
      formRules: {
        groupChiName: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          },
          { validator: validateChinese, trigger: "blur" }
        ],
        groupEngName: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur"
          },
          { validator: validateEnglish, trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
          { min: 3, max: 100, message: "最多输入3-100个字符", trigger: "blur" }
        ]
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
    handleCheckChange(data, checked, node) {
      //只能选择单个节点
      let treeNode = this.$refs.tree.getCheckedNodes(true, true);

      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
      }
      //选择框与树组件关联
      let arrNode = [];
      let arrlabel = [];
      treeNode.forEach(item => {
        arrlabel.push(item.label);
        arrNode.push(item);
      });
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
      this.$refs.tree.setCheckedNodes(newarr);
    },
    resetForm() {
      resetDataAttr(this, "form");
      this.$nextTick(() => {
        this.value1 = [];
      });
      this.$refs.tree.setCheckedKeys([], true);
      // this.dialogVisible = false;
    },
    saveForm(formName) {
      let groupKey = this.$refs.tree.getCheckedKeys();

      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
         customerApiGroup
              .eidtApiGroup({
                ...this.form,
                groupId:this.form.id,
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
                  this.$message.error(res.msg);
                }
              });

          } else {
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
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getTreeNode() {
      customerApiList.getSetApiTree().then(res => {
        this.treeData = res.data;
      });
    },
    openDialog(data) {
      this.dialogVisible = true;
      if (this.$refs["form"]) {
        //不论是新增或编辑，打开弹窗时都要重置校验错误提示
        this.$refs["form"].resetFields();
      }
      if (data) {
        this.form = JSON.parse(JSON.stringify(data));
        this.title = "修改API组服务"; //切换弹窗标题
        this.setTreeNode([data.parentGroupId]);
      } else {
        resetDataAttr(this, "form");
        this.setTreeNode();
      }
      this.getTreeNode();
    },
    async setTreeNode(arrKey) {
      await this.getTreeNode();
      if (arrKey) {
        this.$refs.tree.setCheckedKeys(arrKey);
        setTimeout(() => {
          this.handleCheckChange();
        }, 200);
      } else {
        this.$refs.tree.setCheckedKeys([]);
        this.value1 = [];
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
