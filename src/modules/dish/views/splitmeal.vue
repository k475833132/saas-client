<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</cl-row>
		<cl-row>
			<cl-table ref="Table"></cl-table>
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<!-- 分页 -->
			<cl-pagination />
		</cl-row>
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" name="dish-manage" setup>
import { setFocus, useCrud, useTable, useUpsert } from "@cool-vue/crud";
import { ElMessage, ElMessageBox } from "element-plus";
import { onBeforeMount } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

const dishesManagementService = service.dish.dining_ratio;
const formLabelProps = { labelWidth: "160px" };

function fetchList() {
	dishesManagementService.page({ size: 20, page: 1 }).then((res) => {
		console.log(res, "res");
	});
}

onBeforeMount(() => {
	fetchList();
});
// cl-crud
const Crud = useCrud(
	{
		service: dishesManagementService,
		permission: {
			add: false,
			delete: false,
			update: true,
			info: true,
			edit: true
		},
		onDelete(selection, { next }) {
			ElMessageBox.confirm(`已选择了${selection.length}项，是否继续？`, "提示", {
				type: "error"
			})
				.then(() => {
					// 继续执行删除请求
					next({
						ids: selection.map((e) => e.id)
					});
				})
				.catch(() => null);
		}
	},
	(app) => {
		app.refresh();
	}
);

const Table = useTable({
	columns: [
		{
			label: "ID",
			prop: "id"
		},
		{
			label: "配餐均龄（岁）",
			prop: "cateringAverageAge"
		},
		{
			label: "均龄组",
			prop: "averageAgeGroup"
		},
		// {
		// 	label: "归属租户",
		// 	prop: "tenantId"
		// },
		{
			type: "op",
			width: 250,
			buttons: ["info", "edit", "delete"]
		}
	]
});

const Upsert = useUpsert({
	items: [
		{
			label: "配餐均龄（岁）",
			prop: "cateringAverageAge",
			props: formLabelProps,
			component: {
				name: "el-input-number"
			}
		},
		{
			label: "均龄组",
			prop: "averageAgeGroup",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		}
	],

	dialog: {
		width: "580px"
	},

	plugins: [
		// 自动聚焦
		setFocus("outTime")
	],

	// 详情钩子
	onInfo(data, { next, done }) {
		// 继续请求 info 接口
		// next({
		// 	id: data.id
		// });

		// 直接取列表的数据返回
		done(data);
	},

	// 提交钩子
	onSubmit(data, { next, close, done }) {
		console.log("onSubmit", data);
		// 继续请求 update/add 接口
		next(data);
	},

	// 打开后
	onOpened(data) {
		if (Upsert.value?.mode != "info") {
			ElMessage.success("编辑中");
		}
	},

	// 关闭钩子
	onClose(action, done) {
		if (Upsert.value?.mode == "update") {
			if (action == "close") {
				return ElMessageBox.confirm("还没填完，确定关闭不？", "提示", {
					type: "warning"
				})
					.then(() => {
						done();
						ElMessage.info("好吧");
					})
					.catch(() => {
						ElMessage.success("请继续编辑");
					});
			}
		}

		done();
	}
});
</script>
