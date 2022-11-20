import React, { useEffect } from 'react';
import { useState } from 'react';
import { TextInput, Button, Stack, Table } from '@mantine/core';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';

function Labels({ data }) {
  const [rows, setRows] = useState(data);

  const supabase = useSupabaseClient();

  const form = useForm({
    initialValues: { name: '' },
    validate: {
      name: (value) => (value.length > 0 ? null : 'name is required.'),
    },
  });

  const handleSubmit = async (values) => {
    const { data, error } = await supabase
      .from('labels')
      .insert([values])
      .select('*');
    if (data) {
      const record = data.at(0);
      showNotification({
        title: 'Success',
        message: record.id,
      });
      setRows((prev) => {
        return [record, ...prev];
      });
      form.reset({}, { keepDefaultValues: true });
    }
    if (error) {
      showNotification({
        title: 'Failed',
        message: error?.message ?? error.code,
      });
    }
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Stack
        align="center"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          marginBottom: 6,
        })}
      >
        <TextInput
          withAsterisk
          label="name"
          placeholder="label name here"
          {...form.getInputProps('name')}
        />
        <Button type="submit">add</Button>
      </Stack>
      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>name</th>
            <th>id</th>
            <th>created</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.id}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </form>
  );
}

export default Labels;
export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx, supabase) {
    const { data } = await supabase
      .from('labels')
      .select('*')
      .order('created_at', { ascending: false });
    return { props: { data } };
  },
});
