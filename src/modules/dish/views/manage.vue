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

<script lang="ts" name="dish-manage" setup>
import { useCrud } from "@cool-vue/crud";
import { useCool } from "/@/cool";

const { service } = useCool();

// cl-crud
const Crud = useCrud({ service: service.base.sys.role }, (app) => {
	app.refresh();
});
</script>
