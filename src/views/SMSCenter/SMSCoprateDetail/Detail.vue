<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <el-form ref="form" :rules="formRules" :model="form" label-width="120px">
      <el-form-item label="应用名称" prop="applicationId">
        <el-select
          v-model="form.applicationId"
          maxlength="10"
          placeholder="请选择"
        >
          <el-option
            v-for="item in appName"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="短信机构" prop="channelId">
        <el-select v-model="form.channelId" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in organiName"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单价：元/条" prop="price">
        <el-input v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="合作状态">
        <el-select v-model="form.state" maxlength="10" placeholder="请选择">
          <el-option
            v-for="item in this.$selectOptions.cooperateState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="切换设置" prop="priorityType">
        <el-select
          v-model="form.priorityType"
          maxlength="10"
          placeholder="请选择"
        >
          <el-option
            v-for="item in this.$selectOptions.priorityType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <div
        v-for="(item, index) in dynamicItem"
        :key="index"
        v-show="form.priorityType==2"
      >
        <el-form-item
          :label="'优先级' + (index + 1)"
          size="mini"
          prop="priority"
        >
          <el-select
            v-model="item.priority"
            maxlength="10"
            placeholder="请选择"
          >
            <el-option
              v-for="dataItem in organiName"
              :key="dataItem.id"
              :label="dataItem.name"
              :value="dataItem.id"
            ></el-option>
          </el-select>
          <i
            class="el-icon-plus"
            @click="addItem(item, index)"
            style="cursor:pointer;"
          ></i>
          <i
            class="el-icon-delete"
            @click="deleteItem(item, index)"
            style="cursor:pointer"
          ></i>
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" autosize v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCompany('form')">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetDataAttr } from "@/utils/index.js";
import cooperateApi from "@/api/cooperateApi";
import appApi from "@/api/appApi";

import {
  validatePhone,
  validateChinese,
  validateEnglish
} from "@/utils/validate";
export default {
  props: {
    organiName: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        applicationId: ""
      },
      appName: [],
      dynamicItem: [{ priority: "" }],
      dialogVisible: false,
      title: "添加客户",
      formRules: {
        applicationId: [
          { required: true, message: "请选择产品", trigger: "blur" }
        ],
        channelId: [
          { required: true, message: "请输选择机构", trigger: "blur" }
        ],
        cooperationType: [
          { required: true, message: "请选择时区", trigger: "blur" }
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
    openDialog(id) {
      this.getAppName();
      this.dialogVisible = true;
      if (id) {
        this.title = "编辑合作"; //切换弹窗标题
        cooperateApi.getCooperationDetail(id).then(res => {
          this.$nextTick(() => {
            this.form = res.data;
            if (this.form.priorityType == 2) {
              this.dynamicItem = this.processToArr(res.data.priority);
            }
          });
        });
      } else {
        this.title = "新增合作";
        this.$nextTick(() => {
          //新增的时候重置表单就行了
          this.$refs["form"].resetFields();
          resetDataAttr(this, "form");
          resetDataAttr(this, "dynamicItem");
        });
      }
    },
    getAppName() {
      appApi.getAppAll().then(res => {
        this.$nextTick(() => [(this.appName = res.data)]);
      });
    },
    processToString(item) {
      var arr = [];
      item.forEach(item => {
        arr.push(item.priority);
      });
      return arr.join(",");
    },
    processToArr(item) {
      var arr = [];
      item.split(",").forEach(item => {
        arr.push({ priority: Number(item) });
      });
      return arr;
    },

    addItem() {
      this.dynamicItem.push({
        priority: ""
      });
    },
    deleteItem(item, index) {
      if (index > 0) {
        this.dynamicItem.splice(index, 1);
      }
    },
    addCompany(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let priority = this.processToString(this.dynamicItem); //处理下拉框数据
          if (this.form.id) {
            cooperateApi
              .eidtCooperation({
                ...this.form,
                priority
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
            cooperateApi
              .addCooperation({
                ...this.form,
                priority
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
  }
};
</script>

<style></style>
