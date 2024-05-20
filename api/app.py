#Dans ce fichier vous aurez la configuration de l'api texte - geste et geste -texte
#Pour pouvoir lancer ce fichier , veuillez importer l'environnement fournit dans le dossier api/environnement

import uuid
from flask import Flask, request, jsonify
import cv2
import numpy as np
import os 
import time 
import mediapipe as mp
from sklearn.model_selection import train_test_split
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM , Dense,Dropout,GRU
from werkzeug.utils import secure_filename
import spacy
import mediapipe as mp
from flask import Flask, request, jsonify
import numpy as np
import nltk
from nltk.corpus import stopwords
from collections import deque
import string





app = Flask(__name__)


#TEXTES - GESTES:
# Charger le modèle de langue en français
nlp = spacy.load("fr_core_news_sm")

question = {"comment","quoi","où","quel","quelle","pourquoi","combien","qu'est ce que","quand","qui","qu'est ce que tu fais"}
sentence = {"que fait on","que faire","qu'est ce que je fais","qu'est ce que tu fais"}
motscompo ={"ça va","dix huit"}

mots_composes = {}
for i in sentence :
    mots_composes[i] = 0
for i in question :
    mots_composes[i] = 1
for i in motscompo :
    mots_composes[i] = 2
    
stop_words = set(stopwords.words('french'))
àretirer = {"je", "tu", "il", "elle", "nous", "vous", "ils", "elles","et","toi","pour","dans","ton","ta","son", "le", "lui"}
stop_words -= àretirer

àajouter = {"me","la", "ne","par"}
stop_words.update(àajouter)

n = string.ascii_lowercase
aphbet =[str(i) for i in n]
aphabet = set(aphbet)
stop_words -= aphabet

expressions_optimisees = {
                        'tu': 'toi',
                        'pas': 'non',
                        'super': 'bien',
                        'nom': 'appeler',
                        'salut':'bonjour',
                        'ans' : 'année',
                        'le': 'lui'  ,
                         'il': 'lui',
                         'elle': 'lui'     
                    }
# Fonction pour rechercher les vidéos correspondant à une expression

def rechercher_videos(expression,rep):
    video_correspondante = ''
    if expression not in stop_words:
        for video in os.listdir(rep):
            if (expression.lower() in os.path.splitext(video)[0].lower() or( os.path.splitext(video)[0].lower() in expression.lower())) and abs(len(os.path.splitext(video)[0].lower())-len(expression.lower()))<3 :
                video_correspondante = os.path.join(rep, video)
                
    return video_correspondante


def suppression_virgule(text):
    custom_punctuation = string.punctuation.replace("'", "")
    custom_punctuation = custom_punctuation.replace("?", "")
    
    table = str.maketrans('', '', custom_punctuation)
    stripped_text = text.translate(table)
    
    return stripped_text

#Fonction de repérage et découpage des mots composés
def decouper_phrase(phrase, mots_composes):
    mots_composes =list(mots_composes.keys())
    decoupage = []
    phrase = phrase.lower()  # Convertir la phrase en minuscules pour une correspondance insensible à la casse
    mots_composes = sorted(mots_composes, key=len, reverse=True)  # Trier les mots composés par longueur décroissante
    temp = ''
    while phrase:
        mot_trouve = False
        for mot in mots_composes:
            if phrase.startswith(mot):
                if temp:
                    decoupage.append(temp)
                    temp = ''
                decoupage.append(mot)
                phrase = phrase[len(mot):]
                mot_trouve = True
                break
            elif phrase.startswith(mot.replace(" ", "")):
                if temp:
                    decoupage.append(temp)
                    temp = ''
                decoupage.append(mot)
                phrase = phrase[len(mot.replace(" ", "")):]
                mot_trouve = True
                break
        if not mot_trouve:
            # Si aucun mot composé n'a été trouvé, on ajoute le caractère à temp
            if phrase[0] != " ":
                temp += phrase[0]
            else:
                if temp:
                    decoupage.append(temp)
                    temp = ''
            phrase = phrase[1:]

    if temp:
        decoupage.append(temp)

    return decoupage

nltk.download('stopwords')



@app.route('/')
def index():
    return 'Welcome to my Flask application'


