from django.conf.urls import url, include
from main import views as main_views
from django.views import generic
from rest_framework import status, serializers, views
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.schemas import get_schema_view
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from main.jwt_serializer.my_token_serializer import MyTokenObtainPairView


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField()


class EchoView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


urlpatterns = [
    url(r'^$', generic.RedirectView.as_view(url='/api/', permanent=False)),
    url(r'^api/$', get_schema_view()),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/auth/token/obtain/$', MyTokenObtainPairView.as_view()),
    url(r'^api/auth/token/refresh/$', TokenRefreshView.as_view()),
    url(r'^api/user/updateToken/$', main_views.update_token, name='token_obtain_pair'),
    url(r'^api/user/refreshToken/$', main_views.refresh_token, name='token_obtain_pair'),
    url(r'^api/config/getConfig/$', main_views.get_config, name='token_obtain_pair'),
    url(r'^api/config/getMapping/$', main_views.get_mapping, name='token_obtain_pair'),
    url(r'^api/echo/$', EchoView.as_view())
]
