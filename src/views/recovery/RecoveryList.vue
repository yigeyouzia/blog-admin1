<template>
  <div class="body">
    <div class="top-panel">
      <el-form
        @submit.prevent
        :model="searchForm"
        class="search-form"
        labelAlign="left"
      >
        <el-row :gutter="5">
          <el-col :span="5">
            <el-form-item label="标题">
              <el-input
                v-model="searchForm.titleFuzzy"
                placeholder="支持模糊搜索"
                @keyup.enter="loadDataList"
                allowClear
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="danger" @click="loadDataList()">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <Table
      :columns="columns"
      :showPagination="true"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <!-- 图片封面 -->
      <template #cover="{ row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <!-- 文章信息 -->
      <template #blogInfo="{ row }">
        <div>标题：{{ row.title }}</div>
        <div>
          文章类型：{{ row.blogType == 0 ? "博客" : "专题" }}
          <el-divider direction="vertical" />
          <span>{{ row.blogType == 0 ? "分类" : "专题" }}</span
          >：{{ row.categoryName || "--" }}
        </div>
        <div>作者：{{ row.nickName }}</div>
      </template>
      <!-- 文章类型 -->
      <template #typeName="{ row }">
        <div>
          类型：<span v-if="row.type == 0">原创</span>
          <span v-if="row.type == 1">转载</span>
        </div>
        <div v-if="row.type == 1">转载地址 ：{{ row.reprintUrl }}</div>
      </template>
      <!-- 文章类型 -->
      <template #statusName="{ row }">
        <span v-if="row.status == 1" :style="{ color: 'green' }">{{
          row.statusName
        }}</span>
        <span v-else :style="{ color: 'red' }">{{ row.statusName }}</span>
      </template>
      <!-- 文章类型 -->
      <template #time="{ row }">
        <div>创建时间：{{ row.createTime }}</div>
        <div>更新时间：{{ row.lastUpdateTime }}</div>
      </template>
      <!-- 操作 -->
      <template #op="{ row }">
        <template
          v-if="row.userId == userInfo.userId || userInfo.roleType == 1"
        >
          <div class="op">
            <a
              class="a-link"
              href="javascript:void(0)"
              @click="reductionBlog(row)"
              v-if="userInfo.userId == row.userId"
              >还原</a
            >
            <span v-else>--</span>
            <el-divider direction="vertical" />
            <a
              class="a-link"
              href="javascript:void(0)"
              @click="delBlog(row)"
              v-if="userInfo.userId == row.userId"
              >删除</a
            >
          </div>
        </template>
        <span v-else>--</span>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/blog/loadRecoveryList",
  delBlog: "/blog/delBlog",
  reductionBlog: "/blog/reductionBlog",
};
const userInfo = ref(proxy.VueCookies.get("userInfo") || {});
// 搜索
const searchformData = reactive({});
const categoryList = ref();

//列表
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "文章信息",
    prop: "blogInfo",
    scopedSlots: "blogInfo",
  },
  {
    label: "编辑器",
    prop: "editorTypeName",
    width: 100,
  },
  {
    label: "评论",
    prop: "allowCommentTypeName",
    width: 100,
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    scopedSlots: "statusName",
  },
  {
    label: "时间",
    prop: "time",
    width: 300,
    scopedSlots: "time",
  },
  {
    label: "操作",
    prop: "op",
    width: 200,
    scopedSlots: "op",
  },
];
const searchForm = reactive({});
const tableData = reactive({});
const tableOptions = {
  exHeight: 50,
};
// 加载数据
const loadDataList = async () => {
  console.log(userInfo);
  let params = {
    pageNo: tableData.pageNo,
    pageSize: tableData.pageSize,
  };
  Object.assign(params, searchForm);
  let result = await proxy.Request({
    url: api.loadDataList,
    params: params,
  });
  if (!result) {
    return;
  }
  // console.log(result);
  Object.assign(tableData, result.data);
};
//删除
const delBlog = (data) => {
  proxy.Confirm(`确认要删除【${data.title}】吗，删除后无法找回？`, async () => {
    let result = await proxy.Request({
      url: api.delBlog,
      params: {
        blogId: data.blogId,
      },
    });
    if (!result) {
      return;
    }
    proxy.message.success("删除成功");
    loadDataList();
  });
};

//恢复博客
const reductionBlog = (data) => {
  proxy.Confirm(
    `确认要恢复【${data.title}】吗？恢复后博客为草稿状态。`,
    async () => {
      let result = await proxy.Request({
        url: api.reductionBlog,
        params: {
          blogId: data.blogId,
        },
      });
      if (!result) {
        return;
      }
      proxy.message.success("恢复成功");
      loadDataList();
    }
  );
};
</script>

<style lang="scss">
.blogInfo {
  font-size: 1px;
}
</style>
