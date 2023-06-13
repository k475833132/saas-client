<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-export-btn :columns="Table?.columns" />
			<cl-refresh-btn />
		</cl-row>
		<cl-row>
			<cl-table ref="Table" :border="false"></cl-table>
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { h, onBeforeMount, reactive } from "vue";
import { useTable, useUpsert, useCrud, setFocus } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";
import { useDict } from "/$/dict";

const { service } = useCool();

const tenantService = service.tenant.tenant;

const formLabelProps = { labelWidth: "100px" };

// 字典
const { dict } = useDict();

// 选项
const options = reactive({
	status: [
		{
			label: "启用",
			value: true
		},
		{
			label: "禁用",
			type: "danger",
			value: false
		}
	]
});

// cl-crud
const Crud = useCrud(
	{
		service: tenantService,
		permission: {
			add: true,
			edit: true,
			update: true,
			info: true
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

function fetchList() {
	tenantService.page({ size: 20, page: 1 }).then((res) => {
		console.log(res, "res");
	});
}

onBeforeMount(() => {
	fetchList();
});

// 表格
const Table = useTable({
	columns: [
		{
			label: "ID",
			prop: 'id'
		},
		{
			label: "租户名称",
			prop: "tenantName"
		},
		{
			label: "地址",
			prop: "address"
		},
		{
			label: "负责人",
			prop: "principal"
		},
		{
			label: "联系方式",
			prop: "contact"
		},
		{
			label: "启用/禁用",
			prop: "enable",
			dict: options.status
		},
		{
			type: "op",
			width: 250,
			buttons: ["edit", "info"]
		}
	]
});

// 新增、编辑
const Upsert = useUpsert({
	items: [
		{
			label: "租户名称",
			prop: "tenantName",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "地址",
			prop: "address",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "负责人",
			prop: "principal",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "联系方式",
			prop: "contact",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "启用/禁用",
			prop: "enable",
			props: formLabelProps,
			component: {
				name: "el-select",
				options: [
					{
						label: "启用",
						value: true
					},
					{
						label: "禁用",
						value: false
					}
				]
			}
		}
	],

	dialog: {
		width: "580px"
	},

	plugins: [
		// 自动聚焦
		setFocus("tenantName")
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
		data.enable = data.enable === 1 ? true : false;
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
