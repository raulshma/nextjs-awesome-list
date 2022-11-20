import React from 'react';
import { Stack } from '@mantine/core';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
function Index({ user }) {
  return (
    <Stack
      align="center"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        height: 300,
      })}
    >
      <div>Hello {user.email}</div>
      <Link href="/admin/item">Item</Link>
      <Link href="/admin/labels">Labels</Link>
    </Stack>
  );
}

export default Index;
export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
