import { useState } from 'react';
import {
  AppShell,
  Navbar,
  Header,
  MediaQuery,
  Burger,
  useMantineTheme,
} from '@mantine/core';
import { Brand } from './_brand';
import { User } from './_user';
import { MainLinks } from './_links';

export default function MainAppShell({ children }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      header={
        <Header height={50} p="xs">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Brand />
          </div>
        </Header>
      }
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 250, lg: 260 }}
          fixed={false}
          position={{ top: 0, left: 0 }}
        >
          <Navbar.Section grow mt="xs">
            <MainLinks />
          </Navbar.Section>
          <Navbar.Section>
            <User />
          </Navbar.Section>
        </Navbar>
      }
    >
      {children}
    </AppShell>
  );
}
