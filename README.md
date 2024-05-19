> - 项目教程地址 [项目简介\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Lg411a7N5/?p=1&vd_source=30924cc6debe913490fb34d7e3b62fdd)
>
> - 后端[Easyshop 老罗的教程源码都在这里 (wuhancoder.com)](http://easyshop.wuhancoder.com/product/271530889939907)
> - 资料[EasyBlog 文档 - 安装后端程序 - 我是程序员 (wuhancoder.com)](http://www.wuhancoder.com/special/vbbStsCMXs.html)
> - 博客后端资料[博客免费资料 (qq.com)](https://docs.qq.com/doc/DY1NObGlEcUVkT0Fn)
>
> 😋😋😋

# 环境搭建

## 数据库

1. 创建数据库

2. ![image-20230416111922706](E:/%E7%AC%94%E8%AE%B0/%E5%89%8D%E7%AB%AF/vue/project/%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/Untitled.assets/image-20230416111922706.png)

3. sql 文件

   ```sql
   /*
   Navicat MySQL Data Transfer

   Source Server         : localhost
   Source Server Version : 50614
   Source Host           : localhost:3306
   Source Database       : easyblog

   Target Server Type    : MYSQL
   Target Server Version : 50614
   File Encoding         : 65001

   Date: 2022-09-25 19:34:37
   */

   SET FOREIGN_KEY_CHECKS=0;

   -- ----------------------------
   -- Table structure for blog
   -- ----------------------------
   DROP TABLE IF EXISTS `blog`;
   CREATE TABLE `blog` (
     `blog_id` VARCHAR(10) NOT NULL COMMENT '博客ID',
     `p_blog_id` VARCHAR(10) DEFAULT NULL COMMENT '父ID',
     `title` VARCHAR(200) DEFAULT NULL COMMENT '标题',
     `category_id` INT(11) DEFAULT NULL COMMENT '分类ID',
     `category_name` VARCHAR(100) DEFAULT NULL COMMENT '分类名称',
     `cover` VARCHAR(100) DEFAULT NULL COMMENT '封面',
     `summary` VARCHAR(300) DEFAULT NULL COMMENT '摘要',
     `content` MEDIUMTEXT COMMENT '内容',
     `markdown_content` TEXT COMMENT 'markdown编辑内容',
     `editor_type` TINYINT(4) DEFAULT NULL COMMENT '0:富文本 1:markdown编辑器',
     `tag` VARCHAR(200) DEFAULT NULL COMMENT '标签',
     `type` TINYINT(4) DEFAULT NULL COMMENT '0:原创 1:转载',
     `reprint_url` VARCHAR(200) DEFAULT NULL COMMENT '转载地址',
     `user_id` INT(11) DEFAULT NULL COMMENT '用户ID',
     `nick_name` VARCHAR(20) DEFAULT NULL COMMENT '昵称',
     `allow_comment` TINYINT(4) DEFAULT NULL COMMENT '0:不允许评论 1:允许评论',
     `status` TINYINT(4) DEFAULT '1' COMMENT '0:草稿 1:已发布',
     `del_type` TINYINT(4) DEFAULT NULL COMMENT '0:删除 1:正常',
     `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
     `last_update_time` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
     `blog_type` TINYINT(4) DEFAULT NULL COMMENT '0:博客  1:专题',
     `sort` TINYINT(4) DEFAULT NULL,
     PRIMARY KEY (`blog_id`)
   ) ENGINE=INNODB DEFAULT CHARSET=utf8mb4 COMMENT='博客';

   -- ----------------------------
   -- Records of blog
   -- ----------------------------
   INSERT INTO `blog` VALUES ('bXclKZTgbf', 'tSNqhoJdWN', '安装后端程序', '10028', 'EasyBlog文档', NULL, NULL, '<p data-v-md-line=\"1\">安装后端程序 文档：http://www.wuhancoder.com/special/vbbStsCMXs.html</p>\n', '安装后端程序 文档：http://www.wuhancoder.com/special/vbbStsCMXs.html', '1', NULL, '0', NULL, '100000', '多多洛2020', '1', '1', '1', '2022-09-25 11:20:18', '2022-09-25 11:20:36', '1', '1');
   INSERT INTO `blog` VALUES ('egTFAnQNsa', 'GeLsGNuzcn', 'web端', '10028', 'EasyBlog文档', NULL, NULL, '<p data-v-md-line=\"1\">web端接口文档地址：http://www.wuhancoder.com/special/wBURpKFtiT.html</p>\n', 'web端接口文档地址：http://www.wuhancoder.com/special/wBURpKFtiT.html', '1', NULL, '0', NULL, '100000', '多多洛2020', '1', '1', '1', '2022-09-25 11:19:21', '2022-09-25 11:19:40', '1', '2');
   INSERT INTO `blog` VALUES ('GeLsGNuzcn', '0', '接口文档', '10028', 'EasyBlog文档', NULL, NULL, '<p data-v-md-line=\"1\">接口文档地址：http://www.wuhancoder.com/special/azvNIIFQCy.html</p>\n', '接口文档地址：http://www.wuhancoder.com/special/azvNIIFQCy.html', '1', NULL, '0', NULL, '100000', '多多洛2020', '1', '1', '1', '2022-09-25 11:18:36', '2022-09-25 11:18:49', '1', '2');
   INSERT INTO `blog` VALUES ('nReaunNBIO', NULL, 'EasyBlog', NULL, NULL, NULL, NULL, '', '', '1', NULL, NULL, NULL, '100000', '多多洛2020', NULL, '0', '0', '2022-09-25 11:17:05', '2022-09-25 11:18:22', '1', NULL);
   INSERT INTO `blog` VALUES ('oPOCJVYgTN', '', 'EasyBlog 轻博客', '10027', 'EasyBlog', '', 'EasyBlog是一款可以生成静态页面的团队博客，演示地址：http://www.wuhancoder.com/', '<p data-v-md-line=\"1\">EasyBlog 是一款可以生成静态页面的团队博客，演示地址：http://www.wuhancoder.com/</p>\n', 'EasyBlog 是一款可以生成静态页面的团队博客，演示地址：http://www.wuhancoder.com/\n', '1', 'EasyBlog', '0', '', '100000', '多多洛2020', '1', '1', '1', '2022-09-25 11:16:14', '2022-09-25 13:29:34', '0', NULL);
   INSERT INTO `blog` VALUES ('oYltCOuIWy', 'GeLsGNuzcn', '管理端', '10028', 'EasyBlog文档', NULL, NULL, '<p data-v-md-line=\"1\">管理端接口地址：http://www.wuhancoder.com/special/cqzKWftzyr.html</p>\n', '管理端接口地址：http://www.wuhancoder.com/special/cqzKWftzyr.html', '1', NULL, '0', NULL, '100000', '多多洛2020', '1', '1', '1', '2022-09-25 11:18:57', '2022-09-25 11:19:10', '1', '1');
   INSERT INTO `blog` VALUES ('tSNqhoJdWN', '0', '后端服务部署', '10028', 'EasyBlog文档', NULL, NULL, '<p data-v-md-line=\"1\">后端服务部署 地址:http://www.wuhancoder.com/special/gTvGKLsNNZ.html</p>\n', '后端服务部署 地址:http://www.wuhancoder.com/special/gTvGKLsNNZ.html', '1', NULL, '0', NULL, '100000', '多多洛2020', '1', '1', '1', '2022-09-25 11:19:53', '2022-09-25 11:20:10', '1', '3');
   INSERT INTO `blog` VALUES ('VcAHNciAwe', '0', '简介', '10028', 'EasyBlog文档', NULL, NULL, '<p data-v-md-line=\"1\">EasyBlog是一个可以生成静态页面的团队博客，可以创建博客，和专题文章。博客可以生成静态页面，可以在线导出所有静态页面，也可以提交到github pagse,gitee pages。<br>\nEasyBlog可以自己平时写博客，还可以邀请志同道合的朋友，同事一起来维护一个博客。</p>\n', 'EasyBlog是一个可以生成静态页面的团队博客，可以创建博客，和专题文章。博客可以生成静态页面，可以在线导出所有静态页面，也可以提交到github pagse,gitee pages。\nEasyBlog可以自己平时写博客，还可以邀请志同道合的朋友，同事一起来维护一个博客。', '1', NULL, '0', NULL, '100000', '多多洛2020', '1', '1', '1', '2022-09-25 11:17:33', '2022-09-25 11:18:09', '1', '1');

   -- ----------------------------
   -- Table structure for blog_category
   -- ----------------------------
   DROP TABLE IF EXISTS `blog_category`;
   CREATE TABLE `blog_category` (
     `category_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
     `cover` VARCHAR(100) DEFAULT NULL COMMENT '封面',
     `category_name` VARCHAR(100) DEFAULT NULL COMMENT '分类名称',
     `category_desc` VARCHAR(200) DEFAULT NULL COMMENT '分类描述',
     `category_type` TINYINT(4) DEFAULT NULL COMMENT '0:博客分类  1:专题',
     `user_id` INT(11) DEFAULT NULL COMMENT '用户ID',
     `nick_name` VARCHAR(20) DEFAULT NULL COMMENT '昵称',
     `sort` INT(11) DEFAULT NULL COMMENT '排序',
     PRIMARY KEY (`category_id`)
   ) ENGINE=INNODB AUTO_INCREMENT=10029 DEFAULT CHARSET=utf8mb4 COMMENT='博客分类';

   -- ----------------------------
   -- Records of blog_category
   -- ----------------------------
   INSERT INTO `blog_category` VALUES ('10027', NULL, 'EasyBlog', 'EasyBlog一个可以生成静态页面的博客', '0', NULL, NULL, '1');
   INSERT INTO `blog_category` VALUES ('10028', NULL, 'EasyBlog文档', 'EasyBlog文档', '1', '100000', '多多洛2020', '2');

   -- ----------------------------
   -- Table structure for blog_team_user
   -- ----------------------------
   DROP TABLE IF EXISTS `blog_team_user`;
   CREATE TABLE `blog_team_user` (
     `user_id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
     `nick_name` VARCHAR(30) DEFAULT NULL COMMENT '昵称',
     `avatar` VARCHAR(100) DEFAULT NULL COMMENT '头像',
     `phone` VARCHAR(11) DEFAULT NULL COMMENT '手机号',
     `password` VARCHAR(32) DEFAULT NULL COMMENT '密码',
     `profession` VARCHAR(20) DEFAULT NULL COMMENT '职业',
     `introduction` TEXT COMMENT '简介',
     `editor_type` TINYINT(4) DEFAULT NULL COMMENT '0:富文本 1:markdown编辑器',
     `role_type` TINYINT(4) DEFAULT NULL COMMENT '0:普通用户 1:超级管理员',
     `status` TINYINT(4) DEFAULT NULL COMMENT '0:禁用 1:启用',
     `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
     `last_login_time` DATETIME DEFAULT NULL COMMENT '最后登录时间',
     PRIMARY KEY (`user_id`),
     UNIQUE KEY `idx_key` (`phone`)
   ) ENGINE=INNODB AUTO_INCREMENT=100003 DEFAULT CHARSET=utf8mb4 COMMENT='博客成员';

   -- ----------------------------
   -- Records of blog_team_user
   -- ----------------------------
   INSERT INTO `blog_team_user` VALUES ('100000', '多多洛2020', '202209/YXqtWcMXrPkxzkyTJeQjCiATKisguw.gif', '18666666666', '0192023a7bbd73250516f069df18b500', 'Java开发', '<p style=\"text-align: start;\">老程序员一枚，目前就职于武汉某上市互联网公司，主要做Java开发，半拉子前端。之前领导是这么评价我的，在Java组，我前端是最牛逼的，在前端组我Java是最牛逼的。不知道这是夸我还是夸我。</p><p style=\"text-align: start;\"> &nbsp; &nbsp; &nbsp;平时喜欢敲敲代码，喜欢打乒乓球，偶尔游戏（war3，好久没玩了），爱耍抖音（刷完一片空虚，哈哈，有木有同类）。我的座右铭是 搞事情多做要快，姿势要帅。不喜欢加班，也很少加班。</p><p><br></p>', '1', '1', '1', '2021-12-04 20:56:01', '2021-12-23 15:17:12');
   INSERT INTO `blog_team_user` VALUES ('100002', '程序员老罗', '202209/dUTIjaablvTKvdyoljYpSCeBHzUguN.jpg', '18766666666', '0192023a7bbd73250516f069df18b500', '程序员', '<p style=\"text-align: start;\">程序员老罗，老程序员一枚</p>', '0', '0', '1', '2022-09-24 18:35:14', NULL);

   ```

   4. 修改 `application.properties`

   ![image-20230416112814668](E:/%E7%AC%94%E8%AE%B0/%E5%89%8D%E7%AB%AF/vue/project/%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/Untitled.assets/image-20230416112814668.png)

   5. 运行 `java -jar easyblog-1.0.0.jar`
   6. 测试 http://localhost:8081/api/view/loadBlogList

## 项目搭建

### 创建

- 创建项目 `npm init vite@latest easyblog-front-admin`

- 勾选 `vue  JavaScript`

- ```
  Done. Now run:

    cd easyblog-front-admin
    npm install
    npm run dev
  ```

### 安装 router

- `npm install vue-router@4 --save`

- ```js
  import { createRouter, createWebHistory } from "vue-router";

  const routes = [
    {
      name: "首页",
      path: "/home",
      component: () => import("../views/Home.vue"),
    },
  ];

  const router = createRouter({
    routes,
    history: createWebHistory(),
  });

  export default router;
  ```

- `app 组件加入路由出口` <router-view></router-view>

### 配置服务器代理和路径别名

- `vite.config.js`

- ```js
  import { defineConfig } from "vite";
  import vue from "@vitejs/plugin-vue";

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [vue()],
    server: {
      hmr: true,
      port: 3001,
      proxy: {
        "/api": {
          // target: loadEnv(mode, process.cwd()).VITE_APP_PROXY_TARGET, // 目标代理接口地址
          target: "http://localhost:8081/",
          secure: false,
          changeOrigin: true, // 开启代理 在本地创建一个虚拟服务器
          pathRewrite: {
            "^/api": "/api",
          },
        },
      },
    },
    resolve: {
      // 配置路径别名
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
  ```

- `npm install path --save`

# 登录

- 安装 `npm install element-plus --save`
- 安装 sass `npm insatll sass --save` `npm install sass-loader --save`
- 安装 axios `npm insatll axions --save`

## 点击验证码刷新

```js
const checkCodeUrl = ref("api/checkCode?" + new Date().getTime());

const changeCheckCode = () => {
  checkCodeUrl.value = "api/checkCode?" + new Date().getTime();
};
```

## 验证码左右布局

```css
.check-code-panel {
  width: 100%;
  display: flex;
  align-items: center;
  .input-panel {
    flex: 1;
    margin-right: 5px;
  }
  .check-code {
    height: 30px;
    cursor: pointer;
  }
}
```

## 输入框前 icon

- 使用阿里巴巴适量

```html
<el-input>
  <template #prefix>
    <span class="iconfont icon-account"></span>
  </template>
</el-input>
```

- 组件 icon

```html
<el-input
  v-model="formData.password"
  placeholder="请输入密码"
  size="large"
  :prefix-icon="Lock"
  此处
/>
```

## 表单验证

1. 给 `el-form` 添加 ref 和 rules（规则） model 绑定表单数据结果

```html
<el-form :model="formData" :rules="rules" ref="formDataRef"></el-form>
```

2. 给 `el-form-item` 添加 prop（匹配规则）

```html
<el-form-item prop="account">
  <el-input v-model="formData.account" placeholder="请输入账号" size="large"
/></el-form-item>
```

3. 编写 setup

```js
// 表单相关
const formDataRef = ref();
const formData = reactive({});

const rules = {
  account: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
};

const login = () => {
  formDataRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
  });
};
```

## ✨✨axios

- 引入 md5 `npm install js-md5 --save`

- `@/utils/Request.js`
  - 发送请求拦截器

```js
import axios from "axios";

import { ElLoading } from "element-plus";
import router from "@/router";
import message from "@/utils/Message";

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8";
const contentTypeJson = "application/json";
const contentTypeFile = "multipart/form-data";

const request = (config) => {
  let { url, params, dataType = "form", showLoading = "true" } = config;
  let contentType = contentTypeForm;
  if (dataType === "json") {
    contentType = contentTypeJson;
  } else if (dataType === "file") {
    contentType = contentTypeFile;
    let param = new FormData();
    for (let key in params) {
      param.append(key, params[key]);
    }
    params = param;
  }

  const instantce = axios.create({
    baseURL: "/api",
    timeout: 10 * 1000,
    headers: {
      "Content-Type": contentType,
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  let loading = null;
  instantce.interceptors.request.use(
    (config) => {
      if (showLoading) {
        loading = ElLoading.service({
          lock: true,
          text: "加载中......",
          background: "rgba(0, 0, 0, 0.7)",
        });
      }
      return config;
    },
    (error) => {
      if (showLoading && loading) {
        loading.close();
      }
      message.error("发送请求失败");
      return Promise.reject("发送请求失败");
    }
  );

  //请求后拦截
  instantce.interceptors.response.use(
    (response) => {
      if (showLoading && loading) {
        loading.close();
      }
      const responseData = response.data;
      if (responseData.status == "error") {
        if (responseData.code == 901) {
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return Promise.reject("登录超时");
        }
        if (config.errorCallback) {
          config.errorCallback();
        }
        return Promise.reject(responseData.info);
      } else {
        if (responseData.code == 200) {
          return responseData;
        }
      }
    },
    (error) => {
      console.log(error);
      if (showLoading && loading) {
        loading.close();
      }
      return Promise.reject("网络异常");
    }
  );

  return instantce.post(url, params).catch((error) => {
    message.error(error);
    return null;
  });
};

export default request;
```

- `@/utils/Message.js`

  ```js
  import { ElLoading, ElMessage } from "element-plus";

  // message对象里封装了三个消息方法
  const message = {
    error: (msg) => {
      ElMessage({
        message: msg,
        type: "error",
        duration: 2000,
      });
    },
    success: (msg) => {
      ElMessage({
        message: msg,
        type: "success",
        duration: 2000,
      });
    },
    warning: (msg) => {
      ElMessage({
        message: msg,
        type: "warning",
        duration: 2000,
      });
    },
  };

  export default message;
  ```

# 框架页

- ui
- ![image-20230417215035915](E:/%E7%AC%94%E8%AE%B0/%E5%89%8D%E7%AB%AF/vue/project/%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/%E7%AC%94%E8%AE%B0.assets/image-20230417215035915.png)

- 布局技巧
  - 使内容区撑开 `calc(100vh - 60px)`
  - vh 视口，表示可见屏幕的所有高度

```css
.container {
  background: #f5f6f7;
  height: calc(100vh - 60px);
  .right-main {
  }
}
```

## 检测路由跳转

```js
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 检测路径变化
const activePath = ref(null);

watch(
  route,
  (newVal, oldVal) => {
    activePath.value = newVal.path;
  },
  { immediate: true, deep: true }
);
```

# 博客分类

## 封装 Dialog

> - `showClose` 是否展示关闭按钮
> - `showCancel` 是否取消按钮
> - `buttons` 底部按钮 数组

```vue
<template>
  <div>
    <el-dialog
      :show-close="showClose"
      :draggable="true"
      :model-value="show"
      :close-on-click-modal="false"
      :title="title"
      class="cust-dialog"
      :top="top"
      :width="width"
      :showCancel="showCancel"
      @close="close"
    >
      <!-- 弹框内容 插槽 -->
      <div class="dialog-body">
        <slot></slot>
      </div>
      <!-- 弹框下的按钮 -->
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button link @click="close"> 取消 </el-button>
          <el-button
            v-for="(btn, index) in buttons"
            :type="btn.type"
            @click="btn.click"
            :key="index"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
  },
  show: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  top: {
    type: String,
    default: "50px",
  },
  width: {
    type: String,
    default: "30%",
  },
  buttons: {
    type: Array,
  },
});

const emit = defineEmits();
const close = () => {
  emit("close");
};
</script>

<style lang="scss">
.cust-dialog {
  .el-dialog__body {
    padding: 0px;
  }
  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 15px;
    min-height: 80px;
  }
  .dialog-footer {
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
```

- 使用实例

```vue
<Dialog
  :show="dialogConfig.show"
  :title="dialogConfig.title"
  :buttons="dialogConfig.buttons"
  @click="dialogConfig.show = false"
>
    
    </Dialog>

<script>
const dialogConfig = reactive({
  show: true,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        console.log("x");
      },
    },
  ],
});
</script>
```

## 封装下载封面

```vue
<template>
  <el-upload
    name="file"
    :show-file-list="false"
    accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
    :multiple="false"
    :http-request="uploadImage"
  >
    <div class="cover-upload-btn">
      <!-- 上传文件后显示 -->
      <template v-if="modelValue">
        <img :src="proxy.globalInfo.imageUrl + modelValue" />
      </template>
      <!-- 加号+icon -->
      <span class="iconfont icon-add" v-else></span>
    </div>
  </el-upload>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  // 名字不能改
  modelValue: {
    type: String,
    default: null,
  },
});
const api = {
  uploadUrl: "file/uploadImage",
};

// 文件上传
const emit = defineEmits();
const uploadImage = async (file) => {
  // file 文件对象
  // console.log(file);
  let result = await proxy.Request({
    url: api.uploadUrl,
    dataType: "file",
    params: {
      file: file.file, // 真正的文件对象 二进制文件流
      type: 0, // 博客分类
    },
  });
  const fileName = result.data.fileName;
  emit("update:modelValue", fileName);
  emit("callback", fileName);
};
</script>

<style lang="scss">
.cover-upload-btn {
  background: url(../assets/cover_bg.png);
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  .iconfont {
    font-size: 50px;
    color: rgb(164, 164, 164);
  }
  img {
    width: 100%;
  }
}
</style>
```

- 全局引入组件

```js
import CoverUpload from "@/components/CoverUpload.vue";
app.component("CoverUpload", CoverUpload);
```
