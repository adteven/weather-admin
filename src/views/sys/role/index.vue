<template>
  <div class="xjl-sys__role">
    <el-form
      :inline="true"
      :model="state.dataForm"
      @keyup.enter="state.getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="state.dataForm.name"
          placeholder="校色名称"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">增加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="state.deleteHandle()">删除</el-button>
      </el-form-item>
    </el-form>
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
        prop="name"
        label="名称"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="remark"
        label="备注"
        header-align="center"
        align="center"
      />
      <el-table-column
        prop="createDate"
        label="创建日期"
        sortable="custom"
        header-align="center"
        align="center"
        width="180"
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
    <el-pagination
      :current-page="state.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="state.limit"
      :total="state.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="state.pageSizeChangeHandle"
      @current-change="state.pageCurrentChangeHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" @refreshDataList="state.getDataList" />
  </div>
</template>

<script setup lang="ts">
import useView from "@/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "./addOrUpdate.vue";

defineOptions({
  name: "Role"
});

const view = reactive({
  getDataListURL: "/sys/role/page",
  getDataListIsPage: true,
  deleteURL: "/sys/role",
  deleteIsBatch: true,
  dataForm: {
    name: ""
  }
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
