import type { Meta, StoryObj } from '@storybook/vue3-vite';
import HeaderNavbar from './HeaderNavbar.vue';

const meta = {
  title: 'Layout/HeaderNavbar',
  component: HeaderNavbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderNavbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
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

export const MobileMenuOpen: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const menuButton = canvas.querySelector('button[aria-label="開啟選單"]') as HTMLButtonElement;
    if (menuButton) {
      menuButton.click();
    }
  },
};
