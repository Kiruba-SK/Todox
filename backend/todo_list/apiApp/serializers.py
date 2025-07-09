from rest_framework import serializers
from apiApp.models import UserCred, TodoData

class UserCredSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCred
        fields = '__all__'

class TodoDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoData
        fields = '__all__'