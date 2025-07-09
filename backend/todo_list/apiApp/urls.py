from django.urls import path, include
from rest_framework.routers import DefaultRouter
import apiApp.views as v
from apiApp.views import UserCredViewSet, TodoDataViewSet

router = DefaultRouter()
router.register('user', UserCredViewSet, basename='user')
router.register('todo', TodoDataViewSet, basename='todo')

urlpatterns = [
    path('', include(router.urls)),

    # Auth and user-related endpoints
    path('login/',v.login,name='login'),
    path('create_user/',v.create_user,name='create_user'),
    path('reset-password/', v.reset_password, name='reset-password'),
    
    path('create_todo/', v.create_todo, name='create_todo'),
    path('initial_call/', v.initial_call, name='initial_call'),
    path('completed/', v.completed, name='completed'),
    path('in_progress/', v.in_progress, name='in_progress'),
    path('archived/', v.archived, name='archived'),
    path('complete_task/', v.complete_task, name='complete_task'),
    path('archive_task/', v.archive_task, name='archive_task'),
    path('delete_task/', v.delete_task, name='delete_task'),
    path('update_task/', v.update_task, name='update_task'),
]