@app.route('/translate-text', methods=['POST'])
def translate_text():
    data = request.get_json()  # Récupérez les données JSON envoyées dans la requête
    text = data.get('text')    # Récupérez le texte à traduire
    if "-" in text:
        text = text.replace("-", " ")
        
    list_texte_entree=  text.split(".")
    videos_totales = []
    for texte_entree in list_texte_entree :
        if texte_entree:
            texte_entree = suppression_virgule(texte_entree)
            
            expressions = decouper_phrase(texte_entree,mots_composes)
            print(expressions)
            
            expressions = deque(expressions)
            
            if expressions[0] in sentence:
                expressions[0] = "qu'est ce que tu fais"
            if expressions[0] in question and expressions[-1] =='?':
                temp = expressions[0]
                expressions.popleft()
                expressions.pop()
                expressions.append(temp)
                
            if expressions[-1] =='?':
                expressions.pop()
        
            #print(expressions)
        
            
            for expression in expressions:
                verbes_infinitif = []
                test = False
                if expression[:2]=="j'":
                    test =True
                    
                #print(test)   
                

                if expression in expressions_optimisees:
                    expression = expressions_optimisees[expression]
                print(expression)
                
                videos_mot = rechercher_videos(expression,"assets/dataset")
                if videos_mot:
                    videos_totales.append(videos_mot)
                    continue
                    
                if expression not in question:
                    if expression not in mots_composes:
                        temp = 'Je '+expression
                        doc = nlp(temp)  
                        # Extraire les verbes à l'infinitif
                        verbes_infinitif = [token.lemma_ for token in doc if token.pos_ == "AUX" or token.pos_ == "VERB"]

                       
                if not verbes_infinitif:   
                    verbes_infinitif.append(expression)
                
                
                # Rechercher les vidéos correspondantes
                if test :
                    videos_mot = rechercher_videos("je","assets/dataset")
                    if videos_mot:
                        videos_totales.append(videos_mot)
                
                
                
                for verbe in verbes_infinitif:
                    test2 = False
                    
                    if verbe not in stop_words: #
                        videos_mot = rechercher_videos(verbe,"assets/dataset")
                        
                        
                        if len(videos_mot)==0:
                            test2 = True
                        else:
                            videos_totales.append(videos_mot)


                    if test2 and verbe not in stop_words:
                        for i in verbe:
                            videos_mot = rechercher_videos(i,"assets/dataset/alphabet")
                            if videos_mot:
                                videos_totales.append(videos_mot)
            
    if not videos_totales:
        videos_totales.append("")
    return {'translatedText': videos_totales}         
  
#PARTIE GESTES - TEXTES



# Variable de contrôle pour l'enregistrement en cours
is_processing_video = False

#fonctions mediapipe_detection, extract_keypoints et prob_viz ici

mp_holistic = mp.solutions.holistic  # the holistic model to make detection
mp_drawing = mp.solutions.drawing_utils # to draw the visualization 

def mediapipe_detection( image , model):
    image =  cv2.cvtColor(image, cv2.COLOR_BGR2RGB) # conversion de couleur BGR  to RGB
    image.flags.writeable = False                   #  the image is not writeable
    results = model.process(image)                  # make prediction 
    image.flags.writeable = True                    # the image is writeable again
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    return image, results

def  draw_landmarks(image,results):
    mp_drawing.draw_landmarks( image, results.face_landmarks,mp_holistic.FACEMESH_CONTOURS)  # draw face connections $$$$$$$$$
    mp_drawing.draw_landmarks( image, results.pose_landmarks,mp_holistic.POSE_CONNECTIONS)  # draw pose connections
    mp_drawing.draw_landmarks( image, results.left_hand_landmarks,mp_holistic.HAND_CONNECTIONS) # draw left hand connections
    mp_drawing.draw_landmarks( image, results.right_hand_landmarks,mp_holistic.HAND_CONNECTIONS) # draw right hand connections

def  draw_styled_landmarks(image,results):
     # draw face connections $$$$$$$$$
    mp_drawing.draw_landmarks( image, results.face_landmarks,mp_holistic.FACEMESH_CONTOURS,
                              mp_drawing.DrawingSpec(color=(80,110,10),thickness=1, circle_radius=1), # to color landmark , se sont les points sur le visage 
                              mp_drawing.DrawingSpec(color=(80,256,121),thickness=1, circle_radius=1) # to color  the connection , le cercle autour de la tete 
                              ) 
    # draw pose connections
    mp_drawing.draw_landmarks( image, results.pose_landmarks,mp_holistic.POSE_CONNECTIONS,
                               mp_drawing.DrawingSpec(color=(80,22,10),thickness=2, circle_radius=4),
                               mp_drawing.DrawingSpec(color=(80,44,121),thickness=2, circle_radius=2)
                              )  
    # draw left hand connections
    mp_drawing.draw_landmarks( image, results.left_hand_landmarks,mp_holistic.HAND_CONNECTIONS
                              ,
                               mp_drawing.DrawingSpec(color=(121,22,76),thickness=2, circle_radius=4),
                               mp_drawing.DrawingSpec(color=(121,44,121),thickness=2, circle_radius=2)
                              ) 
    # draw right hand connections
    mp_drawing.draw_landmarks( image, results.right_hand_landmarks,mp_holistic.HAND_CONNECTIONS
                              ,
                               mp_drawing.DrawingSpec(color=(245,117,66),thickness=2, circle_radius=4),
                               mp_drawing.DrawingSpec(color=(245,66,230),thickness=2, circle_radius=2)
                              ) 

