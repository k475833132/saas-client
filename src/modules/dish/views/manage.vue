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
			<cl-table ref="Table" :span-method="objectSpanMethod"></cl-table>
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
import { useCrud, useTable } from "@cool-vue/crud";
import { ElMessageBox } from "element-plus";
import { onBeforeMount } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

const dishesManagementService = service.dish.dishes_management;
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
			// add: true,
			delete: true,
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

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
	if (columnIndex === 1) {
		if (row.weekX === "星期一") {
			// return {
			// 	rowspan: 5,
			// 	colspan: 1
			// };
		}
	}
};

const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			label: "日期",
			prop: "weekX"
		},
		{
			label: "早餐",
			prop: "breakfast",
			children: [
				{
					label: "食谱",
					prop: "breakfastRecipe"
				},
				{
					label: "食物",
					prop: "breakfastFood"
				},
				{
					label: "重量（单位：g）",
					prop: "breakfastUnit"
				}
			]
		},
		{
			label: "午餐",
			prop: "lunch",
			children: [
				{
					label: "食谱",
					prop: "lunchRecipe"
				},
				{
					label: "食物",
					prop: "lunchFood"
				},
				{
					label: "重量（单位：g）",
					prop: "lunchUnit"
				}
			]
		},
		{
			label: "归属租户",
			prop: "tenantId"
		},
		{
			type: "op",
			width: 250,
			buttons: ["edit"]
		}
	]
});
</script>
