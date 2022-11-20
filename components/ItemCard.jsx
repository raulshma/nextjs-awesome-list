import {
  Card,
  Image,
  Text,
  Badge,
  Anchor,
  Group,
  Divider,
  Flex
} from '@mantine/core';

export default function ItemCard({
  title,
  description,
  url,
  image,
  addedBy,
  createdAt,
  label,
}) {
  return (
    <Card shadow="sm" p="md" mb={10} radius="md" withBorder>
      {image && (
        <Card.Section>
          <Image src={image} height={160} alt={description} />
        </Card.Section>
      )}

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        {label?.name && (
          <Badge color="blue" variant="light">
            {label.name}
          </Badge>
        )}
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>
      <Divider my="xs" />
      <Flex justify="space-between" align="center" direction="row" wrap="wrap">
        <Anchor
          variant="link"
          color="orange"
          href={url}
          target="_blank"
          radius="md"
        >
          visit now
        </Anchor>
        <Text size="xs" color="dimmed">
          {new Date(createdAt).toLocaleString()}
        </Text>
      </Flex>
    </Card>
  );
}
