<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <el-form-item label="产品名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="所属公司" prop="departmentId">
          <el-select v-model="form.departmentId" maxlength="10" placeholder="请输入">
          <el-option
            v-for="item in this.companyNameData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前状态" prop="state">
        <el-select v-model="form.state" maxlength="10" placeholder="请输入">
          <el-option
            v-for="item in this.$selectOptions.cooperateState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input type="textarea" autosize v-model="form.remarkn"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addApp('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import appApi from "@/api/appApi";
import companyApi from "@/api/companyApi";
import {
  validatePhone,
  validateChinese,
  validateEnglish
} from "@/utils/validate";
export default {
  data() {
    return {
      form: {
   
      },
      companyNameData:[],
      dialogVisible: false,
      title: "添加客户",
      formRules: {
        name: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          },
          { validator: validateChinese, trigger: "blur" }
        ],
        departmentId: [
          { required: true, message: "请选择公司", trigger: "blur" },
        ],
        timeZone: [{ required: true, message: "请选择时区", trigger: "blur" }],
        description: [
          { required: true, message: "请输入描述信息", trigger: "blur" },
          { min: 3, max: 100, message: "最多输入3-100个字符", trigger: "blur" }
        ],
        follower: [
          { required: true, message: "请输入联系人", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur"
          },
          { validator: validateChinese, trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
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
      this.dialogVisible = true;
      this.getCompanyNameList();
      if (row) {
        this.title = "编辑应用"; //切换弹窗标题
        this.form = row;
      } else {
        (this.title = "新增应用"),
          this.$nextTick(() => {
            this.$refs["form"].resetFields();
            resetDataAttr(this, "form");
          });
      }
    },
    getCompanyNameList() {
      companyApi.getAllCompany({ }).then(res => {
        this.$nextTick(() => {
          this.companyNameData = res.data;
          console.log(res)
        });
      });
    },
    addApp(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            appApi
              .eidtApp({
                ...this.form
              })
              .then(res => {
                console.log(res);
                if (res.code == 0) {
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
            appApi
              .addApp({
                ...this.form
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
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log(this.form, "hahah");
    }
  },
  created() {
    this.username = this.$store.state.userInfo.username;
  }
};
</script>

<style></style>
