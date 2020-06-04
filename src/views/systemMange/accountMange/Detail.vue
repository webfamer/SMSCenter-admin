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
      <el-form-item label="密码" prop="password" v-if="showPasswordInput">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="身份类型" prop="platform">
        <el-select v-model="form.platform" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions['plantform']"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色id" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择">
          <el-option
            v-for="item in this.roleNameData"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model.number="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="operId">
        <el-input v-model="form.operId"></el-input>
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
import rolesApi from "@/api/rolesApi";
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
        password: "",
        name: "",
        platform: "",
        roleId: ""
      },
      showPasswordInput: true,
      roleNameData: [],
      dialogVisible: false,
      title: "添加角色",
      formRules: {
        loginName: [{ required: true, message: "不能为空", trigger: "blur" }],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],
        name: [{ required: true, message: "不能为空", trigger: "blur" }],
        platform: [{ required: true, message: "不能为空", trigger: "blur" }],
        roleId: [{ required: true, message: "不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "不能为空", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
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
    openDialog(row) {
      console.log(row,'传递的数据')
      this.dialogVisible = true;
      this.getRoleNameList();
      if (row) {
        this.title = "编辑账号"; //切换弹窗标题
        this.showPasswordInput = false;
        this.$nextTick(() => {
          this.form = row;
        });
      } else {
        this.showPasswordInput = true;
        this.title = "新增账号";
         this.$nextTick(() => {
        this.$refs["form"].resetFields();
        resetDataAttr(this, "form");
      });
      }
    },
    getRoleNameList() {
      rolesApi.getRoleNameList({ platform: 2 }).then(res => {
        this.$nextTick(() => {
          this.roleNameData = res.data;
        });
      });
    },
    addAccount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            accountApi
              .eidtAccount({
                ...this.form
              })
              .then(res => {
                console.log(res);
                if (res.code == 0) {
                  this.dialogVisible = false;
                  this.$message({
                    message: res.message,
                    type: "success"
                  });
                  this.$emit("getList");
                } else {
                  // this.$message.error(res.message);
                }
              });
          } else {
            //加密密码
         
            let password = this.$encrypt.encodePwd(this.form.password); // 将password加密
            accountApi
              .addAccount({
                ...this.form,
                password
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
                  // this.$message.error(res.message);
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
  },
  created() {}
};
</script>

<style></style>
