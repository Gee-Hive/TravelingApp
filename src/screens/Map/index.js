import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

import styles from './styles';
const Map = ({navigation, route}) => {
  const {item} = route?.params || {};
  const coords = {
    latitude: item?.coordinates.lat, //to get the coordinates
    longitude: item?.coordinates.lon,
    longitudeDelta: 0.5, // to zoom into the maps
    latitudeDelta: 0.5,
  };

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={coords}>
        <Marker coordinate={coords} title={item?.name} />
      </MapView>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.back}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{`${item?.name}, ${item?.city}`}</Text>
      </View>
    </View>
  );
};

export default React.memo(Map);
