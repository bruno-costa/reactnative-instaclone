import React, {useState, useEffect, useCallback} from 'react';
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
  const [itemChanged, setItemChanged] = useState([]);

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPage(pageNumber = page, shoudRefresh = false) {
    console.log({shoudRefresh, pageNumber, feed});
    if (total <= (page - 1) * PER_PAGE) {
      return;
    }

    setLoading(true);

    const response = await fetch(
      `http://localhost:3000/feed?_expand=author&_limit=${PER_PAGE}&_page=${pageNumber}`,
    );

    const data = await response.json();
    const totalItems = response.headers.get('X-Total-Count');

    setTotal(totalItems * 1);
    console.log(shoudRefresh, shoudRefresh ? data : [...feed, ...data]);
    setFeed(shoudRefresh ? data : [...feed, ...data]);
    setPage(pageNumber + 1);
    setLoading(false);
  }

  async function refreshList() {
    setRefreshing(true);
    await loadPage(1, true);
    setRefreshing(false);
  }

  const handleViewableItemsChanged = useCallback(({changed}) => {
    setItemChanged(changed.map(({item}) => item.id));
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
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 20}}
        renderItem={({item}) => (
          <Post>
            <Header>
              <Avatar source={{uri: item.author.avatar}} />
              <Name>{item.author.name}</Name>
            </Header>
            <LazyImage
              loadImage={itemChanged.includes(item.id)}
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
