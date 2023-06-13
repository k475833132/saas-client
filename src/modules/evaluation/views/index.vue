<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-flex1 />
			<cl-adv-btn />
			<cl-export-btn :columns="Table?.columns" />
			<cl-refresh-btn />
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
import { h, onBeforeMount, ref, resolveComponent } from "vue";
import { useCrud, useTable, useUpsert, useAdvSearch, setFocus } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";
import { EVALUATE_TYPE, DIC_EVALUATE_TYPE } from "../../../common/enums";

const { service } = useCool();

const sampleService = service.evaluation.evaluation;
const formLabelProps = { labelWidth: "160px" };

function fetchList() {
	sampleService.page({ size: 20, page: 1 }).then((res) => {
		console.log(res, "res");
	});
}

onBeforeMount(() => {
	fetchList();
});
// cl-crud
const Crud = useCrud(
	{
		service: sampleService,
		permission: {
			add: true,
			info: true,
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
			label: 'ID',
			prop: 'id',
			width: 60
		},
		{
			label: '归属公司',
			prop: 'company'
		},
		{
			label: '评价类型',
			prop: 'type',
			dict: DIC_EVALUATE_TYPE.type
		},
		{
			label: '评价内容',
			prop: 'content'
		},
		{
			label: '评价时间',
			prop: 'createTime'
		},
		{
			type: 'op',
			width: 100,
			buttons: ['info']
		}
	]
});
const Upsert = useUpsert({
	items: [
		{
			label: '评价类型',
			prop: 'type',
			props: formLabelProps,
			component: {
				name: 'el-select',
				options: EVALUATE_TYPE
			}
		},
		{
			label: '评价内容',
			prop: 'content',
			props: formLabelProps,
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					autosize:{
						minRows: 8
					}
				}
			}
		}
	],

	dialog: {
		width: '580px'
	},

	// 插件
	plugins: [
		// 自动聚焦
		setFocus('type')
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
		console.log('onSubmit', data);
		// 继续请求 update/add 接口
		next(data);
	},

	// 打开后
	onOpened(data) {
		if (Upsert.value?.mode != 'info') {
			ElMessage.success('编辑中');
		}
	},

	// 关闭钩子
	onClose(action, done) {
		if (Upsert.value?.mode == 'update') {
			if (action == 'close') {
				return ElMessageBox.confirm('还没填完，确定关闭不？', '提示', {
					type: 'warning'
				})
					.then(() => {
						done();
						ElMessage.info('好吧');
					})
					.catch(() => {
						ElMessage.success('请继续编辑');
					});
			}
		}

		done();
	}
});

const AdvSearch = useAdvSearch({
	items: [
		{
			label: '归属公司',
			prop: 'id',
			component: {
				name: 'el-input'
			}
		},
		{
			label: '评价类型',
			prop: 'type',
			component: {
				name: 'el-select',
				options: EVALUATE_TYPE
			}
		}
	]
});
</script>
