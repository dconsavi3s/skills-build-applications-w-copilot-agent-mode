mode: 'agent'
model: GPT-4.1

# Django App Updates

- Tous les fichiers du projet Django se trouvent dans le répertoire `octofit-tracker/backend/octofit_tracker`.

1. Mettre à jour `settings.py` pour la connexion MongoDB et CORS.
2. Mettre à jour `models.py`, `serializers.py`, `urls.py`, `views.py`, `tests.py` et `admin.py` pour prendre en charge les collections users, teams, activities, leaderboard et workouts.
3. S'assurer que `/` pointe vers l'API et que `api_root` est présent dans `urls.py`. (Voir <attachments> ci-dessus pour le contenu des fichiers. Il n'est pas nécessaire de rechercher ou lire à nouveau le fichier.)
