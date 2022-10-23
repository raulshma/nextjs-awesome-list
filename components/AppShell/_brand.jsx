import React from 'react';
import {
  Group,
  ActionIcon,
  useMantineColorScheme,
  Box,
  Title,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons';

export function Brand() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box
      sx={(theme) => ({
        paddingLeft: theme.spacing.md,
        width: '100%',
      })}
    >
      <Group position="apart">
        <Title size="h3">awesome list</Title>
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
