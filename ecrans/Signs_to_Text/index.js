import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as FileSystem from 'expo-file-system';

const Signs_to_Text = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [translatedText, setTranslatedText] = useState('');
  const [videoUri, setVideoUri] = useState(null); // Pour stocker l'URI de la vidéo enregistrée

  // Méthode pour démarrer l'enregistrement de la vidéo
  const startRecording = async () => {
    setIsRecording(true);
    // Enregistrer la nouvelle vidéo
    const video = await cameraRef.current.recordAsync();
    setVideoUri(video.uri);
  };

  // Méthode pour arrêter l'enregistrement de la vidéo et l'envoyer au backend
  const stopRecording = async () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
    if (videoUri) {
      // Envoyer la vidéo au backend
      try {
        const formData = new FormData();
        formData.append('video', {
          uri: videoUri,
          type: 'video/mp4',
          name: 'video.mp4',
        });
        const response = await fetch('https://e88e-2a02-a020-cc-563e-d56c-3d0b-c04b-9293.ngrok-free.app//translate-video', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi de la vidéo au backend");
        }
        const data = await response.json();
        console.log('Réponse du serveur:', data); // Imprimer la réponse dans la console
        setTranslatedText(data.translatedText);
      } catch (error) {
        console.error(error);
        setTranslatedText('Erreur lors de la traduction');
      }

      // Supprimer l'URI vidéo existant
      try {
        await FileSystem.deleteAsync(videoUri);
        console.log('URI vidéo existant supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'URI vidéo existant:', error);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          ref={cameraRef}
          type={cameraType}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.translatedText}>{translatedText}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {isRecording ? (
          <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startButton} onPress={startRecording}>
            <Text style={styles.buttonText}>Traduire</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraType}>
          <MaterialCommunityIcons name="camera-switch" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translatedText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  stopButton: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default Signs_to_Text;
