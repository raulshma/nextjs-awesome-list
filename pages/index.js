import { withPageAuth } from '@supabase/auth-helpers-nextjs';
import { Container, Loader, Center, Text } from '@mantine/core';
import InfiniteScroll from 'react-infinite-scroll-component';
import ItemCard from '../components/ItemCard';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { useDebouncedState } from '@mantine/hooks';
import { TextInput, ActionIcon, Paper } from '@mantine/core';
import { IconSquareX } from '@tabler/icons';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

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
  // Will remove it later too sleepy right now.
  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useDebouncedState('', 800);
  const [isSearching, setIsSearching] = useState(false);

  const getMorePost = async () => {
    if (searchQuery && searchQuery.length > 1) return;
    debugger;
    const paginationCalc = getPagination(count, listData.length);
    if (paginationCalc === undefined) return;

    const { from, to } = paginationCalc;
    const { data, count: recordCount } = await supabase
      .from('list')
      .select('*, labels (name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (to < recordCount) setMoreRecords(true);
    else setMoreRecords(false);

    setListData((listData) => [...listData, ...data]);
  };

  const searchPost = async (keyword) => {
    setIsSearching(true);
    try {
      const newKeyword = keyword?.includes(' ') ? `'${keyword}'` : keyword;
      let { data, error } = await supabase.rpc('sp_search', {
        keyword: newKeyword,
      });

      if (error) console.error(error);
      else setListData(data);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length > 1) {
      searchPost(searchQuery);
    }
  }, [searchQuery]);

  return (
    <Container size="lg" px="xs" sx={{ position: 'relative' }}>
      <Paper
        shadow="md"
        p="xs"
        radius={0}
        sx={{ position: 'sticky', top: 50, zIndex: 1000, marginBottom: 10 }}
      >
        <TextInput
          placeholder="Search"
          variant="filled"
          color="white"
          onChange={(e) => (
            setSearchQuery(e.target.value), setSearchInputValue(e.target.value)
          )}
          rightSection={
            isSearching ? (
              <Loader size="xs" />
            ) : searchQuery && searchQuery.length > 1 ? (
              <ActionIcon>
                <IconSquareX
                  onClick={() => (
                    setSearchQuery(''),
                    setSearchInputValue(''),
                    setListData(data)
                  )}
                />
              </ActionIcon>
            ) : (
              <></>
            )
          }
          value={searchInputValue}
        />
      </Paper>
      <Text size={'sm'} pb={'sm'} pt={'xs'}>Total links {count}</Text>
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
              label={item.labels}
            />
          ))}
      </InfiniteScroll>
    </Container>
  );
}

export const getServerSideProps = async (ctx) => {
  const supabase = createServerSupabaseClient(ctx);
  const { data, count } = await supabase
    .from('list')
    .select('*, labels (name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(0, 9);
  const hasMoreData = data?.length < count;
  return { props: { data, count, hasMoreData } };
};
