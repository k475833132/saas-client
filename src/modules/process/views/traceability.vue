<template>
	<div class="template">
		<div class="template-machining">
			<Machining
				:show="false"
				:ref="setRefs('MachiningRef')"
			/>
		</div>
		<div class="template-manifest">
			<Manifest
				:show="false"
				:ref="setRefs('manifestRef')"
			/>
		</div>
	</div>
</template>

<script lang="ts" name="process-traceability" setup>
import { useCrud, useAdvSearch } from "@cool-vue/crud";
import { DefineComponent, ref, onMounted, onBeforeMount, nextTick } from "vue";
import { useCool } from "/@/cool";
import Machining from './machining.vue';
import Manifest from './manifest.vue';

const { refs, setRefs } = useCool();

const initManifestData = () => {
	refs.manifestRef.fetchList();
	refs.MachiningRef.fetchList();
}

onBeforeMount(() => {
	console.log('sadasdasdas')
	nextTick(() => {
		initManifestData();
	})
});


</script>
<style lang="scss" scoped>
.template {
	height: 100vh;
	display: flex;
	flex-direction: column;
	&-machining {
		flex: 1;
	}
	&-manifest {
		flex: 1;
	}
}
</style>
