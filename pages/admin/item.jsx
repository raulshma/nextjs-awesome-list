import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Group,
  TextInput,
  Textarea,
  Box,
  ActionIcon,
  Select,
  FileInput,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { showNotification } from "@mantine/notifications";
import { IconSearch, IconUpload, IconX, IconCheck } from "@tabler/icons";
import uuid from "react-uuid";

const initalFormValues = {
  title: "",
  url: "",
  description: "",
  image_url: "",
  label_id: null,
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function Item({ data, user }) {
  const supabase = useSupabaseClient();
  const [addOpened, setAddOpened] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUploadStatus, setFileUploadStatus] = useState("IDLE");

  const form = useForm({
    initialValues: initalFormValues,
    validate: {
      title: (value) => (value.length > 0 ? null : "title is required."),
      url: (value) => (value.length > 0 ? null : "url is required."),
    },
  });

  const handleSubmit = (values) => {
    addItem(values);
  };

  const fileSelectedHandler = async (file) => {
    setFileUploadStatus("STARTED");
    var filePath = `public/${uuid()}.jpeg`;
    const { data, error } = await supabase.storage
      .from("screenshots")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (!error) {
      setFileUploadStatus("COMPLETED");
      debugger;
      if (data?.path) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("screenshots").getPublicUrl(data.path);
        if (publicUrl) form.setFieldValue("image_url", publicUrl);
      }
      setTimeout(() => {
        setFileUploadStatus("IDLE");
      }, 5000);
    } else {
      setFileUploadStatus("FAILED");
    }
  };

  const addItem = async (values) => {
    debugger;
    values.added_by = user.email;
    const { data, error } = await supabase
      .from("list")
      .insert([values])
      .select("*");

    if (data) {
      showNotification({
        title: "Success",
        message: data.at(0).id,
      });
      form.reset({}, { keepDefaultValues: true });
      setAddOpened(false);
    }
    if (error) {
      showNotification({
        title: "Failed",
        message: error?.message ?? error.code,
      });
    }
  };

  const fetchMetadata = async () => {
    try {
      let urlValue = form.values.url;
      if (urlValue) {
        if (!urlValue.startsWith("http://") && !urlValue.startsWith("https://"))
          urlValue = `https://${urlValue}`;
        const response = await fetch(
          `https://cors-bypass.raulshma.workers.dev/?${urlValue}`
        );
        if (response.ok) {
          const responseBody = await response.text();
          const parser = new DOMParser();
          const parsed = parser.parseFromString(responseBody, "text/html");

          const description = parsed.querySelector(
            'meta[name="description"]'
          ).content;
          const title = parsed.querySelector("title").innerText;

          if (title) form.setFieldValue("title", title.trim());
          if (description)
            form.setFieldValue("description", description.trim());
          if (urlValue) form.setFieldValue("url", urlValue);
        }
      }
    } catch (err) {
      showNotification({
        title: "Failed getting info",
        message: err?.message ?? err.code ?? err,
      });
    }
  };

  const getFileIcon = () => {
    if (fileUploadStatus === "STARTED") return <Loader size={14} />;
    else if (fileUploadStatus === "FAILED") return <IconX size={14} />;
    else if (fileUploadStatus === "SUCCESS") return <IconCheck size={14} />;
    return <IconUpload size={14} />;
  };

  return (
    <Stack
      align={"center"}
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
        height: 300,
      })}
    >
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
              {...form.getInputProps("title")}
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
              {...form.getInputProps("url")}
            />

            <Textarea
              placeholder="description here"
              label="description"
              variant="filled"
              {...form.getInputProps("description")}
            />
            <TextInput
              label="image url"
              placeholder="image url here"
              {...form.getInputProps("image_url")}
            />
            <FileInput
              icon={getFileIcon()}
              label="Upload file"
              placeholder="Pick image"
              value={file}
              onChange={fileSelectedHandler}
              accept="image/jpeg"
            />
            <Select
              label="label"
              placeholder="pick one"
              searchable
              nothingFound="no options"
              data={data?.map((item) => {
                return { value: item.id, label: item.name };
              })}
              {...form.getInputProps("label_id")}
            />
            <Group position="right" mt="md">
              <Button
                type="reset"
                onClick={() => form.reset({}, initalFormValues)}
              >
                reset
              </Button>
              <Button type="submit">add</Button>
            </Group>
          </form>
        </Box>
      </Modal>
    </Stack>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  async getServerSideProps(ctx, supabase) {
    const { data } = await supabase
      .from("labels")
      .select("*")
      .order("created_at", { ascending: false });
    // if (data && Array.isArray(data))
    //   data.unshift({ id: '', name: 'select label' });
    return { props: { data } };
  },
});
