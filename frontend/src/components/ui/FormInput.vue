<script setup lang="ts">
import { computed, useId } from 'vue';

export interface FormInputProps {
	label: string;
	modelValue: string;
	type?: string;
	placeholder?: string;
	required?: boolean;
	error?: string;
	maxlength?: number;
	id?: string;
	inputmode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
	pattern?: string;
}

const props = withDefaults(defineProps<FormInputProps>(), {
	type: 'text',
	placeholder: '',
	required: false,
	error: '',
	maxlength: undefined,
	id: undefined,
	inputmode: 'text',
	pattern: undefined,
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
	(e: 'blur'): void;
}>();
const inputId = props.id ?? useId();
const handleInput = (event: Event) => {
	const target = event.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};

const handleBlur = () => {
	emit('blur');
};

const inputBorderClass = computed(() => {
	return props.error
		? 'border-[#c97d7d] focus:border-[#c97d7d] focus:ring-[#c97d7d]/30'
		: 'border-[#e0ddd5] focus:border-[#6B6B5C] focus:ring-[#6B6B5C]/30';
});
</script>

<template>
	<div>
		<label :for="inputId" class="block mb-1 text-[16px] font-medium text-gray-700">
			{{ label }}
			<span v-if="required" class="text-[#c97d7d]">*</span>
		</label>
		<input
			:id="inputId"
			:type="type"
			:value="modelValue"
			:placeholder="placeholder"
			:maxlength="maxlength"
			:inputmode="inputmode"
			:pattern="pattern"
			class="w-full px-4 py-2 text-[16px] transition-colors bg-white border rounded-lg outline-none placeholder:text-gray-400 focus:ring-2"
			:class="inputBorderClass"
			@input="handleInput"
			@blur="handleBlur"
		/>

		<p v-if="error" class="mt-1 text-[14px] text-[#c97d7d]">
			{{ error }}
		</p>
	</div>
</template>
