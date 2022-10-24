import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { Container, Grid, Col } from '@mantine/core';
import ItemCard from '../components/ItemCard';

export default function Home({ data }) {
  return (
    <Container size="lg" px="xs">
      <Grid justify="center" align="center" gutter="xs">
        {data &&
          data.map((item) => (
            <Col span="auto" key={item.id}>
              <ItemCard
                title={item.title}
                url={item.url}
                description={item.description}
                image={item.image_url}
                addedBy={item.added_by}
                createdAt={item.created_at}
              />
            </Col>
          ))}
      </Grid>
    </Container>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx, supabase) {
    const user = await supabase.auth.getUser();
    if (user.data) {
      const { data } = await supabase.from('list').select('*');
      return { props: { data } };
    }
    return { props: { data: [] } };
  },
});
