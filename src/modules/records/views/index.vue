<template>
	<cl-crud ref="Crud">
		<cl-row>
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</cl-row>
	</cl-crud>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue";
import { useCrud } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-crud
const Crud = useCrud({ service: service.records.record }, (app) => {
	app.refresh();
});

function fetchList() {
	service.records.record.page({ size: 20, page: 1 }).then((res) => {
		console.log(res, "res");
	});
}

onBeforeMount(() => {
	fetchList();
});
console.log(service, "222");
</script>
