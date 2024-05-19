<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <img src="../assets/logo.png" class="logo" />
        <div class="user-info">
          <span>欢迎回来, </span>
          <el-dropdown trigger="click">
            <span>
              <span class="nick-name">
                {{ userInfo.nickName }}
                <span class="iconfont icon-close"></span>
              </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/settings/my" class="a-link"
                    >个人信息</router-link
                  >
                </el-dropdown-item>
                <el-dropdown-item @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar">
            <!-- <img src="../assets/avatar.png" /> -->
            <img :src="userInfo.avatar" />
          </div>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside width="200px" class="left-aside">
          <div>
            <el-button class="post-btn" @click="createHtml">发布</el-button>
          </div>
          <div class="memu-panel">
            <ul>
              <li v-for="(menu, idx) in menuList" :key="idx">
                <span class="menu-title-p" @click="openClose(idx)">
                  <span :class="['iconfont', menu.icon]"></span>
                  <span class="menu-title">{{ menu.title }}</span>
                  <span
                    :class="[
                      'iconfont',
                      'open-close',
                      menu.open ? 'icon-open' : 'icon-close',
                    ]"
                  ></span>
                </span>
                <ul class="sub-menu" v-if="menu.open">
                  <li v-for="(subMenu, idx1) in menu.children" :key="idx1">
                    <router-link
                      :to="subMenu.path"
                      :class="[
                        'sub-menu-item',
                        activePath == subMenu.path ? 'active' : '',
                      ]"
                      >{{ subMenu.title }}</router-link
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <!-- 右边 -->
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <Dialog
      :show="progressDialog.show"
      :title="progressDialog.title"
      :buttons="progressDialog.buttons"
      @close="progressDialog.show = false"
      :show-close="false"
      :showCancel="false"
      width="400px"
    >
      <div class="progress-container">
        <div class="progress-panel">
          <el-progress
            type="circle"
            :percentage="progressInfo.progress"
            :status="progressInfo.status"
            :color="colors"
          />
        </div>
        <div class="error" v-if="progressInfo.result == 0">
          <div>生成页面出错了：{{ progressInfo.errorMsg }}</div>
          <div class="info">具体错误，请查看服务器日志</div>
        </div>
        <div
          class="success"
          v-if="progressInfo.progress == 100 && progressInfo.result == 1"
        >
          发布成功
        </div>
        <div
          class="btn-panel"
          v-if="progressInfo.progress == 100 || progressInfo.result == 0"
        >
          <el-button
            class="btn"
            type="primary"
            @click="progressDialog.show = false"
            >关闭</el-button
          >
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, watch } from "vue";
import VueCookies from "vue-cookies";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const store = useStore();

const api = {
  getUserInfo: "getUserInfo",
  logout: "logout",
  createHtml: "createHtml",
  checkProgress: "checkProgress",
};

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const menuList = ref([
  {
    title: "博客",
    icon: "icon-blog",
    open: true,
    children: [
      {
        title: "博客管理",
        path: "/blog/list",
      },
      {
        title: "分类管理",
        path: "/blog/category",
      },
    ],
  },
  {
    title: "专题",
    icon: "icon-zhuanti",
    open: true,
    children: [
      {
        title: "专题管理",
        path: "/special/list",
      },
    ],
  },
  {
    title: "设置",
    icon: "icon-settings",
    open: true,
    children: [
      {
        title: "个人信息设置",
        path: "/settings/my",
      },
      {
        title: "博客成员",
        path: "/settings/teamUser",
      },
      {
        title: "系统设置",
        path: "/settings/sysInfo",
        roleType: 1,
      },
    ],
  },
  {
    title: "回收站",
    icon: "icon-delete",
    open: true,
    children: [
      {
        title: "回收站",
        path: "/recovery/list",
      },
    ],
  },
]);

const openClose = (index) => {
  const open = menuList.value[index].open;
  menuList.value[index].open = !open;
};

const userInfo = ref({});

const init = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
  userInfo.value.avatar = proxy.globalInfo.imageUrl + result.data.avatar;
  // userInfo.value = VueCookies.get("userInfo");
  // console.log(userInfo);
  // console.log(userInfo.value.avatar);
};
init();

// 检测路径变化
const activePath = ref(null);

