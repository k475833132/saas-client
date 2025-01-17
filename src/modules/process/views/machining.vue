<template>
	<cl-crud ref="Crud">
		<cl-row v-if="props.show">
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-adv-btn />
			<cl-export-btn :columns="Table?.columns" />
			<cl-refresh-btn />
		</cl-row>
        <cl-row v-else>
            <h3>出货单ID: xxxx</h3>
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
		<cl-adv-search ref="AdvSearch" />
	</cl-crud>
</template>

<script lang="ts" setup>
import { h, onBeforeMount, ref, resolveComponent, defineExpose } from "vue";
import { useCrud, useTable, useUpsert, useAdvSearch } from "@cool-vue/crud";
import { defineProps } from 'vue'
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps({
    show: {
        type: Boolean,
        default: true,
    },
});

const { service } = useCool();

const machiningService = service.process.machining;
const formLabelProps = { labelWidth: "160px" };

function fetchList() {
	machiningService.page({ size: 20, page: 1 }).then((res) => {
		console.log(res, "res");
	});
}

onBeforeMount(() => {
	fetchList();
});

defineExpose({fetchList});
// cl-crud
const Crud = useCrud(
	{
		service: machiningService,
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
			label: "归属租户",
			prop: "company"
		},
		{
			label: "流程名称",
			prop: "processName"
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
			label: '类型',
			prop: 'type'
		},
		{
			label: '工艺',
			prop: 'technology'
		},
		{
			label: '外键ID',
			prop: 'foreignID'
		},
		{
			label: '货品内容',
			prop: 'goodsContent'
		},
		{
			label: '货物数量',
			prop: 'goodsCount'
		},
		{
			label: '出品ID',
			prop: 'productID'
		},
		{
			label: '出品时间',
			prop: 'productDate'
		},
		{
			label: '出品内容',
			prop: 'productContent'
		},
		{
			label: '出品数量',
			prop: 'productCount'
		},
		{
			label: '单位',
			prop: 'unit'
		},
		{
			type: "op",
			width: 250,
			buttons: ['info', 'edit', 'delete']
		}
	]
});

const Upsert = useUpsert({
	items: [
		{
			label: "归属租户",
			prop: "company",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "流程名称",
			prop: "processName",
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
			label: "类型",
			prop: "type",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "工艺",
			prop: "technology",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "外键ID",
			prop: "foreignID",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "货品内容",
			prop: "goodsContent",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "货物数量",
			prop: "goodsCount",
			props: formLabelProps,
			component: {
				name: "el-input-number"
			}
		},
		{
			label: "出品ID",
			prop: "productID",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "出品时间",
			prop: "productDate",
			props: formLabelProps,
			component: {
				name: "el-time-picker"
			}
		},
		{
			label: "出品内容",
			prop: "productContent",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: "出品数量",
			prop: "productCount",
			props: formLabelProps,
			component: {
				name: "el-input-number"
			}
		},
		{
			label: "单位",
			prop: "unit",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
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

const AdvSearch = useAdvSearch({
	items: [
		{
			label: "日期",
			prop: "sampleDate",
			component: {
				name: "el-time-picker",
			}
		}
	]
});
</script>
