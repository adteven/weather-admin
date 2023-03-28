<template>
  <div class="xjl-sys__user">
    <el-table
      v-loading="state.dataListLoading"
      :data="state.dataList"
      border
      @selection-change="state.dataListSelectionChangeHandle"
      @sort-change="state.dataListSortChangeHandle"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="username"
        label="用户名"
        sortable="custom"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="deptName"
        label="部门名称"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="email"
        label="邮箱"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="mobile"
        label="手机号"
        sortable="custom"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="gender"
        label="性别"
        sortable="custom"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="status"
        label="用户状态"
        sortable="custom"
        header-align="center"
        align="center"
      >
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 0" size="small" type="danger"
            >正常</el-tag
          >
          <el-tag v-else size="small" type="success">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
      />
    </el-table>
    <el-pagination
      :current-page="state.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="state.limit"
      :total="state.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="state.pageSizeChangeHandle"
      @current-change="state.pageCurrentChangeHandle"
    />
  </div>
</template>

<script setup lang="ts">
import useView from "@/hooks/useView";
import { reactive, toRefs } from "vue";

defineOptions({
  name: "User"
});

const view = reactive({
  getDataListURL: "/sys/user/page",
  getDataListIsPage: true,
  deleteURL: "/sys/user",
  deleteIsBatch: true,
  exportURL: "/sys/user/export",
  dataForm: {
    username: "",
    deptId: "",
    postId: "",
    gender: ""
  }
});

const state = reactive({ ...useView(view), ...toRefs(view) });
</script>

<style lang="scss" scoped>
.tableBox {
  :deep .cell {
    height: 40px !important;
  }
}
</style>
