import React from 'react';
import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  Box,
  useMantineTheme,
} from '@mantine/core';
import { useUser } from '@supabase/auth-helpers-react';

export function User() {
  const theme = useMantineTheme();
  const user = useUser();

  if (!user) return <></>;
  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `1px solid ${
          theme.colorScheme === 'dark'
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <UnstyledButton
        sx={{
          display: 'block',
          width: '100%',
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color:
            theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[0],
          },
        }}
      >
        <Group>
          <Avatar
            src={
              user?.user_metadata?.picture ?? user?.user_metadata?.avatar_url
            }
            radius="xl"
          />
          <Box sx={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {user?.user_metadata?.full_name}
            </Text>
            <Text color="dimmed" size="xs">
              {user?.user_metadata?.email}
            </Text>
          </Box>
        </Group>
      </UnstyledButton>
    </Box>
  );
}
