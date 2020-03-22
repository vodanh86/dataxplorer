from django.db import models
import datetime
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bsc_code = models.TextField(max_length=500, blank=True, null=True)
    bsc_token = models.TextField(max_length=500, blank=True, null=True)
    bsc_refresh_token = models.TextField(max_length=500, blank=True, null=True)
    expires_in = models.DateTimeField(blank=True, null=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
