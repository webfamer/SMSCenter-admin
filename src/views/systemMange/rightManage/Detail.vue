<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <!-- <el-form-item label="身份类型" prop="platform">
        <el-select v-model="form.platform" size="small" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions['plantform']"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否需要授权" prop="requireAuth">
        <el-select v-model="form.requireAuth" size="small" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions['requireAuth']"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限级别" prop="rightLevel">
        <el-select v-model="form.rightLevel" size="small" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions['rightLevel']"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限中文名" prop="ZhName">
        <el-input v-model="form.ZhName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="权限英文名" prop="EnName">
        <el-input v-model="form.EnName" size="small"></el-input>
      </el-form-item>
      <el-form-item label="顺序" prop="rightOrder">
        <el-input v-model="form.rightOrder" size="small"></el-input>
      </el-form-item>
      <el-form-item label="权限类型">
        <el-select v-model="form.rightType" size="small" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions['rightType']"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限URL">
        <el-input v-model.number="form.rightUrl" size="small"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          autosize
          v-model="form.remark"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限路径" prop="rightPath">
        <el-input v-model="form.rightPath" size="small"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="rightPic">
        <el-input v-model="form.rightPic" size="small"></el-input>
      </el-form-item>
      <el-form-item label="前端页面" prop="component">
        <el-input v-model="form.component" size="small"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addright('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import rightApi from "@/api/rightApi";
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
        requireAuth: "",
        rightLevel: "",
        ZhName: "123",
        EnName: "",
        rightOrder: "",
        rightType: "",
        rightUrl: "",
        remark: "",
        rightPath: "",
        superId:''
      },
      dialogVisible: false,
      title: "添加客户",
      formRules: {
        platform: [{ required: true, message: "不能为空", trigger: "blur" }],
        requireAuth: [{ required: true, message: "不能为空", trigger: "blur" }],
        rightLevel: [{ required: true, message: "不能为空", trigger: "blur" }],
        ZhName: [{ required: true, message: "不能为空", trigger: "blur" }],
        EnName: [{ required: true, message: "不能为空", trigger: "blur" }],
        rightOrder: [{ required: true, message: "不能为空", trigger: "blur" }],
        rightType: [{ required: true, message: "不能为空", trigger: "blur" }],
        rightUrl: [{ required: true, message: "不能为空", trigger: "blur" }]
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
      console.log(id);
      if (id) {
        this.title = "编辑客户"; //切换弹窗标题
        rightApi
          .getrightDetail({
            id: id
          })
          .then(res => {
            if (res.code == 0) {
              this.form = res.data;
              if (res.data.rightName) {
                let newName = JSON.parse(res.data.rightName);
                this.$set(this.form, "ZhName", newName["zh-CN"]);
                this.$set(this.form, "EnName", newName["en-us"]);
              }
            }
          });
      }
    },
    addright(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id) {
            let params = this.form;
            delete params.ZhName;
            delete params.EnName;
            delete params.createTime;
            delete params.updateTime;
            console.log(params,'是否有superId');
            rightApi
              .eidtright({
                ...params
              })
              .then(res => {
                if (res.code == 0) {
                  this.dialogVisible = false;
                  this.$message({
                    message: res.message,
                    type: "success"
                  });
                  this.$emit("getList");
                } else {
                  this.$message.error(res.message);
                }
              });
          } 
          else {
            let addStatus = window.localStorage.getItem("addStatus");
            let params = { ...this.form };
            delete params.ZhName;
            delete params.EnName;
            rightApi
              .addright({
                ...params,
                rightName: JSON.stringify({
                  "en-us": this.form.EnName,
                  "zh-CN": this.form.ZhName
                }),
                platform: 2,
                superId: window.localStorage.getItem("myselfId")
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
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
