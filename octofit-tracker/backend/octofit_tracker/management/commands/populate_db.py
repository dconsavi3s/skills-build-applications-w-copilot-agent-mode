from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from djongo import models
from django.db import connection

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear all collections (respect dependencies)
        for obj in Leaderboard.objects.all():
            if obj.pk:
                obj.delete()
        for obj in Activity.objects.all():
            if obj.pk:
                obj.delete()
        for team in Team.objects.all():
            team.members.clear()
        for obj in Team.objects.all():
            if obj.pk:
                obj.delete()
        for obj in Workout.objects.all():
            if obj.pk:
                obj.delete()
        for obj in User.objects.all():
            if obj.pk:
                obj.delete()

        # Create users (super heroes)
        marvel_users = [
            User(username='ironman', email='ironman@marvel.com', first_name='Tony', last_name='Stark'),
            User(username='spiderman', email='spiderman@marvel.com', first_name='Peter', last_name='Parker'),
            User(username='captainamerica', email='captainamerica@marvel.com', first_name='Steve', last_name='Rogers'),
        ]
        dc_users = [
            User(username='batman', email='batman@dc.com', first_name='Bruce', last_name='Wayne'),
            User(username='superman', email='superman@dc.com', first_name='Clark', last_name='Kent'),
            User(username='wonderwoman', email='wonderwoman@dc.com', first_name='Diana', last_name='Prince'),
        ]
        for user in marvel_users + dc_users:
            user.save()

        # Create teams
        marvel_team = Team(name='Marvel')
        marvel_team.save()
        marvel_team.members.add(*marvel_users)
        dc_team = Team(name='DC')
        dc_team.save()
        dc_team.members.add(*dc_users)

        # Create workouts
        workout1 = Workout(name='Cardio Blast', description='High intensity cardio workout', difficulty='Medium')
        workout2 = Workout(name='Strength Training', description='Build muscle and strength', difficulty='Hard')
        workout1.save()
        workout2.save()

        # Create activities
        Activity.objects.create(user=marvel_users[0], type='Running', duration=30, calories=300, date='2025-12-01')
        Activity.objects.create(user=dc_users[0], type='Cycling', duration=45, calories=400, date='2025-12-02')

        # Create leaderboard
        Leaderboard.objects.create(team=marvel_team, points=100, rank=1)
        Leaderboard.objects.create(team=dc_team, points=90, rank=2)

        # Create unique index on email for users
        with connection.cursor() as cursor:
            cursor.execute('''db.users.createIndex({ "email": 1 }, { "unique": true })''')

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
