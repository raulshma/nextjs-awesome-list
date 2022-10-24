import React from 'react';
import {
  IconGitPullRequest,
  IconAlertCircle,
  IconMessages,
  IconDatabase,
  IconBrandGithub,
  IconAdjustmentsHorizontal,
} from '@tabler/icons';
import { ThemeIcon, UnstyledButton, Group, Text, Anchor } from '@mantine/core';
import { useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';

function MainLink({ icon, color, label, link, route, isRoute }) {
  const router = useRouter();
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

        {isRoute ? (
          <Anchor
            variant="text"
            onClick={() => router.replace(route)}
          >
            {label}
          </Anchor>
        ) : link ? (
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
  {
    icon: <IconAdjustmentsHorizontal size={16} />,
    color: 'gray',
    label: 'admin',
    permission: 'auth',
    isRoute: true,
    route: '/admin',
  },
];

export function MainLinks() {
  const user = useUser();
  const links = data
    .filter((link) => (link.permission && user != null) || !link.permission)
    .map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
