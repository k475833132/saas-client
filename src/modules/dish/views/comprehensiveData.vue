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
			add: true,
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

const Table = useTable({
	columns: [
		{
			type: "selection",
			width: 60
		},
		{
			label: "ID",
			prop: "id"
		},
		{
			label: "入库时间",
			prop: "enterTime"
		},
		{
			label: "采购人",
			prop: "buyer"
		},
		{
			label: "保管时间",
			prop: "purchaseTime"
		},
		{
			label: "内容",
			prop: "content",
			children: [
				{
					label: "货物名称",
					prop: "goodsName"
				},
				{
					label: "货物品类",
					prop: "goodsType"
				},
				{
					label: "数量",
					prop: "count"
				},
				{
					label: "单位",
					prop: "unit"
				},
				{
					label: "供应商",
					prop: "supplier"
				},
				{
					label: "金额",
					prop: "price"
				}
			]
		},
		{
			label: "附件",
			prop: "attachment"
		},
		{
			type: "op",
			width: 250,
			buttons: ["info", "edit", "delete"]
		}
	]
});
</script>
