# 🗝️ MCP Keystone: The Universal Physical-to-AI Bridge

## Concept

Le **MCP Keystone** est un dispositif matériel (Hardware) conçu pour transformer n'importe quel objet physique en un "Outil" (Tool) utilisable par une Intelligence Artificielle via le Model Context Protocol (MCP).

C'est la pièce manquante qui permet à Claude de "toucher" le monde réel sans passer par des API cloud propriétaires et lentes.

## Spécifications Matérielles (Concept)

- **Processeur** : ESP32-S3 (WiFi/BLE) ou Raspberry Pi CM4 pour les tâches lourdes.
- **Entrées Numériques** : 4x Opto-isolées (pour lire l'état d'interrupteurs, capteurs de présence).
- **Sorties Puissance** : 2x Relais (10A) pour piloter des moteurs, lumières ou cafetières.
- **Port I2C** : Connecteur rapide pour capteurs de température, humidité et CO2.
- **Alimentation & Données** : Port Ethernet avec **PoE (Power over Ethernet)**. Un seul câble pour le courant (30W max) et la donnée.
- **Failover** : USB-C PD en secours.

## Comment ça marche ? (Plug, Detect & Play)

1. **Plug** : Branchez un appareil physique (ex: un ventilateur) sur le port universel du Keystone.
2. **Auto-Detection** : Le Keystone analyse la signature électrique (consommation, impédance) ou interroge les protocoles (I2C/Serial) pour identifier l'objet.
3. **Dynamic Schema** : Le Keystone ne propose pas une liste d'outils génériques. Il génère et expose un **Schéma MCP spécifique** à l'objet détecté (ex: `set_fan_speed` au lieu de `toggle_relay`).
4. **Action** : L'agent IA reçoit instantanément les outils adaptés et peut contrôler l'appareil sans configuration manuelle.

## Méthodes de Détection Ingénieuses

- **Empreinte Électrique** : Analyse du courant d'appel et du déphasage pour différencier un moteur (ventilateur) d'une résistance (chauffage) ou d'une LED (lampe).
- **Poignée de main (Handshake)** : Si l'objet est semi-intelligent, le Keystone utilise une recherche ID automatique via le lien de données.
- **Réflexion par l'IA** : Si l'objet est totalement inconnu, le Keystone expose une ressource `raw_signal_sample` que l'IA analyse pour suggérer le meilleur schéma de contrôle possible.

## Fonctionnalités Avancées (Intelligence Embarquée)

### 🚨 Détection de Panne (Auto-Diagnostic)

Le Keystone surveille en continu la signature électrique. S'il détecte une anomalie (ex: un ventilateur qui consomme trop car son moteur est grippé, ou une ampoule grillée qui ne consomme plus rien), il :

- Coupe le courant par sécurité.
- Envoie une **Notification MCP** avec le code erreur (ex: `FAULT_OVERCURRENT` ou `FAULT_OPEN_CIRCUIT`).
- Propose à l'IA un "Plan de secours" (ex: "Utiliser un deuxième ventilateur").

### 🍃 Mode Économie d'Énergie Automatique

Le boîtier possède une logique d'éco-connaissance :

- **Analyse de veille** : S'il détecte qu'un appareil est en mode veille (consommation résiduelle), il coupe totalement le relais après 10 minutes.
- **Optimisation IA** : Il expose une métrique de coût en temps réel, permettant à l'IA de décider de décaler une tâche (ex: chauffer l'eau) pendant les heures creuses.

## ⚡ Analyse Avancée du 120V/240V (NILM & Sémantique Électrique)

Le Keystone n'est pas qu'un interrupteur ; c'est un **oscilloscope sémantique**. En exploitant les dernières technologies de **Non-Intrusive Load Monitoring (NILM)**, il peut extraire une quantité phénoménale d'informations.

## ⚡ L'Écosystème Zéro-Config (La Magie du CPL)

Plutôt que d'avoir un gros dispositif centralisé complexe, ou plein de prises WiFi compliquées à configurer, le **MCP Keystone** utilise une architecture hybride en deux parties qui communiquent via **CPL (Courants Porteurs en Ligne / Power Line Communication)**.

**Le principe : l'Internet passe par tes fils électriques 120V.**

### 1. La "Keystone Gateway" (Le Pont Internet)

- Fini le panneau électrique dangereux et les câbles extérieurs. Tu installes une seule **Gateway** en la branchant simplement sur **n'importe quelle prise murale** de la maison (idéalement près de ton routeur).
- Son seul rôle est de faire le pont entre l'Internet (via WiFi ou câble Ethernet) et le réseau électrique en cuivre de ta maison.
- **C'est le seul appareil de l'écosystème branché à l'Internet**. Il agit comme le chef d'orchestre pour le MCP.

### 2. Le "Keystone Pass-Through" (Le Muscle Décentralisé)

- Ce sont de simples adaptateurs (format Smart Plug) à 12$ que tu branches sur n'importe quelle prise murale classique dans la maison.
- Tu branches ton appareil (ex: radiateur) dessus.
- **La Magie (Zéro Config)** : Ces petits adaptateurs **n'ont pas besoin de WiFi**. Ils envoient leurs données (et reçoivent les commandes "ON/OFF") directement _à travers le fil électrique en cuivre_ dans les murs, jusqu'à la Gateway.

