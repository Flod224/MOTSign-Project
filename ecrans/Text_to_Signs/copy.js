import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';

const Text_to_Signs = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [videoPaths, setVideoPaths] = useState([]);
  const [loading, setLoading] = useState(false); // Pour indiquer si le chargement des vidéos est en cours

  // Fonction pour traduire le texte
  const translateText = async () => {
    try {
      setLoading(true); // Début du chargement
      const response = await fetch('https://f36a-188-188-20-161.ngrok-free.app//translate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // Envoyer le texte saisi
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la traduction');
      }
  
      const responseData = await response.json();
      const translatedText = responseData.translatedText;
      setTranslatedText(translatedText); // Mettre à jour le texte traduit

      // Masquer le clavier après avoir traduit le texte
      Keyboard.dismiss();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Fonction pour récupérer les vidéos à partir des chemins renvoyés par le backend
  const fetchVideos = async () => {
    try {
      // Remplacez cette ligne par l'appel à votre backend pour récupérer la liste des chemins
      const pathsFromBackend = translatedText.map(path => path.replace(/\\/g, '/')); // Remplacer les barres obliques inversées par des barres obliques
      console.log(pathsFromBackend);
      // Mettez à jour l'état avec les chemins des vidéos
      setVideoPaths(pathsFromBackend);
    } catch (error) {
      console.error('Erreur lors de la récupération des chemins des vidéos:', error);
    }
  };

  useEffect(() => {
    // Chargez les vidéos lorsque le composant est monté
    if (translatedText) {
      fetchVideos();
    }
  }, [translatedText]);

  // Fonction pour effacer le texte
  const clearText = () => {
    setText('');
    setTranslatedText('');

    // Masquer le clavier après avoir effacé le texte
    //Keyboard.dismiss();
  };

  // Fonction pour masquer le clavier lorsqu'on appuie sur une autre partie de l'écran
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View style={styles.container}>
          {/* Partie supérieure avec les vidéos */}
          <View style={styles.videoContainer}>
            <ScrollView>


            <VideoPlayer
              key={currentVideoIndex}
              style={styles.video}
              videoProps={{
                source: { uri: videoPaths[currentVideoIndex] },
                //resizeMode: Video.RESIZE_MODE_COVER,
                shouldPlay: true,
                isMuted: true,
                isLooping: verification?true: false,
                
              }}
              videoBackground={'transparent'} // Use default parameter instead of defaultProps
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />



              <Video
                source={require('../../assets/avatar.mp4')}
                style={[styles.video, { width: 300, height: 300 }]} // Ajustez la largeur et la hauteur selon vos besoins
                resizeMode="cover"
                shouldPlay={true}
                isLooping={true}
                isMuted={true}
              />
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : (
                videoPaths.map((path, index) => (
                  <Video
                    key={index}
                    source={{ uri: path }}
                    style={[styles.video, { width: 300, height: 300 }]} // Ajustez la largeur et la hauteur selon vos besoins
                    resizeMode="cover"
                    shouldPlay={true}
                    isMuted={true}
                  />
                ))
              )}
            </ScrollView>
          </View>

          {/* Partie inférieure avec le champ de texte et les boutons */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(inputText) => setText(inputText)}
              value={text}
              placeholder="Saisir du texte..."
              multiline={true} // Permettre la saisie multiligne
              numberOfLines={Platform.OS === 'ios' ? 4 : 5} // Nombre de lignes visibles dans la fenêtre de saisie
            />
            <View style={styles.buttonGroup}>
              <Button title="Effacer" onPress={clearText} />
              <Button title="Traduire" onPress={translateText} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  videoContainer: {
    flex: 1,
    maxHeight: 350, // Hauteur maximale de la vidéo container
    marginBottom: 10,
  },
  video: {
    width: 300,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10, // Augmenter l'espace intérieur vertical
    marginBottom: 10,
    fontSize: 16,
    textAlignVertical: 'top', // Aligner le texte en haut de la fenêtre
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Text_to_Signs;
