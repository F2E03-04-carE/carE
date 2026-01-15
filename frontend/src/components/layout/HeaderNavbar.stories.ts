import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HeaderNavbar from './HeaderNavbar.vue';

const meta = {
  title: 'Layout/HeaderNavbar',
  component: HeaderNavbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    userRole: {
      control: 'select',
      options: ['guest', 'member', 'garage'],
      description: '用戶身份類型',
    },
  },
} satisfies Meta<typeof HeaderNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Guest: Story = {
  args: {
    userRole: 'guest',
  },
};

export const Member: Story = {
  args: {
    userRole: 'member',
  },
};

export const Garage: Story = {
  args: {
    userRole: 'garage',
  },
};

export const GuestMobile: Story = {
  args: {
    userRole: 'guest',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MemberMobile: Story = {
  args: {
    userRole: 'member',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const GarageMobile: Story = {
  args: {
    userRole: 'garage',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