def extract_keypoints(results):
    pose =   np.array([[res.x , res.y ,res.z ,res.visibility] for res in results.pose_landmarks.landmark ]).flatten() if results.face_landmarks else np.zeros(132) # on ajoute .flatten() cpour concatener toutes les points 
    lh =   np.array([[res.x , res.y ,res.z ] for res in results.left_hand_landmarks.landmark ]).flatten()  if results.left_hand_landmarks else np.zeros(21*3)
    face =   np.array([[res.x , res.y ,res.z ] for res in results.face_landmarks.landmark ]).flatten()  if results.face_landmarks else np.zeros(1404)
    rh =   np.array([[res.x , res.y ,res.z ] for res in results.right_hand_landmarks.landmark ]).flatten()  if results.right_hand_landmarks else np.zeros(21*3)
    # we can concatenate all those points 
    return np.concatenate([pose,face,lh,rh])


colors = [(245,117,16), (117,245,16), (16,117,245)]

def prob_viz(res, actions, input_frame, colors):
    output_frame = input_frame.copy()
    for num, prob in enumerate(res):
        cv2.rectangle(output_frame, (0,60+num*40), (int(prob*100), 90+num*40), colors[num%3], -1)
        cv2.putText(output_frame, actions[num], (0, 85+num*40), cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,255), 2, cv2.LINE_AA)
        
    return output_frame

def process_video(video):
    # Définir le modèle mediapipe Holistic
    mp_holistic = mp.solutions.holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    # Initialiser les variables de séquence, de phrase et de prédiction
    sequence = []
    sentence = []
    prediction = []
    threshold = 0.8
    # Définir les actions possibles (0, 1, 2, 3, 4, 5)
    actions = np.array(['0', '1', '2', '3', '4', '5'])

    no_sequences =  40 # 40 differents frames of data
    
    sequences_length = 40 
    # Charger le modèle pour la prédiction

    # creation du modele 
    modell = Sequential()
    modell.add(GRU(250, return_sequences = True , activation = 'relu',input_shape=(no_sequences,1662)))
    modell.add(GRU(125, return_sequences =True , activation = 'relu'))
    modell.add(GRU(250, return_sequences =True , activation = 'relu'))
    modell.add(GRU(120, return_sequences =False , activation = 'relu'))
    modell.add(Dense(120,activation ='relu'))
    modell.add(Dense(60,activation ='relu'))
    modell.add(Dense(35,activation ='relu'))
    modell.add(Dense(actions.shape[0],activation ='softmax')) # softmax permet de rependre les resultals sous forme de probabilité

    modell.compile(optimizer='Adamax',loss='categorical_crossentropy',metrics = ['categorical_accuracy'])
    modell.load_weights('le_modele_numbers0-5.h5')
    
    
    #print(video)
   
    # Ouvrir le flux vidéo
    cap = cv2.VideoCapture(video)
    if cap:
        print ("Flux vidéo ouvert")
    # Boucle principale pour traiter chaque frame de la vidéo
    with mp_holistic as holistic:
        while cap.isOpened() and is_processing_video:
            # Lire une frame de la vidéo
            ret, frame = cap.read()

            # Traiter la frame pour la détection de poses
            image, results = mediapipe_detection(frame, holistic)

            # Extraire les keypoints de la frame
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            video_sequence = sequence[-no_sequences:]

            # Si la longueur de la séquence est atteinte
            if len(video_sequence) == no_sequences:
                # Faire une prédiction avec le modèle
                res = modell.predict(np.expand_dims(video_sequence, axis=0))[0]

                prediction.append(np.argmax(res))
                print(prediction)
                # Mise à jour de la phrase prédite
                if np.unique(prediction[-10:]) and np.unique(prediction[-10:])[0] == np.argmax(res):
                    if res[np.argmax(res)] > threshold:
                        if len(sentence) > 0:
                            if actions[np.argmax(res)] != sentence[-1]:
                                sentence.append(actions[np.argmax(res)])
                            else:
                                sentence.append(actions[np.argmax(res)])

                if len(sentence) > 5:
                    sentence = sentence[-5:]

    # Fermer le flux vidéo
    cap.release()
    #cv2.destroyAllWindows()
    print(sentence)
    # Retourner la phrase prédite
    return ' '.join(sentence)

