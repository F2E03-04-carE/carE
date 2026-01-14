import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HeaderNavbar from './HeaderNavbar.vue';

const meta = {
  title: 'Layout/HeaderNavbar',
  component: HeaderNavbar,
  parameters: {
    // 使用全螢幕佈局以正確展示 header
    layout: 'fullscreen',
  },
  // 自動生成文件
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
  args: {},
};


export const Mobile: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};


export const Tablet: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
