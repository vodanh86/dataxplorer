from main.models import Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        user = {}
        user["firstName"] = self.user.username
        user["id"] = self.user.id
        user["email"] = self.user.email
        try:
            profile = Profile.objects.get(pk=self.user.id)
            user["bsc_token"] = profile.bsc_token
            user["expires_in"] = profile.expires_in.strftime('%Y-%m-%d %I:%M %p')
        except Profile.DoesNotExist:
            pass
        data["user"] = user
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
