import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, View, Text} from 'react-native';
import Title from '../../components/Title';
import styles from './styles';
import Categories from '../../components/Categories';
import AttractionCard from '../../components/AttractionCard';
import jsonData from '../../data/attractions.json';
import categories from '../../data/categories.json';
import {useNavigation} from '@react-navigation/native';

const All = 'All';
const Home = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(All);

  const [data, setData] = useState([]);

  //this upholds the data being displayed
  useEffect(() => {
    setData(jsonData);
    /***here could be where the api is called instead of a local json object***/
  }, []);

  //this effect below listens to the changes of selectedCategory
  useEffect(() => {
    if (selectedCategory === All) {
      setData(jsonData);
    } else {
      const filteredData = jsonData?.filter(item =>
        item?.categories?.includes(selectedCategory),
      );

      setData(filteredData);
    }
  }, [selectedCategory]);
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        numColumns={2} //this gives the display how many colum can be displayed.(in this case it is 2 )
        style={{flexGrow: 1}}
        keyExtractor={item => String(item?.id)}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items found.</Text>
        }
        ListHeaderComponent={
          <>
            <View style={{margin: 32}}>
              <Title text="Where do" style={{fontWeight: 'normal'}} />
              <Title text="want to go" />

              <Title text="Explore Attractions" style={styles.subtitles} />
            </View>

            <Categories
              selectedCategory={selectedCategory}
              onCategoryPress={setSelectedCategory}
              categories={[All, ...categories]}
            />
          </>
        }
        renderItem={({item, index}) => (
          <AttractionCard
            key={item.id}
            style={
              index % 2 === 0
                ? {marginRight: 12, marginLeft: 32}
                : {marginRight: 32}
            }
            onPress={() => navigation.navigate('AttractionDetails', {item})}
            title={item.name}
            subtitle={item.city}
            imageSrc={item.images?.length ? item.images[0] : null}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default React.memo(Home);
