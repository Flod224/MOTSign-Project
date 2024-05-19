import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import OpenAI from "openai";

const videopahtdefaults = 'https://storage.googleapis.com/motsign/assets/avatar.mp4';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



const Text_to_Signs = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoPaths, setVideoPaths] = useState([videopahtdefaults]); // Default video path
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [defaultvideoloop, setdefaultvideoloop] = useState(true);

  
  
  //const openaiClient = new openai.OpenAI({ apiKey: openaiApiKey });

  const correctSyntax = async (inputText) => {
    const completion = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: 'Write a tagline for an ice cream shop.'
  });

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "Correct syntax in french language for the content if error is encountered"
          },
          {
            "role": "user",
            "content": inputText
          }
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });

      console.log(response.data.choices[0].text.trim())
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error('Error correcting syntax:', error);
      return inputText; // Return original text if there's an error
    }
  };

  const translateAndFetchVideos = async () => {
    setLoading(true);
    try {
      const correctedText = await correctSyntax(text);
      const response = await fetch('https://4c2e-83-134-111-160.ngrok-free.app//translate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: correctedText }),
      });

      if (!response.ok) {
        throw new Error('Error fetching videos');
      }

      const responseData = await response.json();
      const translatedText = responseData.translatedText;
      setTranslatedText(translatedText);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (translatedText) {
      fetchVideos();
    }
  }, [translatedText]);

  const fetchVideos = async () => {
    try {
      // Fetch video paths based on translated text
      const pathsFromBackend = translatedText.map(path => `https://storage.googleapis.com/motsign/${path.replace(/\\/g, '/')}`);

      // Array of characters to replace
      const charactersToReplace = {
        'é': 'e',
        'è': 'e',
        'ê': 'e',
        'ç': 'c',
        'î': 'i',
        'ï': 'i'
      };

      // Function to replace characters in a string
      const replaceCharacters = (str) => {
        let replacedStr = str;
        // Iterate over each character to replace
        Object.entries(charactersToReplace).forEach(([original, replacement]) => {
          replacedStr = replacedStr.replace(new RegExp(original, 'g'), replacement);
        });
        return replacedStr;
      };

      // Apply character replacement to each path
      const modifiedPaths = pathsFromBackend.map(path => replaceCharacters(path));

      // Modified paths with replaced characters
      console.log(modifiedPaths);

      setVideoPaths(modifiedPaths);
      setdefaultvideoloop(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des chemins des vidéos:', error);
    }
  };

  const clearText = () => {
    setText('');
    setTranslatedText('');
    setVideoPaths([videopahtdefaults]); // Reset to default video path
    setCurrentVideoIndex(0); // Reset current video index
    setdefaultvideoloop(true);
  };

  const handlePlaybackStatusUpdate = ({ didJustFinish }) => {
    if (didJustFinish && currentVideoIndex < videoPaths.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else if (didJustFinish && currentVideoIndex === videoPaths.length - 1) {
      // All videos have been played, reset to default video
      setVideoPaths([videopahtdefaults]);
      setCurrentVideoIndex(0);
      setdefaultvideoloop(true);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <View style={styles.container}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <View style={styles.videoContainer}>
              {videoPaths.map((videoPath, index) => (
                <View key={index} style={{ display: index === currentVideoIndex ? 'flex' : 'none' }}>
                  <Video
                    source={{ uri: videoPath }}
                    style={styles.video}
                    resizeMode="contain"
                    shouldPlay={index === currentVideoIndex}
                    isMuted={true}
                    isLooping={index === currentVideoIndex ? defaultvideoloop : false}
                    onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                  />
                </View>
              ))}
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(inputText) => setText(inputText)}
              value={text}
              placeholder="Saisir du texte..."
              multiline={true}
              numberOfLines={Platform.OS === 'ios' ? 4 : 5}
            />
            <View style={styles.buttonGroup}>
              <Button title="Effacer" onPress={clearText} />
              <Button title="Traduire" onPress={translateAndFetchVideos} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%', // La vidéo occupera 100% de la largeur disponible
    height: '100%', // La vidéo occupera 100% de la hauteur disponible
    aspectRatio: 16/9, // Optionnel: on peut définir un rapport d'aspect pour garder les proportions
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
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default Text_to_Signs;
