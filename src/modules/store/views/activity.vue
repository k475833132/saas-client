<template>
	<div class="activity">
		<el-tabs type="card">
			<el-tab-pane label="入库单" class="card-item">
				<Enter/>
			</el-tab-pane>
			<el-tab-pane label="出库单" lazy class="card-item">
				<Out/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" name="store-activity" setup>
import Out from "./out.vue";
import Enter from "./enter.vue";
</script >
<style lang="scss" scoped>
	.activity {
		background-color: var(--el-bg-color);
		padding: 10px;
		height: 100vh;
		box-sizing: border-box;
		.card-item {
			overflow: hidden;
		}
	}
</style>
