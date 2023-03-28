import { IObject, IViewHooks, IViewHooksOptions } from "@/../types/interface";
import service from "@/service";
import { onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const useView = (props: IViewHooksOptions | IObject): IViewHooks => {
  const defaultOptions: IViewHooksOptions = {
    createdIsNeed: true,
    activatedIsNeed: false,
    getDataListURL: "",
    getDataListIsPage: false,
    deleteURL: "",
    deleteIsBatch: false,
    deleteIsBatchKey: "id",
    exportURL: "",
    dataForm: {},
    dataList: [],
    order: "",
    orderField: "",
    page: 1,
    limit: 10,
    total: 0,
    dataListLoading: false,
    dataListSelections: [],
    elTable: {}
  };

  const mergeDefaultStateToPageState = (
    options: IObject,
    props: IObject
  ): IViewHooksOptions => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key];
      }
    }
    return props;
  };
  const state = mergeDefaultStateToPageState(defaultOptions, props);
  onMounted(() => {
    if (state.createdIsNeed && !state.activatedIsNeed) {
      viewFns.query();
    }
  });
  //
  const viewFns = {
    // 获取数据列表
    query() {
      if (!state.getDataListURL) {
        return;
      }
      state.dataListLoading = true;
      service
        .get(state.getDataListURL, {
          order: state.order,
          orderField: state.orderField,
          page: state.getDataListIsPage ? state.page : null,
          limit: state.getDataListIsPage ? state.limit : null,
          ...state.dataForm
        })
        .then((res: any) => {
          console.log("service", res);
          state.dataListLoading = false;
          state.dataList = state.getDataListIsPage ? res.data.list : res.data;
          state.total = state.getDataListIsPage ? res.data.total : 0;
          console.log("state", state);
        })
        .catch(() => {
          state.dataListLoading = false;
        });
    },
    // 多选
    dataListSelectionChangeHandle(val: IObject[]) {
      state.dataListSelections = val;
    },
    // 排序
    dataListSortChangeHandle(data: IObject) {
      if (!data.order || !data.prop) {
        state.order = "";
        state.orderField = "";
        return false;
      }
      state.order = data.order.replace(/ending$/, "");
      state.orderField = data.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
      viewFns.query();
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val: number) {
      state.page = 1;
      state.limit = val;
      viewFns.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val: number) {
      state.page = val;
      viewFns.query();
    },
    //搜索
    getDataList() {
      state.page = 1;
      viewFns.query();
    },
    // 删除
    deleteHandle(id?: string): Promise<any> {
      return new Promise((resolve, reject) => {
        if (
          state.deleteIsBatch &&
          !id &&
          state.dataListSelections &&
          state.dataListSelections.length <= 0
        ) {
          ElMessage.warning({
            message: "删除",
            duration: 500
          });
          return;
        }
        ElMessageBox.confirm("删除", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            service
              .delete(
                `${state.deleteURL}${state.deleteIsBatch ? "" : "/" + id}`,
                state.deleteIsBatch
                  ? id
                    ? [id]
                    : state.dataListSelections
                    ? state.dataListSelections.map(
                        (item: IObject) =>
                          state.deleteIsBatchKey && item[state.deleteIsBatchKey]
                      )
                    : {}
                  : {}
              )
              .then(res => {
                ElMessage.success({
                  message: "成功",
                  duration: 500,
                  onClose: () => {
                    viewFns.query();
                    resolve(true);
                  }
                });
              });
          })
          .catch(() => {
            //
          });
      });
    }
  };
  return {
    ...viewFns
  };
};

export default useView;
