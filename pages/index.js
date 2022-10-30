import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { Container, Loader, Center } from '@mantine/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import ItemCard from '../components/ItemCard';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState } from 'react';

const getPagination = (total, current, batchSize = 10) => {
  if (current >= total) return undefined;
  const from = current;
  const to = current + batchSize - 1;

  return { from, to };
};

export default function Home({ data, count, hasMoreData }) {
  const [listData, setListData] = useState(data);
  const [moreRecords, setMoreRecords] = useState(hasMoreData);
  const supabase = useSupabaseClient();

  const getMorePost = async () => {
    debugger;
    const paginationCalc = getPagination(count, listData.length);
    if (paginationCalc === undefined) return;

    const { from, to } = paginationCalc;
    const { data, count: recordCount } = await supabase
      .from('list')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (to < recordCount) setMoreRecords(true);
    else setMoreRecords(false);

    setListData((listData) => [...listData, ...data]);
  };

  return (
    <Container size="lg" px="xs">
      <InfiniteScroll
        dataLength={listData.length}
        next={getMorePost}
        hasMore={moreRecords}
        loader={
          <Center>
            <Loader />
          </Center>
        }
        endMessage={
          <Center>
            <h4>Nothing more to show</h4>
          </Center>
        }
      >
        {listData &&
          listData.map((item) => (
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
      </InfiniteScroll>
    </Container>
  );
}

export const getServerSideProps = withPageAuth({
  redirectTo: '/login',
  async getServerSideProps(ctx, supabase) {
    const user = await supabase.auth.getUser();
    if (user.data) {
      const { data, count } = await supabase
        .from('list')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(0, 9);
      const hasMoreData = data?.length < count;
      return { props: { data, count, hasMoreData } };
    }
    return { props: { data: [], count: undefined, hasMoreData: undefined } };
  },
});
