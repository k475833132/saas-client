<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
			<cl-refresh-btn />
		</cl-row>
		<cl-row>
			<cl-table ref="Table">
				<template #column-proofPicture="{ scope }">
					<el-image
						style="width: 100px; height: 100px"
						:src="scope.row.proofPicture"
						:fit="fits"
					/>
				</template>
			</cl-table>
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { h, onBeforeMount } from "vue";
import { useTable, useUpsert, useCrud } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";

const { service } = useCool();

const recordService = service.records.record;

const formLabelProps = { labelWidth: "160px" };

const fits = ["fill", "contain", "cover", "none", "scale-down"];

// cl-crud
const Crud = useCrud(
	{
		service: recordService,
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

function fetchList() {
	recordService.page({ size: 20, page: 1 }).then((res) => {
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
			type: "selection",
			width: 60
		},
		{
			label: "项目类型",
			prop: "projectType"
		},
		{
			label: "项目名称",
			prop: "projectName"
		},
		{
			label: "开始时间",
			prop: "startingTime",
			showOverflowTooltip: true,
			formatter: (row) => {
				// TODO 需要格式化
				return dayjs(row.startingTime).format("YYYY-MM-DD HH-MM");
			}
		},
		{
			label: "持续时长（分钟）",
			prop: "duration"
		},
		{
			label: "结束时间",
			prop: "endTime"
		},
		{
			label: "项目目标",
			prop: "projectObjectives"
		},
		{
			label: "负责人",
			prop: "principal"
		},
		{
			label: "监督人",
			prop: "supervisor"
		},
		{
			label: "证图",
			prop: "proofPicture"
		},
		{
			label: "备注",
			prop: "remark"
		},
		{
			type: "op",
			width: 250,
			buttons: ["info", "edit", "delete"]
		}
	]
});

// 新增、编辑
const Upsert = useUpsert({
	items: [
		{
			label: "项目名称",
			prop: "projectName",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "开始时间",
			prop: "startingTime",
			props: formLabelProps,
			component: {
				name: "el-time-picker"
			}
		},
		{
			label: "持续时长（分钟）",
			prop: "duration",
			props: formLabelProps,
			component: {
				name: "el-input",
				props: {
					type: "number",
					maxLength: 3,
					onChange: (e: any) => {
						const temp = e.target.value.replace(/[^\d]/g, "");
						return temp;
					}
				}
			}
		},
		{
			label: "项目目标",
			prop: "projectObjectives",
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
			label: "监督人",
			prop: "supervisor",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "证图",
			prop: "proofPicture",
			props: formLabelProps,
			component: {
				name: "cl-upload"
			}
		},
		{
			label: "备注",
			prop: "remark",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		}
	],

	dialog: {
		width: "580px"
	},

	// // 插件
	// plugins: [
	// 	// 自动聚焦
	// 	setFocus("name")
	// ],

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
