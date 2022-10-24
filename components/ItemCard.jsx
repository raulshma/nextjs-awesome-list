import { Card, Image, Text, Badge, Anchor, Group } from '@mantine/core';

export default function ItemCard({
  title,
  description,
  url,
  image,
  addedBy,
  createdAt,
}) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      {image && (
        <Card.Section>
          <Image src={image} height={160} alt={description} />
        </Card.Section>
      )}

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>
        <Badge color="blue" variant="light">
          Mix
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        {description}
      </Text>
      <Anchor
        variant="link"
        color="orange"
        href={url}
        target="_blank"
        mt="md"
        radius="md"
      >
        visit now
      </Anchor>
    </Card>
  );
}
