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
			<cl-pagination :page-size="100" :hide-on-single-page="true" />
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

const objectSpan = {
	mondayLine: 0,
	mondayRow: null,
	tuesdayLine: 0,
	tuesdayRow: null,
	wednesdayLine: 0,
	wednesdayRow: null,
	thursdayLine: 0,
	thursdayRow: null,
	fridayLine: 0,
	fridayRow: null
};

function fetchList() {
	dishesManagementService.page({ size: 100, page: 1 }).then((res) => {
		res.list.forEach((item, index) => {
			if (item.weekX === "星期一") {
				objectSpan.mondayLine++;
				if (objectSpan.mondayRow === null) {
					objectSpan.mondayRow = index;
				}
			} else if (item.weekX === "星期二") {
				objectSpan.tuesdayLine++;
				if (objectSpan.tuesdayRow === null) {
					objectSpan.tuesdayRow = index;
				}
			} else if (item.weekX === "星期三") {
				objectSpan.wednesdayLine++;
				if (objectSpan.wednesdayRow === null) {
					objectSpan.wednesdayRow = index;
				}
			} else if (item.weekX === "星期四") {
				objectSpan.thursdayLine++;
				if (objectSpan.thursdayRow === null) {
					objectSpan.thursdayRow = index;
				}
			} else if (item.weekX === "星期五") {
				objectSpan.fridayLine++;
				if (objectSpan.fridayRow === null) {
					objectSpan.fridayRow = index;
				}
			}
		});
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
		app.refresh({ size: 50, page: 1 });
	}
);

const objectSpanMethod = ({ column, rowIndex, columnIndex }: any) => {
	if ([0, 1].includes(columnIndex) || column.type === "op") {
		if (rowIndex === objectSpan.mondayRow) {
			return {
				rowspan: objectSpan.mondayLine,
				colspan: 1
			};
		} else if (rowIndex === objectSpan.tuesdayRow) {
			return {
				rowspan: objectSpan.tuesdayLine,
				colspan: 1
			};
		} else if (rowIndex === objectSpan.wednesdayRow) {
			return {
				rowspan: objectSpan.wednesdayLine,
				colspan: 1
			};
		} else if (rowIndex === objectSpan.thursdayRow) {
			return {
				rowspan: objectSpan.thursdayLine,
				colspan: 1
			};
		} else if (rowIndex === objectSpan.fridayRow) {
			return {
				rowspan: objectSpan.fridayLine,
				colspan: 1
			};
		} else {
			return {
				rowspan: 0,
				colspan: 0
			};
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
