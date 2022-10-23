import '../styles/globals.css';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import Head from 'next/head';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import MainAppShell from '../components/AppShell/AppShell';

function MyApp({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <>
      <Head>
        <title>awesome list</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{ colorScheme, fontFamily: 'Merriweather Sans' }}
        >
          <SessionContextProvider
            supabaseClient={supabaseClient}
            initialSession={pageProps.initialSession}
          >
            <MainAppShell>
              <Component {...pageProps} />
            </MainAppShell>
          </SessionContextProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

export default MyApp;
