<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="form.loginName"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="运营角色" prop="platform">
        <el-input v-model="form.platform"></el-input>
      </el-form-item>
      <el-form-item label="角色id" prop="roleId">
        <el-input v-model="form.roleId"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="operId">
        <el-input v-model="form.operId"></el-input>
      </el-form-item>
      <el-form-item label="手机号码">
        <el-input v-model.number="form.phone"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addAccount('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import accountApi from "@/api/accountApi";
import { resetDataAttr } from "@/utils/index.js";
import {
  validatePhone,
  validateChinese,
  validateEnglish
} from "@/utils/validate";
export default {
  data() {
    return {
      form: {
        loginName: "",
        name: "",
        description: "",
        operId: "",
        phone: ""
      },
      dialogVisible: false,
      title: "添加客户",
      formRules: {
        loginName: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "不能为空", trigger: "blur" },
        ],
        platform: [{ required: true, message: "不能为空", trigger: "blur" }],
        roleId: [
          { required: true, message: "不能为空", trigger: "blur" },
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
    openDialog(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        resetDataAttr(this, "form");
      });
      if (id) {
        this.title = "编辑客户"; //切换弹窗标题
        accountApi
          .getCustomerDetail({
            merchantId: id
          })
          .then(res => {
            if (res.code === 0) {
              this.form = res.data;
            }
          });
      }
    },
    addAccount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            accountApi
              .eidtCustomer({
                merchantId: this.form.id,
                ...this.form
              })
              .then(res => {
                console.log(res);
                if (res.code === 0) {
                  this.dialogVisible = false;
                  this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  this.$emit("getList");
                } else {
                  this.$message.error(res.msg);
                }
              });
          } else {
            accountApi
              .addAccount({
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
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log(this.form, "hahah");
    }
  }
};
</script>

<style></style>