### 3. Le "Keystone Smart Breaker" (L'Approche Invisible)

Si tu es propriétaire, que tu rénoves, et que tu _veux absolument_ que l'installation soit invisible dans le panneau électrique, le Keystone existe au format **Disjoncteur (Smart Breaker)**.

- **Le Format** : Il ressemble exactement à un disjoncteur standard (ex: type Siemens, Square D) et se clippe dans le panneau.
- **La Fonction** : Il contient la puce CPL (pour parler à la Gateway branchée dans le salon), l'analyse électrique (NILM), et un gros relais 15A ou 20A.
- **L'Action Complète** : Il permet à l'IA de désactiver un circuit de maison entier (ex : "Toutes les prises de la chambre parentale").
- **⚠️ Contrainte** : Il coûte plus cher (environ 35$) et **nécessite un électricien** (ou de couper le courant général) pour l'installer, car il remplace un disjoncteur physique. Mais c'est la solution ultime pour un contrôle "dans les murs".

**L'Avantage Absolu** :

- Tu achètes un adaptateur Keystone, tu le branches dans le salon.
- En 1 seconde, la _Gateway_ le détecte via le réseau électrique 120V.
- Claude (l'IA) te dit immédiatement : _"Nouveau Keystone Pluggé détecté dans le circuit. Je vois un radiateur de 1500W. L'outil `toggle_radiateur` est maintenant disponible."_
- **Pas de mot de passe WiFi à entrer, pas d'appli mobile à télécharger.** Du vrai "Plug & Play" industriel.

## Modèle Économique & Viabilité

Le MCP Keystone est conçu pour être l'appareil le moins cher du marché pour sa puissance sémantique.

### 💰 Coût de Production (BOM - Estimé pour 1000 unités)

- **Cœur ESP32-C3/S3** : 2.50$
- **Module PoE (Power over Ethernet)** : 4.50$
- **Relais de puissance & Borniers** : 1.80$
- **Boîtier ABS standard (Type Industriel)** : 0.70$
- **Composants passifs & PCB** : 1.50$
- **Assemblage & Tests** : 1.00$
- **TOTAL PRODUCTION** : **~12.00$ USD**

### 🏷️ Stratégie de Vente

- **Prix de Vente Conseillé (MSRP)** : **24.99$ USD**
- **Kit DIY (Sans boîtier)** : **14.99$ USD**
- **Pack Entreprise (10 unités)** : **199.00$ USD**

### 💡 Rentabilité

Même avec un prix de vente agressif de ~25$, la marge brute est de **plus de 50%**. L'objectif n'est pas de faire du profit sur le hardware, mais de standardiser l'accès physique pour les agents IA et de créer un écosystème de "Keystone-Ready" devices.

## Protocole de Communication (Pipeline Sémantique)

Le Keystone fonctionne sur un modèle de **Pipeline Sémantique** extrêmement simple et robuste :

### 1. Transport Hardware (PoE/TCP)

Bien que l'appareil soit sur le réseau via PoE, il n'utilise pas d'API REST lourde. Il expose un port TCP brut qui agit comme un **Tunnel STDIN/OUT distant**.

- L'agent IA (sur ton PC) se connecte au Keystone via SSH ou Telnet sécurisé.
- Les flux JSON-RPC du Model Context Protocol (MCP) passent directement dans ce tunnel.

### 2. Gestion Interne (Firmware)

Le Keystone reçoit les requêtes MCP sur son **STDIN virtuel** :

- `Client (PC) -> JSON-RPC -> Tunnel TCP -> Keystone (STDIN)`
  Le Keystone répond instantanément via son **STDOUT virtuel** :
- `Keystone (STDOUT) -> Tunnel TCP -> JSON-RPC -> Client (PC)`

### 3. Pourquoi ce choix ?

- **Latence Zéro** : Pas de surcharge HTTP, pas de headers inutiles.
- **Transparence** : Pour l'IA, le Keystone semble branché directement en local ("Local Device"), même s'il est à l'autre bout du bâtiment via Ethernet.
- **Sécurité** : Le flux STDIN/OUT est crypté par le tunnel (mTLS ou SSH), rendant l'accès physique impossible à pirater depuis l'extérieur.

## Architecture Logicielle

Le boîtier exécute un serveur MCP minimaliste qui expose :

- **Resources** : Lectures directes de capteurs (ex: `keystone://sensors/temperature`).
- **Tools** : Actions physiques (ex: `keystone_move_servo`, `keystone_pulse_output`).
- **Prompts** : Modèles d'interaction (ex: "Optimise la consommation électrique de la pièce").

## La différence avec le "Keystone" ?

Les appareils connectés actuels (Shelly, Sonoff, Philips Hue) sont des objets classiques. Ils parlent des protocoles techniques comme HTTP ou MQTT et nécessitent souvent un serveur intermédiaire (Home Assistant, Cloud propriétaire).

L'ingéniosité du **MCP Keystone**, c'est qu'il parle **directement le langage de l'IA**. Au lieu de passer par une interface complexe, le boîtier se présente lui-même à Claude :

> _"Salut, je suis un Keystone. J'ai un bouton et un relais. Voici comment tu peux m'utiliser."_

Il n'y a plus de "traduction" nécessaire : l'appareil devient une extension naturelle des capacités de l'intelligence artificielle.