def translate_image_to_text(image):
    # Définir le modèle mediapipe Holistic
    mp_holistic = mp.solutions.holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    # Initialiser les variables de séquence, de phrase et de prédiction
    sequence = []
    sentence = []
    prediction = []
    threshold = 0.8
    # Définir les actions possibles (0, 1, 2, 3, 4, 5)
    actions = np.array(['0', '1', '2', '3', '4', '5'])

    no_sequences =  40 # 30 differents frames of data
    # videos are going to be 30 frames in lenght 
    sequences_length = 40 
    # Charger le modèle pour la prédiction

    # creation du modele 
    modell = Sequential()
    modell.add(GRU(250, return_sequences = True , activation = 'relu',input_shape=(no_sequences,1662)))
    modell.add(GRU(125, return_sequences =True , activation = 'relu'))
    modell.add(GRU(250, return_sequences =True , activation = 'relu'))
    modell.add(GRU(120, return_sequences =False , activation = 'relu'))
    modell.add(Dense(120,activation ='relu'))
    modell.add(Dense(60,activation ='relu'))
    modell.add(Dense(35,activation ='relu'))
    modell.add(Dense(actions.shape[0],activation ='softmax')) # softmax permet de rependre les resultals sous forme de probabilité

    modell.compile(optimizer='Adamax',loss='categorical_crossentropy',metrics = ['categorical_accuracy'])
    modell.load_weights('le_modele_numbers0-5.h5')

    frame = image

    # Ouvrir le flux vidéo
    #cap = cv2.VideoCapture(video)

    # Boucle principale pour traiter chaque frame de la vidéo
    with mp_holistic as holistic:
        while is_processing_video:
            # Lire une frame de la vidéo
            #ret, frame = cap.read()

            # Traiter la frame pour la détection de poses
            image, results = mediapipe_detection(frame, holistic)

            # Extraire les keypoints de la frame
            keypoints = extract_keypoints(results)
            sequence.append(keypoints)
            video_sequence = sequence[-no_sequences:]

            # Si la longueur de la séquence est atteinte
            if len(video_sequence) == no_sequences:
                # Faire une prédiction avec le modèle
                res = modell.predict(np.expand_dims(video_sequence, axis=0))[0]
                prediction.append(np.argmax(res))

                # Mise à jour de la phrase prédite
                if np.unique(prediction[-10:]) and np.unique(prediction[-10:])[0] == np.argmax(res):
                    if res[np.argmax(res)] > threshold:
                        if len(sentence) > 0:
                            if actions[np.argmax(res)] != sentence[-1]:
                                sentence.append(actions[np.argmax(res)])
                            else:
                                sentence.append(actions[np.argmax(res)])

                if len(sentence) > 5:
                    sentence = sentence[-5:]

    # Fermer le flux vidéo
    #cap.release()
    #cv2.destroyAllWindows()

    # Retourner la phrase prédite
    return ' '.join(sentence)


# Définir une liste pour stocker les frames
frames = []



#Définir ici le dossier de chargement des vidéos
UPLOAD_FOLDER = "C:\\Users\\mammo\\OneDrive - UMONS\\Documents\\BAC3\\Q2\\ProjetIG\\ProjetIGDocs\\Codes sources\\Owns\\CLEAN\\App\\Bab3Projet\\videos"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/translate-video', methods=['POST'])
def translate_video():
    print("Received video from client.")
    try:
        # Vérifier si la requête contient un fichier vidéo
        if 'video' not in request.files:
            return jsonify({'error': 'Aucun fichier trouvé dans la requête'}), 400
        
        # Récupérer le fichier vidéo
        video_file = request.files['video']
        
        # Vérifier si le fichier est vide
        if video_file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
        
        # Vérifier si le fichier est autorisé (par exemple, vérifier l'extension)
        allowed_extensions = {'mp4', 'avi', 'mov'}
        if '.' not in video_file.filename or video_file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            return jsonify({'error': 'Type de fichier non autorisé'}), 400
        
        # Enregistrer le fichier vidéo dans le dossier de téléchargement
        filename = secure_filename(video_file.filename)
        # Générer un nom de fichier unique
        unique_filename = str(uuid.uuid4()) + '_' + str(int(time.time())) + '.' + video_file.filename.rsplit('.', 1)[1].lower()
        
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        #print("filepath ", filepath)
        video_file.save(filepath)
        
        # Traiter la vidéo 
        translated_text = process_video(filepath)
        if translated_text == "":
            translated_text = "Bonjour !"
        # Retourner le texte traduit
        # Supprimer le fichier vidéo du système de fichiers après la traduction réussie
        os.remove(filepath)
        return jsonify({'translatedText': translated_text}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500





if __name__ == '__main__':
    app.run(debug=True)


