<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="formRules" :model="form" label-width="160px">
      <el-form-item label="对接ID" prop="apiChiName">
        <el-input v-model="form.apiChiName" maxlength="40"></el-input>
      </el-form-item>
      <el-form-item label="输出产品名称：">
        <el-select v-model="value1" multiple placeholder="请选择" @change="selectChange">
          <el-option style="height: auto" :value="treeData">
            <el-tree
              :data="treeData"
              id="testTree"
              show-checkbox
              ref="tree"
              @check-change="handleCheckChange"
              node-key="id"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
            <el-form-item label="所属公司名称：">
        <el-select v-model="value1" multiple placeholder="请选择" @change="selectChange">
          <el-option style="height: auto" :value="treeData">
            <el-tree
              :data="treeData"
              id="testTree"
              show-checkbox
              ref="tree"
              @check-change="handleCheckChange"
              node-key="id"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
            <el-form-item label="接入短信机构名称：">
        <el-select v-model="value1" multiple placeholder="请选择" @change="selectChange">
          <el-option style="height: auto" :value="treeData">
            <el-tree
              :data="treeData"
              id="testTree"
              show-checkbox
              ref="tree"
              @check-change="handleCheckChange"
              node-key="id"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
       <el-form-item label="单价:元/条" prop="apiChiName">
        <el-input v-model="form.apiChiName" maxlength="40"></el-input>
      </el-form-item>
            <el-form-item label="合作状态：">
        <el-select v-model="value1" multiple placeholder="请选择" @change="selectChange">
          <el-option style="height: auto" :value="treeData">
            <el-tree
              :data="treeData"
              id="testTree"
              show-checkbox
              ref="tree"
              @check-change="handleCheckChange"
              node-key="id"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
            <el-form-item label="优先级切换设置：">
        <el-select v-model="value1" multiple placeholder="请选择" @change="selectChange">
          <el-option style="height: auto" :value="treeData">
            <el-tree
              :data="treeData"
              id="testTree"
              show-checkbox
              ref="tree"
              @check-change="handleCheckChange"
              node-key="id"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述：" prop="remark">
        <el-input type="textarea" v-model="form.remark" maxlength="100"></el-input>
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
import customerApiList from "@/api/customerApi";
import {
  validateChinese,
  validateEnglish,
  validateApi
} from "@/utils/validate";
export default {
  data() {
    return {
      form: {},
      dialogVisible: false,
      treeData: [],
      title:"新增API服务",
      value1: [],
      formRules: {
        apiChiName: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          },
          { validator: validateChinese, trigger: "blur" }
        ],
        apiEngName: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur"
          },
          { validator: validateEnglish, trigger: "blur" }
        ],
        apiPath: [
          { required: true, message: "请输入正确格式路径", trigger: "blur" },
          { validator: validateApi, trigger: "blur" }
        ],
        remark: [
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
    openDialog(data) {
      this.dialogVisible = true;
       if(this.$refs['form']){  //不论是新增或编辑，打开弹窗时都要重置校验错误提示
        this.$refs["form"].resetFields();
        }
      if (data) {
        this.form = JSON.parse(JSON.stringify(data));
        this.title="修改API服务" //切换弹窗标题
        this.setTreeNode([data.groupId]);
      } else {
        resetDataAttr(this, "form");
        this.setTreeNode();
      }
      console.log(this.form, "this.form");
    },
    getTreeNode() {
      console.log(123);
      customerApiList.getSetApiTree().then(res => {
        this.treeData = res.data;
      });
    },
    async setTreeNode(arrKey) {
      await this.getTreeNode();
      if (arrKey) {
        this.$refs.tree.setCheckedKeys(arrKey);
        setTimeout(()=>{
          this.handleCheckChange()
        },200)
      } else {
        this.$refs.tree.setCheckedKeys([]);
        this.value1 = [];
      }
    },
    handleCheckChange(data,checked,node) {
      console.log(checked,data)
      let treeNode = this.$refs.tree.getCheckedNodes(true, true);
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
      }
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
      console.log(newarr, "saveNode");
      this.$refs.tree.setCheckedNodes(newarr);
    },
        resetForm() {
      resetDataAttr(this, "form");
      this.$nextTick(()=>{
      this.value1 = [];
      })
      this.$refs.tree.setCheckedKeys([], true);
      // this.dialogVisible = false;
    },
    saveForm(formName) {
      console.log(111);
      let groupId = this.$refs.tree.getCheckedKeys()[0];
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            //编辑的调用
            customerApiList
              .editApi({
                ...this.form,
                groupId: groupId
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
            //新增的调用
            customerApiList
              .addApi({
                ...this.form,
                groupId: groupId
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
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
// /deep/#testTree {
//   .el-checkbox .el-checkbox__inner {
//     display: none;
//   }
//   div[role="group"] {
//     .el-checkbox .el-checkbox__inner {
//       display: inline-block;
//     }
//   }
// }
</style>>

</style>