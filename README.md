# MOTSign
![MOTSign Logo](https://storage.googleapis.com/motsign/assets/LOGO.jpg)

## Description
MOTSign est un projet de fin d'études de troisième année de bachelier à la Faculté Polytechnique de Mons. Il vise à améliorer la communication des personnes malentendantes ou sourdes en fournissant une application mobile capable de traduire les langues des signes en texte et vice versa.

## Objectifs
- Faciliter la communication entre les personnes malentendantes ou sourdes et leur entourage.
- Offrir une solution mobile accessible et facile à utiliser pour la traduction en temps réel des langues des signes.

## Public Cible
- Personnes malentendantes ou sourdes.
- Personnes souhaitant communiquer avec des malentendants ou sourds.

## Fonctionnalités
- **Traduction texte en gestes** : Permet à l'utilisateur de saisir du texte et de le traduire en gestes à l'aide d'un avatar.
- **Traduction gestes en texte** : Utilise la caméra du téléphone pour capturer les gestes de l'utilisateur et les traduire en texte.

## Architecture de l'Application
L'application est développée avec React Native et utilise une API Python pour la partie backend.

### Design de fonctionnalités
![Design de fonctionnalités](https://storage.googleapis.com/motsign/assets/architecture.png)

## Technologies Utilisées
- **Langage de programmation** : JavaScript (React Native), Python
- **Frameworks** : React Native
- **Outils de développement** : Visual Studio Code, Windows 11
- **Dépendances** : 
  - Node.js
  - React Native
  - Python pour l'API backend
  - OpenCV 4.9.0.80
  - Flask 3.0.3
  - Ngrok
  - Mediapipe 0.8.11
  - Nltk 3.8.1
  - Spacy 3.7.4

A noter que les versions précisées ci-dessus servent juste à faciliter l'installation au cas où l'utilisateur serait confronté à des soucis de compatibilité.

## Prérequis
- **Système d'exploitation** : Windows 11
- **Dépendances** :
  - Node.js (v20.11.1) 
  - React Native (10.2.4) 
  - Python 3.8.19

## Installation
### Installation de Node.js
1. Télécharger et installer Node.js depuis [nodejs.org](https://nodejs.org/).
2. Vérifiez l'installation en exécutant `node -v` et `npm -v` dans la ligne de commande.

### Installation du projet
1. Cloner le dépôt : 
    ```bash
    git clone https://github.com/Flod224/MOTSign-Project.git

2. Naviguer dans le répertoire :
    ```bash
    cd MOTSign

## Configuration de l'Environnement Python avec Visual Studio Code
### Prérequis
Assurez-vous d'avoir installé Anaconda ou Miniconda, qui sont des distributions Python permettant de créer et de gérer facilement des environnements à partir de fichiers `yaml`.

### Création de l'Environnement
1. Ouvrez Visual Studio Code.
2. Ouvrez le terminal intégré dans Visual Studio Code en allant dans le menu **View** > **Terminal**.
3. Naviguez dans le répertoire contenant le fichier `motsignenvi.yaml` :
    ```bash
    cd api/environnement

4. Créez l'environnement Python à partir du fichier `motsignenvi.yaml` :
    ```bash
    conda env create -f motsignenvi.yaml

## Configuration de Visual Studio Code pour Utiliser l'Environnement

1. Une fois l'environnement activé, ouvrez la palette de commandes en appuyant sur `Ctrl+Shift+P` (ou `Cmd+Shift+P` sur macOS).

2. Tapez et sélectionnez `Python: Select Interpreter`.

3. Choisissez l'interpréteur Python de votre environnement nouvellement créé. Il sera listé comme quelque chose comme `(nom_de_votre_environnement) ...`.
   
! Si vous avez des problèmes de dépendances même après l'importation de l'environnement, veuillez suivre les étapes suivantes jusqu'au point 6.

5. Installer Flask
    ```bash
    pip install flask
6.  Installer OpenCV
    ```bash
    pip install opencv-python
7. Installer Mediapipe
    ```bash
    pip install mediapipe 
8. Installer Spacy
    ```bash
    pip install Spacy
9. Installer Nltk
   ```bash
    pip install nltk

## Compilation et Déploiement
### Compiler le Projet
    
    npx expo start

## Déployer sur un Appareil Réel

1. Télécharger puis installer l'application EXPO-GO sur iOS ou Android.
2.  Connectez votre appareil en scannant le code QR .


## Utilisation
### Guide de l'Utilisateur
#### Page d’Accueil
L'utilisateur commence par télécharger l'application depuis le Play Store ou l'App Store. Sur la page d'accueil, il peut choisir entre deux options : traduction du texte en geste ou traduction du geste en texte.

#### Interface de Traduction Texte en Gestes
L'utilisateur saisit du texte dans la partie inférieure de l'écran.
En cliquant sur le bouton "Traduire", le texte est traduit en gestes par l'avatar dans la partie supérieure de l'écran.
Il peut effacer le texte saisi en cliquant sur "Effacer".

#### Interface de Traduction Gestes en Texte
L'utilisateur utilise la caméra pour capturer les gestes dans la partie supérieure de l'écran.
En cliquant sur "Traduire", les gestes sont traduits en texte qui apparaît dans la partie inférieure de l'écran.
L'utilisateur peut arrêter la capture en cliquant sur "Stop".

## Contributeurs
Barry Mamadou Mounir : Développeur FrontEnd 

Bouazzati Ouiam : Développeur Backend (texte en geste)

Jospin Teubou Melonou : Développeur Backend (geste en texte)

Vous pouvez nous contacter sur LinkedIn si besoin, nous sommes des étudiants de la Faculté Polytechnique de Mons

## Annexes
## Références et Ressources
Documentation [React Native] (https://reactnative.dev/docs/getting-started)


## FAQ

Comment installer Node.js ? : Suivez les instructions sur [nodejs.org](https://nodejs.org/).
Comment configurer l'environnement Python ? : Pour pouvoir lancer ce fichier , veuillez importer l'environnement fournit dans le dossier [environnement](api/environnement)
