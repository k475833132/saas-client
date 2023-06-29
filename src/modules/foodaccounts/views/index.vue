<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-filter label="状态筛选">
				<cl-select :options="TYPE" prop="type" />
			</cl-filter>
			<cl-adv-btn />
			<cl-export-btn :columns="Table?.columns" />
			<cl-refresh-btn />
		</cl-row>
		<cl-row>
			<cl-table ref="Table" show-summary :summary-method="onSummaryMethod">
				<template #column-proofPicture="{ scope }">
					<el-image
						style="width: 100px; height: 100px"
						:src="scope.row.proofPicture"
						:fit="fits"
					/>
				</template>
			</cl-table>
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
import { h, onBeforeMount, ref, resolveComponent, computed } from "vue";
import { useCrud, useTable, useUpsert, useAdvSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { ElMessage, ElMessageBox } from "element-plus";
import { TYPE, DIC_TYPE, OUTCOME_TYPE, INCOME_TYPE } from '/@/common/enums';

const { service } = useCool();

const foodAccountsService = service.foodaccount.foodaccount;
const formLabelProps = { labelWidth: "160px" };
const fits = ["fill", "contain", "cover", "none", "scale-down"];

function fetchList() {
	foodAccountsService.page({ size: 20, page: 1 }).then((res) => {
		console.log(res, "res");
	});
}

// 合计
function onSummaryMethod({ data }: { data: any[] }) {
	return ['', '总收入', '200' , '总支出', '50', '利润', '150'];
}

onBeforeMount(() => {
	fetchList();
});
// cl-crud
const Crud = useCrud(
	{
		service: foodAccountsService,
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
			label: "申请时间",
			prop: "applyTime"
		},
		{
			label: "名称",
			prop: "name"
		},
		{
			label: "类型",
			prop: "type",
			dict: DIC_TYPE.type
		},
		{
			label: '二级类型',
			prop: 'subType',
			formatter: row => {
				if (row.type) {
					return OUTCOME_TYPE.find(item => item.value === row.subType)?.label;
				}
				else {
					return INCOME_TYPE.find(item => item.value === row.subType)?.label;
				}
			}
		},
		{
			label: '申请人',
			prop: 'applyer'
		},
		{
			label: '联系方式',
			prop: 'contact'
		},
		{
			label: '金额',
			prop: 'price',
			formatter: row => `￥${row.price}`
		},
		{
			label: '证图',
			prop: 'proofPicture'
		},
		{
			label: '发票类型',
			prop: 'invoiceType'
		},
		{
			label: '发票文件',
			prop: 'invoiceFile'
		},
		{
			label: '发票金额',
			prop: 'invoiceAmount'
		},
		{
			label: '银行回执单',
			prop: 'bankRepId'
		},
		{
			label: '银行流水号',
			prop: 'bankRepNumber'
		},
		{
			label: '备注',
			prop: 'remark'
		},
		{
			label: '附件',
			prop: 'attachment'
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
			label: "申请时间",
			prop: "applyTime",
			props: formLabelProps,
			component: {
				name: "el-time-picker",
			}
		},
		{
			label: "名称",
			prop: "name",
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
				name: "el-select",
				options: TYPE
			}
		},
		{
			label: "二级类型",
			prop: "subType",
			props: formLabelProps,
			component: {
				name: "el-select",
				options: computed(() => {
					return Upsert.value?.getForm().type ? OUTCOME_TYPE : INCOME_TYPE
				})
			}
		},
		{
			label: "申请人",
			prop: "applyer",
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
			label: "金额",
			prop: "price",
			props: formLabelProps,
			component: {
				name: "el-input-number"
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
			label: "发票类型",
			prop: "invoiceType",
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: '发票文件',
			prop: 'invoiceFile',
			props: formLabelProps,
			component: {
				name: "cl-upload"
			}
		},
		{
			label: '发票金额',
			prop: 'invoiceAmount',
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: '银行回执单',
			prop: 'bankRepId',
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: '银行流水号',
			prop: 'bankRepNumber',
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: '备注',
			prop: 'remark',
			props: formLabelProps,
			component: {
				name: "el-input"
			}
		},
		{
			label: '附件',
			prop: 'attachment',
			props: formLabelProps,
			component: {
				name: "cl-upload"
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
	},
});
console.log('Upsert', Upsert)
const AdvSearch = useAdvSearch({
	items: [
		{
			label: '申请时间',
			prop: "applyTime",
			component: {
				name: "el-time-picker",
			}
		}
	]
});
</script>
