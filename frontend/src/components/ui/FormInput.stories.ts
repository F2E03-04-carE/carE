import type { Meta, StoryObj } from '@storybook/vue3-vite';
import FormInput from './FormInput.vue';

const meta = {
	title: 'UI/FormInput',
	component: FormInput,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'email', 'tel', 'password', 'number'],
			description: 'Input 類型',
		},
		required: {
			control: 'boolean',
			description: '是否必填（顯示紅色星號）',
		},
		error: {
			control: 'text',
			description: '錯誤訊息',
		},
	},
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		label: '店名',
		modelValue: '',
		placeholder: '例如：阿明汽車保養廠',
		required: false,
	},
};

export const Required: Story = {
	args: {
		label: '電話號碼',
		modelValue: '',
		placeholder: '0912345678 或 02-12345678',
		type: 'tel',
		required: true,
	},
};

export const WithError: Story = {
	args: {
		label: '公司統編',
		modelValue: '123',
		placeholder: '請輸入8碼統一編號',
		type: 'text',
		maxlength: 8,
		required: true,
		error: '統編格式錯誤（需8碼數字）',
	},
};

export const Filled: Story = {
	args: {
		label: '負責人姓名',
		modelValue: '王小明',
		placeholder: '請輸入負責人全名',
		required: true,
	},
};
export const EmailType: Story = {
	args: {
		label: '電子信箱',
		modelValue: '',
		placeholder: 'example@email.com',
		type: 'email',
		required: true,
	},
};

export const PasswordType: Story = {
	args: {
		label: '密碼',
		modelValue: '',
		placeholder: '至少8個字元',
		type: 'password',
		required: true,
	},
};
