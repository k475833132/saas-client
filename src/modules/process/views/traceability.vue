<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-adv-btn />
			<!-- <cl-export-btn :columns="Table?.columns" /> -->
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

<script lang="ts" name="process-traceability" setup>
import { useCrud, useAdvSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-crud
const Crud = useCrud({ service: service.base.sys.role }, (app) => {
	app.refresh();
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
