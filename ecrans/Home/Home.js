import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const navigateToTextToSigns = () => {
    navigation.navigate('Text_to_Signs');
  };

  const navigateToSignsToText = () => {
    navigation.navigate('Signs_to_Text');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to </Text>
      <View style={styles.logoContainer}>
        {/* Affichage du logo */}
        <Image source={require('../../assets/LOGO2.png')} style={styles.logo} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToTextToSigns}>
          <Text style={styles.buttonText}>Textes --> Langue de Signes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToSignsToText}>
          <Text style={styles.buttonText}>Langue de signes --> Textes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 5,
    color: '#110495',
    fontWeight: '600',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.3,
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Home;
