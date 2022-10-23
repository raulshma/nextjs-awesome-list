import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { Container, Grid } from '@mantine/core';
import ItemCard from '../components/ItemCard';

export default function Home({ data }) {
  return (
    <Container size="lg" px="xs">
      <Grid grow justify="center" align="center">
        {data &&
          data.map((item) => (
            <ItemCard
              key={item.id}
              title={item.title}
              url={item.url}
              description={item.description}
              image={item.image_url}
              addedBy={item.added_by}
              createdAt={item.created_at}
            />
          ))}
      </Grid>
    </Container>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/',
  async getServerSideProps(ctx, supabase) {
    const user = await supabase.auth.getUser();
    if (user.data) {
      const { data } = await supabase.from('list').select('*');
      return { props: { data } };
    }
    return { props: { data: [] } };
  },
});
