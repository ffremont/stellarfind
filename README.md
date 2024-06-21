# Stellarfinder

Stellarfinder est un outil innovant conçu pour aider les astronomes amateurs et professionnels à se repérer facilement dans le ciel en utilisant des coordonnées astronomiques et des images capturées. Ce projet utilise Node.js et des bibliothèques spécifiques pour traiter des images astronomiques et déterminer les coordonnées célestes.

## Fonctionnalités

- Détection automatique et résolution astrométrique des images.
- Suivi d'un répertoire pour des images mises à jour.
- Utilisation de coordonnées d'objets célestes comme cibles.
- Utilisation des coordonnées GPS basées sur la mise en station de la table équatoriale.

## Déroulement d'une séance

1. **Mise en place du matériel** :
   - Assemblage et collimation du télescope.
   - Éventuellement, mise en station de la table équatoriale.

2. **Obtention des coordonnées GPS** :
   - Si la table équatoriale est présente, effectuer la remontée et en déduire les coordonnées GPS.
   - Ces coordonnées sont décalées de X degrés vers l'est (X étant l'inclinaison de la table).
   - Ces coordonnées GPS sont essentielles pour Stellarfinder, car elles permettent de mesurer l'écart en degrés pour atteindre une cible (catalogue Messier, IC, ou NGC).

## Prérequis

- Node 22+
- [Astrometry.net](https://astrometry.net/doc/readme.html) (commande solve-field)

## Installation

Clonez le dépôt puis installez les dépendances :

```bash
git clone https://github.com/votre-utilisateur/stellarfinder.git
cd stellarfinder
npm install
```

Pour une installation locale avec `npm link` :

```bash
npm link
```

Cette commande rend le binaire `stellarfinder` accessible globalement sur votre système.

## Utilisation

### Commande de base

```bash
stellarfinder --target=m89 --fromRA=12:12:35.066 --fromDEC=+11:35:35.629
```

### Options de ligne de commande

- `--target, -a` : Cible céleste (ex: `M31`). **Obligatoire**.
- `--fromRA, -b` : Ascension droite de départ (RA).
- `--fromDEC, -c` : Déclinaison de départ (DEC).
- `--watch, -w` : Surveiller un répertoire pour des images mises à jour.
- `--scaleLow, -l` : Valeur basse de l'échelle issue de `solve-field` en arcsec/pixel.
- `--scaleHigh, -h` : Valeur haute de l'échelle issue de `solve-field` en arcsec/pixel.
- `--latitude, -d` : Latitude du lieu (par défaut: 46.31086).
- `--longitude, -e` : Longitude du lieu (par défaut: 6.02363).
- `--altitude, -f` : Altitude du lieu en mètres (par défaut: 7).

### Exemple

Pour surveiller un répertoire `/aa/bb` et cibler M89 :

```bash
stellarfinder --target=m89 --watch=/aa/bb
```

## Fonctionnalités avancées

### Surveillance d'un répertoire

Si l'option `--watch` est spécifiée, Stellarfinder surveillera le répertoire donné pour des nouvelles images (fichiers `.png` ou `.jpg`). Lorsqu'une image est mise à jour, elle sera automatiquement traitée pour déterminer ses coordonnées célestes.

### Résolution astrométrique

Stellarfinder utilise des techniques de résolution astrométrique pour analyser les images et déterminer les coordonnées célestes. Ce processus permet d'associer une image donnée à des coordonnées spécifiques (RA et DEC), ce qui facilite la localisation précise des objets célestes dans le ciel. Les options `--scaleLow` et `--scaleHigh` (en arcsec/pixel) peuvent être utilisées pour affiner le processus de résolution.

### Choix des options

Vous pouvez utiliser Stellarfinder de deux manières principales :

1. **Avec des coordonnées équatoriales** :
   - Utilisez les options `--target`, `--fromRA` et `--fromDEC` lorsque vous disposez des coordonnées équatoriales de l'objet céleste que vous souhaitez cibler.

   ```bash
   stellarfinder --target=m89 --fromRA=12:12:35.066 --fromDEC=+11:35:35.629
   ```

2. **Avec la surveillance d'un répertoire** :
   - Utilisez les options `--target` et `--watch` pour surveiller un répertoire contenant des images. Stellarfinder effectuera une résolution astrométrique pour extraire les coordonnées équatoriales des images.

   ```bash
   stellarfinder --target=m89 --watch=/aa/bb
   ```

En résumé, Stellarfinder est un outil puissant pour l'astronomie assistée par visuel, permettant de se repérer avec précision dans le ciel grâce aux images capturées et aux coordonnées GPS déduites de la mise en station de la table équatoriale.