watch(
  route,
  (newVal, oldVal) => {
    activePath.value = newVal.path;
  },
  { immediate: true, deep: true }
);
// 退出
// 删除
const logout = (data) => {
  proxy.Confirm(`你确定要退出吗`, async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    router.push("/login");
  });
};
// 监听store
watch(
  () => store.state.userInfo,
  (newVal, oldVal) => {
    const avatar = proxy.globalInfo.imageUrl + newVal.avatar;
    const nickName = newVal.nickName;
    userInfo.value = { avatar, nickName };
  },
  { immediate: true, deep: true }
);

//发布
const colors = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#6f7ad3", percentage: 60 },
  { color: "#1989fa", percentage: 80 },
  { color: "#5cb87a", percentage: 100 },
];

const progressDialog = reactive({
  title: "发布",
  buttons: [],
  show: false,
});

const progressInfo = reactive({
  progress: 0,
});

let checkTimer = null;
const createHtml = async () => {
  progressDialog.show = true;
  progressInfo.progress = 0;
  progressInfo.status = undefined;
  let result = await proxy.Request({
    url: api.createHtml,
  });
  if (!result) {
    return;
  }
  checkProgress();
  checkTimer = setInterval(() => {
    checkProgress();
  }, 1000);
};

//
const checkProgress = async () => {
  let result = await proxy.Request({
    url: api.checkProgress,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  if (result.data.result == 0) {
    progressInfo.status = "exception";
    progressInfo.errorMsg = result.data.errorMsg;
  } else {
    progressInfo.progress = result.data.progress;
  }
  progressInfo.result = result.data.result;
  if (
    (result.data.progress == 100 || result.data.result == 0) &&
    checkTimer != null
  ) {
    clearInterval(checkTimer);
  }
};
</script>

<style lang="scss" scoped>
.layout {
  .header {
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      width: 100px;
      height: 50px;
    }
    .user-info {
      display: flex;
      align-items: center;
      .nick-name {
        color: rgb(107, 107, 218);
        margin-left: 7px;
        cursor: pointer;
        .icon-close {
          font-size: 14px;
        }
      }
      // 头像
      .avatar {
        margin-left: 10px;
        width: 55px;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
    }
  }
  .container {
    padding-top: 10px;
    background: #f5f6f7;
    height: calc(100vh - 60px);
    // 左边
    .left-aside {
      padding: 0px 15px;
      width: 280px;
      .post-btn {
        background-image: linear-gradient(
          to right bottom,
          #df2929,
          #518c85,
          #494293
        );
        color: #fff;
        height: 40px;
        width: 100%;
      }
      .memu-panel {
        margin-top: 5px;
        // 大标签
        .menu-title-p {
          box-shadow: 2px 2px 10px #ddd;
          line-height: 45px;
          display: block;
          display: flex;
          cursor: pointer;
          padding: 0px 5px;
          border-radius: 10px;
          .iconfont {
            font-size: 18px;
            color: #91949a;
          }
          .menu-title {
            flex: 1;
            margin-left: 10px;
            color: #3f5042;
            font-weight: 800;
            font-size: 16px;
          }
          .open-close {
            width: 20px;
            font-size: 16px;
          }
        }
        // 小标签
        .sub-menu {
          padding-left: 22px;
          font-size: 14px;
          .sub-menu-item {
            line-height: 40px;
            display: block;
            border-radius: 5px;
            box-shadow: 1px 1px 5px #ddd;
            padding: 0 10px;
            font-weight: 500;
            text-decoration: none;
            color: #383a3d;
          }
          .active {
            background: #ecf5ff;
            color: rgb(223, 170, 35);
          }
        }
        // 动画
        .menu-title-p:hover {
          background: #ecf5ff;
          .menu-title {
            color: #409eff;
          }
        }
        .sub-menu-item:hover {
          color: #409eff;
          background: #ecf5ff;
          box-shadow: 2px 2px 10px #ddd;
        }
      }
    }
    .right-main {
      position: relative;
      background: #fff;
      padding: 20px 10px 10px 10px;
    }
  }
  .progress-container {
    .progress-panel {
      display: flex;
      justify-content: center;
    }

    .error {
      color: red;
      margin-top: 20px;

      .info {
        font-size: 13px;
      }
    }

    .success {
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
      color: green;
    }

    .btn-panel {
      text-align: center;
      margin-top: 20px;

      .btn {
        margin: 0px auto;
      }
    }
  }
}
</style>
