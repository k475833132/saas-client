<template>
	<div class="nutrition">
		<el-tabs type="card">
			<el-tab-pane label="当日营养分析">
				<day />
			</el-tab-pane>
			<el-tab-pane label="一周营养分析" lazy>
				<week />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts" name="store-nutrition" setup>
import Day from "./nutritionAnalysisAfTheDay.vue";
import Week from "./nutritionAnalysisAfTheWeek.vue";
</script>
<style lang="scss" scoped>
.nutrition {
	background-color: var(--el-bg-color);
	padding: 10px;
	height: 100%;
	box-sizing: border-box;
}
</style>
