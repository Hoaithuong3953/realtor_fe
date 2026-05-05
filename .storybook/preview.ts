import '@/styles/index.css'

import type { Preview } from '@storybook/react-vite'

type ThemeMode = 'light' | 'dark' | 'system'
type RootElementLike = {
  classList?: {
    toggle?: (token: string, force?: boolean) => void
  }
  style?: {
    colorScheme?: string
  }
}

type StorybookGlobalLike = {
  document?: {
    documentElement?: RootElementLike
  }
  matchMedia?: (query: string) => { matches: boolean }
}

function resolveThemeMode(raw: unknown): ThemeMode {
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'light'
}

function getResolvedAppearance(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') {
    return mode
  }
  const browserGlobal = globalThis as unknown as StorybookGlobalLike
  const prefersDark =
    browserGlobal.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  return prefersDark ? 'dark' : 'light'
}

function applyDocumentTheme(resolved: 'light' | 'dark'): void {
  const browserGlobal = globalThis as unknown as StorybookGlobalLike
  const root = browserGlobal.document?.documentElement
  root?.classList?.toggle?.('dark', resolved === 'dark')
  if (root?.style) {
    root.style.colorScheme = resolved
  }
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme mode',
      defaultValue: 'system',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const rawTheme: unknown = (
        context as { globals?: { theme?: unknown } }
      ).globals?.theme
      const mode = resolveThemeMode(rawTheme)
      applyDocumentTheme(getResolvedAppearance(mode))
      return Story()
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    backgrounds: {
      default: 'theme',
      values: [{ name: 'theme', value: 'var(--background)' }],
    },
  },
}

export default preview