import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import {
  Stack,
  Button,
  Modal,
  Group,
  TextInput,
  Textarea,
  Box,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { showNotification } from '@mantine/notifications';
import { IconSearch } from '@tabler/icons';

export default function Admin({ user }) {
  const supabase = useSupabaseClient();
  const [addOpened, setAddOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      url: '',
      description: '',
      image_url: '',
    },

    validate: {
      title: (value) => (value.length > 0 ? null : 'title is required.'),
      url: (value) => (value.length > 0 ? null : 'url is required.'),
    },
  });

  const handleSubmit = (values) => {
    addItem(values);
  };

  const addItem = async (values) => {
    values.added_by = user.email;
    const { data, error } = await supabase
      .from('list')
      .insert([values])
      .select('*');

    if (data) {
      showNotification({
        title: 'Success',
        message: data.at(0).id,
      });
      setAddOpened(false);
    }
    if (error) {
      showNotification({
        title: 'Failed',
        message: error?.message ?? error.code,
      });
    }
  };

  const fetchMetadata = async () => {
    try {
      let urlValue = form.values.url;
      if (urlValue) {
        if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://'))
          urlValue = `https://${urlValue}`;
        const response = await fetch(
          `https://api.allorigins.win/raw?url=${urlValue}`
        );
        if (response.ok) {
          const responseBody = await response.text();
          const parser = new DOMParser();
          const parsed = parser.parseFromString(responseBody, 'text/html');

          const description = parsed.querySelector(
            'meta[name="description"]'
          ).content;
          const title = parsed.querySelector('title').innerText;

          if (title) form.setFieldValue('title', title.trim());
          if (description)
            form.setFieldValue('description', description.trim());
          if (urlValue) form.setFieldValue('url', urlValue);
        }
      }
    } catch (err) {
      showNotification({
        title: 'Failed getting info',
        message: err?.message ?? err.code ?? err,
      });
    }
  };
  return (
    <Stack
      align={'center'}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        height: 300,
      })}
    >
      <div>Hello {user.email}</div>
      <Button variant="outline" onClick={() => setAddOpened(true)}>
        add item
      </Button>

      <Modal
        centered
        opened={addOpened}
        onClose={() => setAddOpened(false)}
        title="add item!"
      >
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <TextInput
              withAsterisk
              label="title"
              placeholder="awesome title here"
              {...form.getInputProps('title')}
            />

            <TextInput
              withAsterisk
              label="url"
              placeholder="url here"
              rightSection={
                <ActionIcon variant="transparent" onClick={fetchMetadata}>
                  <IconSearch size={16} />
                </ActionIcon>
              }
              {...form.getInputProps('url')}
            />

            <Textarea
              placeholder="description here"
              label="description"
              variant="filled"
              {...form.getInputProps('description')}
            />
            <TextInput
              label="image url"
              placeholder="image url here"
              {...form.getInputProps('image_url')}
            />

            <Group position="right" mt="md">
              <Button type="submit">add</Button>
            </Group>
          </form>
        </Box>
      </Modal>
    </Stack>
  );
}

export const getServerSideProps = withPageAuth({ redirectTo: '/login' });
