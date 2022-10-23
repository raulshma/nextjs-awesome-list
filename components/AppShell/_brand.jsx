import React from 'react';
import {
  Group,
  ActionIcon,
  useMantineColorScheme,
  Box,
  Title,
  Anchor,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { IconSun, IconMoonStars } from '@tabler/icons';

export function Brand() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.md,
        width: '100%',
      })}
    >
      <Group position="apart">
        <Title size="h3">
          <Anchor variant='text' color='orange' onClick={() => router.push('/')}>awesome list</Anchor>
        </Title>
        <ActionIcon
          variant="default"
          onClick={() => toggleColorScheme()}
          size={30}
          sx={(theme) => ({
            marginRight: theme.spacing.md,
          })}
        >
          {colorScheme === 'dark' ? (
            <IconSun size={16} />
          ) : (
            <IconMoonStars size={16} />
          )}
        </ActionIcon>
      </Group>
    </Box>
  );
}
