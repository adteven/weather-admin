<template>
  <div class="xjl-sys__dep">
    <el-form
      :inline="true"
      :model="state.dataForm"
      @keyup.enter="state.getDataList()"
    >
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">增加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="state.dataListLoading"
      :data="state.dataList"
      row-key="id"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="部门名称"
        header-align="center"
        min-width="150"
      />
      <el-table-column
        prop="parentName"
        label="上级部门"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="sort"
        label="排序"
        header-align="center"
        align="center"
        width="80"
      />
      <el-table-column
        label="操作"
        fixed="right"
        header-align="center"
        align="center"
        width="150"
      >
        <template v-slot="scope">
          <el-button
            type="primary"
            link
            @click="addOrUpdateHandle(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            type="primary"
            link
            @click="state.deleteHandle(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList" />
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref } from "vue";
import useView from "@/hooks/useView";
import AddOrUpdate from "@/views/sys/menu/addOrUpdate.vue";

defineOptions({
  name: "Dept"
});

const view = reactive({
  getDataListURL: "/sys/dept/list",
  deleteURL: "/sys/dept"
});

const state = reactive({ ...useView(view), ...toRefs(view) });

const addOrUpdateRef = ref();

const addOrUpdateHandle = (id?: number) => {
  addOrUpdateRef.value.init(id);
};
</script>

<style lang="scss" scoped>
.tableBox {
  :deep .cell {
    height: 40px !important;
  }
}
</style>
