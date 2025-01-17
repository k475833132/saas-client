<template>
	<cl-crud ref='Crud'>
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-adv-btn />
			<cl-export-btn :columns='Table?.columns' :filename="'入库单'" />
			<cl-refresh-btn />
		</cl-row>
		<cl-row>
			<cl-table style='max-height: none;' ref='Table'></cl-table>
		</cl-row>
		<cl-row>
			<cl-flex1 />
			<!-- 分页 -->
			<cl-pagination />
		</cl-row>
		<cl-upsert ref='Upsert' />
		<cl-adv-search ref='AdvSearch' />
	</cl-crud>
</template>

<script lang='ts' setup>
import { h, onBeforeMount, ref, resolveComponent } from 'vue';
import { useCrud, useTable, useUpsert, useAdvSearch, setFocus } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { ElMessage, ElMessageBox } from 'element-plus';
import { GOODS_TYPE } from '/@/common/enums';

const { service } = useCool();

const storeEnterService = service.store.enter;
const formLabelProps = { labelWidth: '160px' };

function fetchList() {
	storeEnterService.page({ size: 20, page: 1 }).then((res) => {
		console.log(res, 'res');
	});
}

onBeforeMount(() => {
	fetchList();
});
// cl-crud
const Crud = useCrud(
	{
		service: storeEnterService,
		permission: {
			add: true,
			delete: true,
			update: true,
			info: true,
			edit: true
		},
		onDelete(selection, { next }) {
			ElMessageBox.confirm(`已选择了${selection.length}项，是否继续？`, '提示', {
				type: 'error'
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
			type: 'selection',
			width: 60
		},
		{
			label: 'ID',
			prop: 'id'
		},
		{
			label: '入库时间',
			prop: 'enterTime'
		},
		{
			label: '采购人',
			prop: 'buyer'
		},
		{
			label: '保管时间',
			prop: 'purchaseTime'
		},
		{
			label: '内容',
			prop: 'content',
			children: [
				{
					label: '货物名称',
					prop: 'goodsName',
				},
				{
					label: '货物品类',
					prop: 'goodsType',
					formatter: row => GOODS_TYPE.find(item => item.value === row.goodsType)!.label
				},
				{
					label: '数量',
					prop: 'count'
				},
				{
					label: '单位',
					prop: 'unit'
				},
				{
					label: '供应商',
					prop: 'supplier'
				},
				{
					label: '金额',
					prop: 'price'
				}
			]
		},
		{
			label: '附件',
			prop: 'attachment'
		},
		{
			type: 'op',
			width: 250,
			buttons: ['info', 'edit', 'delete']
		}
	]
});
const Upsert = useUpsert({
	items: [
		{
			label: '入库时间',
			prop: 'enterTime',
			props: formLabelProps,
			component: {
				name: 'el-date-picker'
			}
		},
		{
			label: '采购人',
			prop: 'buyer',
			props: formLabelProps,
			component: {
				name: 'el-input'
			}
		},
		{
			label: '保管时间',
			prop: 'purchaseTime',
			props: formLabelProps,
			component: {
				name: 'el-date-picker'
			}
		},
		{
			label: '货物名称',
			prop: 'goodsName',
			props: formLabelProps,
			component: {
				name: 'el-input'
			}
		},
		{
			label: '货物品类',
			prop: 'goodsType',
			props: formLabelProps,
			component: {
				name: 'el-select',
				options: GOODS_TYPE
			}
		},
		{
			label: '数量',
			prop: 'count',
			props: formLabelProps,
			component: {
				name: 'el-input-number',
			}
		},
		{
			label: '单位',
			prop: 'unit',
			props: formLabelProps,
			component: {
				name: 'el-input'
			}
		},
		{
			label: '供应商',
			prop: 'supplier',
			props: formLabelProps,
			component: {
				name: 'el-input'
			}
		},
		{
			label: '金额',
			prop: 'price',
			props: formLabelProps,
			component: {
				name: 'el-input-number',
			}
		},
		{
			label: '附件',
			prop: 'attachment',
			props: formLabelProps,
			component: {
				name: 'cl-upload',
				type: ['file', 'image'],
				props: {
					text: "上传附件",
					multiple: true
				}
			}
		}
	],

	dialog: {
		width: '580px'
	},

	plugins: [
		// 自动聚焦
		setFocus('enterTime')
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
			label: 'ID',
			prop: 'id',
			component: {
				name: 'el-input'
			}
		},
		{
			label: '时间',
			prop: 'sampleDate',
			component: {
				name: 'el-time-picker',
			}
		}
	]
});
</script>
