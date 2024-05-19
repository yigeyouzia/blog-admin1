<template>
  <div>
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      @close="closeWindow"
      :showCancel="false"
    >
      <div class="my_title">{{ blog.title }}</div>
      <div v-html="blog.content" class="blog-detail"></div>
    </Window>
  </div>
</template>

<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css"; //样式

import { getCurrentInstance, ref, reactive, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getBlogDetail: "/blog/getBlogById",
};

// 控制windoiw打开
const windowConfig = reactive({
  show: false,
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        windowConfig.show = false;
      },
    },
  ],
});

const closeWindow = () => {
  windowConfig.show = false;
};

// 博客详情内容
const blog = ref({});
const showDetail = async (blogId) => {
  windowConfig.show = true;
  let result = await proxy.Request({
    url: api.getBlogDetail,
    params: {
      blogId: blogId,
    },
  });
  if (!result) {
    return;
  }
  // console.log("@", result);
  blog.value = result.data;
  nextTick(() => {
    //高亮显示
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
};
defineExpose({ showDetail });
</script>

<style lang="scss" >
.my_title {
  font-size: 18px;
  font-family: serif;
  font-weight: 800;
}

.blog-detail {
  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }

  img {
    max-width: 80%;
  }
}
</style>
