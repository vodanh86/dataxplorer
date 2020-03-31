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
        print(bsc_tokens)
        profile.bsc_code = code
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
def refresh_token(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    return JsonResponse({"user": get_user_from_bsc(user)})


def get_user_from_bsc(user):
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
    return user


@csrf_exempt
def get_config(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    config = bsc_api.get_config(bsc_token)
    mapping = bsc_api.get_mapping(bsc_token)
    if "symbols" in mapping:
        mapping["symbols"] = mapping["symbols"][:100]
    return JsonResponse({"config": config, "mapping": mapping})


@csrf_exempt
def get_mapping(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    config = bsc_api.get_mapping(bsc_token)
    return JsonResponse({"mapping": config})


@csrf_exempt
def check_token(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    bsc_refresh_token = user.get("bsc_refresh_token")
    config = bsc_api.get_accounts(bsc_token)
    if config.get("s") == 401:
        user = get_user_from_bsc(user)
    return JsonResponse({"user": user})


@csrf_exempt
def get_accounts(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    config = bsc_api.get_accounts(bsc_token)
    return JsonResponse({"accounts": config})


@csrf_exempt
def place_order(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    order = post_data.get("order", {})
    order_status = bsc_api.place_order(bsc_token, order)
    return JsonResponse({"order_status": order_status})


@csrf_exempt
def edit_order(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    order = post_data.get("order", {})
    order_status = bsc_api.place_order(bsc_token, order)
    return JsonResponse({"order_status": order_status})


@csrf_exempt
def cancel_order(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    order_id = post_data.get("orderId", "")
    account_id = post_data.get("accountId", "")
    order_status = bsc_api.cancel_order(bsc_token, account_id, order_id)
    return JsonResponse({"order_status": order_status})

@csrf_exempt
def close_position(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    position_id = post_data.get("positionId", "")
    account_id = post_data.get("accountId", "")
    order_status = bsc_api.close_position(bsc_token, account_id, position_id)
    return JsonResponse({"position_status": order_status})

@csrf_exempt
def get_account_info(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    account_id = post_data.get("accountId")
    instrument_id = post_data.get("instrumentId")
    state = bsc_api.get_state(bsc_token, account_id)
    orders = bsc_api.get_orders(bsc_token, account_id)
    positions = bsc_api.get_positions(bsc_token, account_id)
    executions = bsc_api.get_executions(bsc_token, account_id, instrument_id)
    orders_history = bsc_api.get_orders_history(bsc_token, account_id)
    instruments = bsc_api.get_instruments(bsc_token, account_id)
    instruments["d"] = instruments["d"][:100]
    return JsonResponse({"accountInfo": {"state": state, "orders": orders, "positions": positions, "instruments": instruments, "executions": executions, "orders_history": orders_history}})


@csrf_exempt
def get_market_data(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    symbol = post_data.get("symbol")
    quotes = bsc_api.get_quotes(bsc_token, symbol)
    depth = bsc_api.get_depth(bsc_token, symbol)
    #instruments = bsc_api.get_instruments(bsc_token, symbol)
    return JsonResponse({"quotes": quotes, "depth": depth})


@csrf_exempt
def get_trading_info(request):
    post_data = json.loads(request.body)
    user = post_data.get("user", {})
    bsc_token = user.get("bsc_token")
    account_id = post_data.get("accountId")
    orders = bsc_api.get_orders(bsc_token, account_id)
    positions = bsc_api.get_positions(bsc_token, account_id)
    return JsonResponse({"orders": orders, "positions": positions})
