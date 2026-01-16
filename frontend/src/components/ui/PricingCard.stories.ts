import type { Meta, StoryObj } from '@storybook/vue3-vite';
import PricingCard from './PricingCard.vue';

const meta = {
  title: 'UI/PricingCard',
  component: PricingCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['blue', 'green'],
      description: '卡片主題色系',
    },
    isRecommended: {
      control: 'boolean',
      description: '是否顯示推薦標籤',
    },
  },
} satisfies Meta<typeof PricingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FreeTrial: Story = {
  args: {
    title: '免費試用方案',
    subtitle: '先試用，滿意再升級',
    price: '$0',
    priceUnit: '30 天試用',
    features: ['完整預約管理功能', '評價系統功能', '商家資料展示',],
    buttonText: '開始免費試用',
    color: 'blue',
    isRecommended: false,
  },
};

export const PermanentPlan: Story = {
  args: {
    title: '永久會員方案',
    subtitle: '一次付費，終身使用',
    price: 5555,
    priceUnit: '永久方案',
    features: [
      '完整預約管理功能',
      '評價系統功能',
      '商家資料展示',
      '永久使用權限',
    ],
    buttonText: '立即購買',
    color: 'green',
    isRecommended: true,
  },
};



