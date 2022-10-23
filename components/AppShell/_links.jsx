import React from 'react';
import {
  IconGitPullRequest,
  IconAlertCircle,
  IconMessages,
  IconDatabase,
  IconBrandGithub,
} from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text, Anchor } from '@mantine/core';

function MainLink({ icon, color, label, link }) {
  return (
    <UnstyledButton
      sx={(theme) => ({
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
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        {link ? (
          <Anchor variant="text" href={link} target="_blank">
            {label}
          </Anchor>
        ) : (
          <Text size="sm">{label}</Text>
        )}
      </Group>
    </UnstyledButton>
  );
}

const data = [
  {
    icon: <IconBrandGithub size={16} />,
    color: 'blue',
    label: 'github',
    link: 'https://github.com/raulshma',
  },
  { icon: <IconAlertCircle size={16} />, color: 'teal', label: 'open issues' },
  { icon: <IconMessages size={16} />, color: 'violet', label: 'discussions' },
  { icon: <IconDatabase size={16} />, color: 'grape', label: 'databases' },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
