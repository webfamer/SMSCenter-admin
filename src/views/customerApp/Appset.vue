<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="head-l">
        <div class="logo">
          <i class="logo-icon el-icon-user-solid"></i>
          <div class="company">
            <h2>{{ userData.merchantChiName }}</h2>
            <span>{{ userData.description }}</span>
          </div>
        </div>
      </div>
      <div class="header-r" v-show="this.$route.name === 'appservice'">
        <el-button
          type="primary"
          icon="el-icon-s-claim"
          @click="openDialog()"
          >开通服务</el-button
        >
        <el-button type="primary" icon="el-icon-s-claim" @click="editDialog()"
          >修改服务</el-button
        >
      </div>
      <div class="menu" style="clear:both" ref="menu">
        <ul>
          <router-link
            tag="li"
            to="/appset/Appservice"
            :class="{ active: this.$route.name === 'appservice' }"
            >服务</router-link
          >
          <router-link
            tag="li"
            to="/appset/appitem"
            :class="{ active: this.$route.name === 'appitem' }"
            >APP</router-link
          >
          <router-link
            tag="li"
            to="/appset/appoprate"
            :class="{ active: this.$route.name === 'appoprate' }"
            >操作记录</router-link
          >
        </ul>
      </div>
      <Detail ref="detail" @getList="getlist"></Detail>
    </div>
    <router-view />
  </el-card>
</template>

<script>
import customerApi from "@/api/customer.js";
import Detail from "@/views/customerApp/Detail";
export default {
  data() {
    return {
      treeKeyData: "" //服务数据集
    };
  },
  methods: {
    openDialog() {
      this.$refs.detail.openDialog();
    },
    editDialog(){
      this.$refs.detail.editDialog();
    },
    getlist(){
      console.log(this.$children)
    },
    getapiList() {
      customerApi
        .getCustomerApi({
          //获取列表数据拿到选中的值
          merhcant: {
            merchantId: this.userData.id
          }
        })
        .then(res => {
          this.treeKeyData = this.processData(res.data);
          console.log(this.treeKeyData, "获取节点值");
        });
    },
    processData(data) {
      var newarr = [];
      data.forEach(item => {
        newarr.push(item.apiId);
      });
      return newarr;
    }
  },
  created() {
    if (JSON.stringify(this.$route.params) !== "{}") {
      this.userData = this.$route.params;
      let newuserData = JSON.stringify(this.userData);
      localStorage.setItem("userdata", newuserData);
    } else {
      this.userData = JSON.parse(localStorage.getItem("userdata"));
    }
  },
  mounted() {
    this.getapiList();
  },
  components: {
    Detail
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  .clearfix {
    box-sizing: border-box;
    padding: 10px;
  }
  .head-l {
    float: left;
    margin-bottom: 20px;
    .logo {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      .logo-icon {
        width: 60px;
        height: 60px;
        background: #ff6a00;
        border-radius: 50%;
        text-align: center;
        line-height: 60px;
        font-size: 26px;
        color: #fff;
        margin-right: 20px;
      }
    }
  }
  .header-r {
    float: right;
    margin-top: 40px;
    margin-right: 40px;
  }
  .menu {
    ul {
      position: absolute;
      list-style: none;
      left: 0px;
      top: 120px;
      li {
        float: left;
        font-size: 18px;
        width: 80px;
        height: 28px;
        text-align: center;
        font-weight: bold;
        margin-right: 41px;
        cursor: pointer;
      }
      .active {
        border-bottom: 2px solid #0079fe;
      }
    }
  }
}
</style>
