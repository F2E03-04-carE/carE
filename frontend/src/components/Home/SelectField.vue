<template>
	<label
		:for="id"
		class="flex flex-row justify-start items-center mb-2 text-[16px] text-left text-[#8a8a7d]"
	>
		<span class="material-symbols-outlined mr-2"> {{ icon }} </span>
		{{ label }}
	</label>
	<div>
		<select
			:name="name"
			:id="id"
			class="block w-full px-[10px] py-[11px] text-[#4c4c46] bg-[#f5f4f0] outline-[1px] outline-[#e0e0db] rounded"
		>
			<option value="" selected disabled>{{ placeholder }}</option>
			<option v-for="option in options" :key="option.value" :value="option.value">
				{{ option.label }}
			</option>
		</select>
	</div>
</template>

<script setup lang="ts">
type SelectOption = {
	value: string
	label: string
}

type SelectFieldProps = {
	id: string
	name: string
	label: string
	icon: string
	placeholder: string
	options: SelectOption[]
}

defineProps<SelectFieldProps>()
</script>
