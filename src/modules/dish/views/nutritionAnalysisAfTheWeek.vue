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
			<cl-table ref="Table" style="max-height: none"></cl-table>
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<!-- 分页 -->
			<cl-pagination :page-size="100" :hide-on-single-page="true" />
		</cl-row>
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { useCrud, useTable } from "@cool-vue/crud";
import { ElMessageBox } from "element-plus";
import { onBeforeMount } from "vue";
import { useCool } from "/@/cool";

const { service } = useCool();

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

const dishesManagementService = service.dish.nutrition_week_analysis;
const formLabelProps = { labelWidth: "160px" };

function fetchList() {
	dishesManagementService.page({ size: 50, page: 1 }).then((res) => {
		res.list.forEach((item, index) => {
			if (item.weekX === "星期一") {
				objectSpan.mondayLine++;
				if (objectSpan.mondayRow == null) {
					objectSpan.mondayRow = index;
				}
			} else if (item.weekX === "星期二") {
				objectSpan.tuesdayLine++;
				if (objectSpan.tuesdayRow == null) {
					objectSpan.tuesdayRow = index;
				}
			} else if (item.weekX === "星期三") {
				objectSpan.wednesdayLine++;
				if (objectSpan.wednesdayRow == null) {
					objectSpan.wednesdayRow = index;
				}
			} else if (item.weekX === "星期四") {
				objectSpan.thursdayLine++;
				if (objectSpan.thursdayRow == null) {
					objectSpan.thursdayRow = index;
				}
			} else if (item.weekX === "星期五") {
				objectSpan.fridayLine++;
				if (objectSpan.fridayRow == null) {
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
			label: "营养",
			prop: "typeStandard"
		},
		{
			label: "热量（kcal）",
			children: [
				// {
				// 	label: "总量",
				// 	prop: "heatSum",
				// 	formatter: (row) => {
				// 		if (row.typeStandard === "在校实给%") {
				// 			return row.heatSum + "%";
				// 		}
				// 		return row.heatSum;
				// 	}
				// },
				{
					label: "碳水热",
					prop: "carbs",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.carbs + "%";
						}
						return row.carbs;
					}
				},
				{
					label: "脂肪热",
					prop: "fatFever",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.fatFever + "%";
						}
						return row.fatFever;
					}
				}
			]
		},
		{
			label: "蛋白质（g）",
			children: [
				// {
				// 	label: "总量",
				// 	prop: "proteinSum",
				// 	formatter: (row) => {
				// 		if (row.typeStandard === "在校实给%") {
				// 			return row.proteinSum + "%";
				// 		}
				// 		return row.proteinSum;
				// 	}
				// },
				{
					label: "动物类/动豆类",
					prop: "animalsAndBeans",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.proteinSum + "%";
						}
						return row.proteinSum;
					}
				}
			]
		},
		{
			label: "钙",
			children: [
				{
					label: "（mg）",
					prop: "calcium",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.calcium + "%";
						}
						return row.calcium;
					}
				}
			]
		},
		{
			label: "维 A/维 B1",
			children: [
				{
					label: "（ug）",
					prop: "DimensionAAndB1",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.DimensionAAndB1 + "%";
						}
						return row.DimensionAAndB1;
					}
				}
			]
		},
		{
			label: "维 B2",
			children: [
				{
					label: "（mg）",
					prop: "DimensionB2",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.DimensionB2 + "%";
						}
						return row.DimensionB2;
					}
				}
			]
		},
		{
			label: "维 C",
			children: [
				{
					label: "（mg）",
					prop: "DimensionC",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.DimensionC + "%";
						}
						return row.DimensionC;
					}
				}
			]
		},
		{
			label: "维 E/维PP",
			children: [
				{
					label: "（mg）",
					prop: "DimensionEAndPP",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.DimensionEAndPP + "%";
						}
						return row.DimensionEAndPP;
					}
				}
			]
		},
		{
			label: "钾",
			children: [
				{
					label: "（mg）",
					prop: "potassium",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.potassium + "%";
						}
						return row.potassium;
					}
				}
			]
		},
		{
			label: "镁",
			children: [
				{
					label: "（mg）",
					prop: "magnesium",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.magnesium + "%";
						}
						return row.magnesium;
					}
				}
			]
		},
		{
			label: "铁/锌",
			children: [
				{
					label: "（mg）",
					prop: "ironAndZinc",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.ironAndZinc + "%";
						}
						return row.ironAndZinc;
					}
				}
			]
		},
		{
			label: "磷",
			children: [
				{
					label: "（mg）",
					prop: "phosphorus",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.phosphorus + "%";
						}
						return row.phosphorus;
					}
				}
			]
		},
		{
			label: "硒",
			children: [
				{
					label: "（mg）",
					prop: "selenium",
					formatter: (row) => {
						if (row.typeStandard === "在校实给%") {
							return row.selenium + "%";
						}
						return row.selenium;
					}
				}
			]
		},
		{
			label: "评价",
			prop: "evaluate"
		},
		{
			type: "op",
			width: 250,
			buttons: ["edit"]
		}
	]
});
</script>
