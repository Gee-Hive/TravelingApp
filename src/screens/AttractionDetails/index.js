import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import MapView, {Marker} from 'react-native-maps';
import Share from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';

import styles from './styles';
import Title from '../../components/Title';
import InfoCard from '../../components/InfoCard';

const AttractionDetails = ({navigation, route}) => {
  const {item} = route?.params || {}; //to preovent app from crashing; if there is no route passed, it return the default
  const mainImage = item?.images?.length ? item?.images[0] : null;
  const slicedImage = item?.images.length ? item?.images?.slice(0, 5) : [];
  const diffImage = item?.images.length - slicedImage?.length;
  const getOpeningHours = `OPEN
  ${item?.opening_time} - ${item?.closing_time}`;
  const coords = {
    latitude: item?.coordinates.lat, //to get the coordinates
    longitude: item?.coordinates.lon,
    longitudeDelta: 0.5, // to zoom into the maps
    latitudeDelta: 0.5,
  };

  const onGalleryNavigate = () => {
    navigation.navigate('Gallery', {images: item?.images});
  };

  const onShare = async () => {
    try {
      //encoding base64 Images and extracting image extensions
      const imageWithoutParams = mainImage?.split('?')[0];
      const imageParts = imageWithoutParams.split('.');
      const imageExtension = imageParts[imageParts?.length - 1];

      //to convert image to base64 before sharing image
      const base64Image = await ImgToBase64.getBase64String(mainImage);
      Share.open({
        title: item?.title,
        message: 'Hi there, i wanted to share with you this attractions',
        url: `data:image/${imageExtension || 'jpg'};base64, ${base64Image}`,
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          style={styles.mainImage}
          imageStyle={{borderRadius: 20}}
          source={{uri: mainImage}}>
          <View style={styles.header}>
            <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
              <Image
                style={styles.icon}
                source={require('../../assets/back.png')}
              />
            </Pressable>

            <Pressable onPress={onShare} hitSlop={8}>
              <Image
                style={styles.icon}
                source={require('../../assets/Sharebutton.png')}
              />
            </Pressable>
          </View>

          <Pressable onPress={onGalleryNavigate} style={styles.footer}>
            {slicedImage?.map((image, index) => (
              <View key={image}>
                <Image source={{uri: image}} style={styles.miniImage} />
                {diffImage > 0 && index === slicedImage?.length - 1 ? (
                  <View style={styles.moreImagesContainer}>
                    <Text style={styles.moreImages}>{`+${diffImage}`}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </Pressable>
        </ImageBackground>

        <View style={styles.headerContainer}>
          <View style={{maxWidth: '70%'}}>
            <Title style={styles.title} text={item?.name} />
            <Text style={styles.city}>{item?.city}</Text>
          </View>
          <Title style={styles.title} text={item?.entry_price} />
        </View>

        <InfoCard
          text={item?.address}
          icon={require('../../assets/location_circle.png')}
        />

        <InfoCard
          text={getOpeningHours}
          icon={require('../../assets/schedule.png')}
        />

        <MapView style={styles.map} initialRegion={coords}>
          <Marker coordinate={coords} title={item?.name} />
        </MapView>

        <Text
          style={styles.mapText}
          onPress={() => navigation.navigate('Map', {item})}>
          Show full Screen Map
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(AttractionDetails);
