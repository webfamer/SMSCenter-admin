<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <el-form-item label="客户中文名称" prop="merchantChiName">
        <el-input v-model="form.merchantChiName"></el-input>
      </el-form-item>
      <el-form-item label="客户英文名称" prop="merchantEngName">
        <el-input v-model="form.merchantEngName"></el-input>
      </el-form-item>
      <el-form-item label="时区" prop="timeZone">
        <el-select v-model="form.timeZone" maxlength="10" placeholder="时区">
          <el-option
            v-for="item in [{value: '23', label: 'label23'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户描述" prop="description">
        <el-input type="textarea" autosize v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="首联系人" prop="follower">
        <el-input v-model="form.follower"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model.number="form.phoneNumber"></el-input>
      </el-form-item>
      <!-- <el-form-item label="营业执照">
    <el-upload
  class="upload-demo"
  action="https://jsonplaceholder.typicode.com/posts/"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :before-remove="beforeRemove"
  multiple
  :limit="3"
  :on-exceed="handleExceed"
  :file-list="fileList">
  <el-button plain class="el-icon-box">选择附件</el-button>
  <div slot="tip" class="el-upload__tip">支持格式：.JGP .PNG 单个文件不能超过20MB</div>
</el-upload>
      </el-form-item>-->
      <!-- <el-form-item label="负责人员">
        <el-input v-model="form.username" suffix-icon="el-icon-user-solid"></el-input>
      </el-form-item>-->
      <!-- <el-form-item label="接收邮件通知">
     <el-checkbox v-model="checked">邮件通知</el-checkbox>
      <el-input v-model="form.name" placeholder="请输入邮箱，多个邮箱请用；隔开，最多5个"></el-input>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCustomerList('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import CustomerApi from "@/api/customer.js";
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
        merchantChiName: '',
        merchantEngName: '',
        timeZone: '',
        description: '',
        follower: '',
        phoneNumber: '',
      },
      dialogVisible: false,
      title: "添加客户",
      formRules: {
        merchantChiName: [
          { required: true, message: "请输入中文名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          },
          { validator: validateChinese, trigger: "blur" }
        ],
        merchantEngName: [
          { required: true, message: "请输入英文名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur"
          },
          { validator: validateEnglish, trigger: "blur" }
        ],
        timeZone: [
          { required: true, message: "请选择时区", trigger: "blur" },
        ],
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
    openDialog(id) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
        resetDataAttr(this, "form");
      });
      if (id) {
        this.title = "编辑客户"; //切换弹窗标题
        CustomerApi.getCustomerDetail({
          merchantId: id
        }).then(res => {
          if (res.code === 0) {
            this.form = res.data;
          }
        });
      }
    },
    addCustomerList(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            CustomerApi.eidtCustomer({
              merchantId: this.form.id,
              ...this.form
            }).then(res => {
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
            CustomerApi.addCustomer({
              ...this.form
            }).then(res => {
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
  },
  created() {
    this.username = this.$store.state.userInfo.username;
  }
};
</script>

<style></style>
