import React, {useState, useEffect} from 'react';
import {View, FlatList} from 'react-native';

import {Post, Header, Avatar, Name, Description, Loading} from './styles';

import LazyImage from '../../components/LazyImage';

const PER_PAGE = 5;

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(Infinity);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadPage(pageNumber = page, shoudRefresh = false) {
    if (total <= page * PER_PAGE) {
      return;
    }

    setLoading(true);

    const response = await fetch(
      `http://localhost:3000/feed?_expand=author&_limit=${PER_PAGE}&_page=${pageNumber}`,
    );

    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count');

    setTotal(totalItems * 1);
    setFeed(shoudRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  }

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <FlatList
        data={feed}
        keyExtractor={post => String(post.id)}
        onEndReachedThreshold={0.1}
        onEndReached={() => loadPage()}
        onRefresh={refreshList}
        refreshing={refreshing}
        ListFooterComponent={loading && <Loading />}
        renderItem={({item}) => (
          <Post>
            <Header>
              <Avatar source={{uri: item.author.avatar}} />
              <Name>{item.author.name}</Name>
            </Header>
            <LazyImage
              preSource={{uri: item.small}}
              aspectRatio={item.aspectRatio}
              source={{uri: item.image}}
            />
            <Description>
              <Name>{item.author.name}</Name>
              {item.description}
            </Description>
          </Post>
        )}
      />
    </View>
  );
}
