# 🏃 RunBack — Guide de déploiement pas à pas

## Ce que tu vas faire
Mettre ton app RunBack en ligne gratuitement pour y accéder depuis ton téléphone.
**Temps estimé : 10-15 minutes** (la première fois).

---

## ÉTAPE 1 : Créer les comptes nécessaires (une seule fois)

### 1a. Créer un compte GitHub (si tu n'en as pas)
1. Va sur **https://github.com/signup**
2. Crée un compte avec ton email
3. Confirme ton email

### 1b. Créer un compte Vercel (gratuit)
1. Va sur **https://vercel.com/signup**
2. Clique sur **"Continue with GitHub"**
3. Autorise Vercel à accéder à ton GitHub

---

## ÉTAPE 2 : Installer les outils

### Sur Mac :
Ouvre le **Terminal** (cherche "Terminal" dans Spotlight avec Cmd+Espace) et tape :
```
curl -fsSL https://get.pnpm.io/install.sh | sh -
```
Puis ferme et réouvre le Terminal.

### Sur Windows :
1. Installe **Node.js** depuis https://nodejs.org (prends la version LTS)
2. Ouvre **PowerShell** et tape :
```
npm install -g pnpm
```

### Installe Vercel CLI :
```
pnpm install -g vercel
```

---

## ÉTAPE 3 : Préparer le projet

1. **Dézippe** le fichier `runback-app.zip` quelque part sur ton ordinateur
   (par exemple sur ton Bureau)

2. **Ouvre un terminal** et navigue dans le dossier :
   ```
   cd ~/Bureau/runback-app
   ```
   (ou là où tu as dézippé)

3. **Installe les dépendances** :
   ```
   pnpm install
   ```

4. **Teste en local** (optionnel mais recommandé) :
   ```
   pnpm dev
   ```
   → Ouvre http://localhost:5173 dans ton navigateur pour vérifier que tout marche.
   → Fais Ctrl+C pour arrêter.

---

## ÉTAPE 4 : Déployer en ligne !

1. **Dans le terminal**, tape :
   ```
   vercel
   ```

2. Il va te demander :
   - **Set up and deploy?** → tape `y` (yes)
   - **Which scope?** → sélectionne ton compte
   - **Link to existing project?** → tape `n` (no)
   - **What's your project's name?** → tape `runback` (ou ce que tu veux)
   - **In which directory is your code located?** → tape `.` (point)
   - **Want to modify these settings?** → tape `n`

3. **Attends** 30 secondes... et c'est LIVE ! 🎉

4. Vercel va te donner une URL comme :
   ```
   https://runback-xxxxx.vercel.app
   ```
   **C'est ton app !** Ouvre cette URL sur ton téléphone.

---

## ÉTAPE 5 : Ajouter l'app sur ton écran d'accueil

### Sur iPhone :
1. Ouvre l'URL dans **Safari** (pas Chrome)
2. Tape sur l'icône **Partager** (carré avec flèche vers le haut)
3. Scroll et tape **"Sur l'écran d'accueil"**
4. Tape **"Ajouter"**
5. L'app apparaît sur ton écran d'accueil comme une vraie app !

### Sur Android :
1. Ouvre l'URL dans **Chrome**
2. Tape sur les **3 points** en haut à droite
3. Tape **"Ajouter à l'écran d'accueil"**
4. Tape **"Ajouter"**

---

## ÉTAPE 6 : Mettre à jour l'app (quand je te donne une nouvelle version)

1. Remplace le fichier `src/App.jsx` par la nouvelle version
2. Dans le terminal, tape :
   ```
   vercel --prod
   ```
3. C'est mis à jour ! Rafraîchis l'app sur ton téléphone.

---

## 🔧 En cas de problème

### "command not found: pnpm"
→ Ferme et réouvre le terminal, ou utilise `npm` à la place de `pnpm`

### "command not found: vercel"  
→ Tape `npx vercel` à la place de `vercel`

### L'app ne s'affiche pas
→ Vérifie que `pnpm dev` fonctionne en local d'abord

### Les notifications ne marchent pas sur iPhone
→ Normal : iOS limite les notifications web. Elles marchent sur Android et desktop.

---

**Tu es bloqué ?** Copie-colle le message d'erreur et envoie-le moi, je t'aide !
