import json
from datetime import datetime
from datetime import timedelta
from django.contrib.auth.models import User, Group
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import permissions
from main.serializers import UserSerializer, GroupSerializer
from django.views.decorators.csrf import csrf_exempt
from main.api import BscApi
from main.models import Profile


bsc_api = BscApi("http://apiuat.bsc.com.vn:1347/oauth/token",
                 "http://apiuat.bsc.com.vn:1337/")


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


@csrf_exempt
def update_token(request):
    post_data = json.loads(request.body)
    code = post_data.get("code")
    user = post_data.get("user")

    obj_user = User.objects.get(pk=user.get("id"))
    try:
        profile = Profile.objects.get(pk=user.get("id"))
    except Profile.DoesNotExist:
        profile = Profile(user=obj_user)
        profile.save()

    if (profile.bsc_code != code):
        bsc_tokens = bsc_api.get_token(code)
        profile.bsc_code = code
        profile.bsc_token = bsc_tokens.get("access_token")
        profile.bsc_refresh_token = bsc_tokens.get("refresh_token")
        profile.expires_in = datetime.now() + timedelta(seconds=bsc_tokens.get("expires_in"))
        profile.save()
        print(profile)

    user["bsc_token"] = profile.bsc_token
    user["bsc_refresh_token"] = profile.bsc_refresh_token
    user["email"] = obj_user.email
    user["expires_in"] = profile.expires_in.strftime('%Y-%m-%d %I:%M %p')
    return JsonResponse({"user": user})


@csrf_exempt
def refresh_token(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    refresh_token = user.get("bsc_refresh_token")
    obj_user = User.objects.get(pk=user.get("id"))
    try:
        profile = Profile.objects.get(pk=user.get("id"))
    except Profile.DoesNotExist:
        profile = Profile(user=obj_user)
        profile.save()

    if (refresh_token):
        bsc_tokens = bsc_api.refresh_token(refresh_token)
        profile.bsc_token = bsc_tokens.get("access_token")
        profile.bsc_refresh_token = bsc_tokens.get("refresh_token")
        profile.expires_in = datetime.now() + timedelta(seconds=bsc_tokens.get("expires_in"))
        profile.save()

    user["bsc_token"] = profile.bsc_token
    user["bsc_refresh_token"] = profile.bsc_refresh_token
    user["email"] = obj_user.email
    user["expires_in"] = profile.expires_in.strftime('%Y-%m-%d %I:%M %p')
    return JsonResponse({"user": user})


@csrf_exempt
def get_config(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    config = bsc_api.get_config(bsc_token)
    mapping = bsc_api.get_mapping(bsc_token)
    return JsonResponse({"config": config, "mapping": mapping})


@csrf_exempt
def get_mapping(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    config = bsc_api.get_mapping(bsc_token)
    return JsonResponse({"mapping": config})
