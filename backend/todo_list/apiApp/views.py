from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.decorators import action
from collections import Counter
from apiApp.models import UserCred, TodoData
from apiApp.serializers import UserCredSerializer, TodoDataSerializer


def get_stats():
    all_todos = list(TodoData.objects.values())
    status_counts = Counter(todo['status'] for todo in all_todos)

    return [
        {'label': 'All', 'value': len(all_todos)},
        {'label': 'Completed', 'value': status_counts.get('completed', 0)},
        {'label': 'In Progress', 'value': status_counts.get('in progress', 0)},
        {'label': 'Archived', 'value': status_counts.get('archived', 0)},
    ]
@api_view(['POST'])
def login(request, format=None):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user_get = user_cred.objects.get(email = email)
        
    except user_cred.DoesNotExist :
        return Response({
                        "success": False, 
                        'message': 'User does not exist'
                        }, status=404)
    
    if(check_password(password, user_get.password)):
        return Response({
                        "success": True,
                        "message": "Login successful"
                        }, status=201)
    else:
        return Response({
                        "success": False,
                        "error": "Invalid credentials"  
                        }, status=401)


@api_view(['POST'])
def create_user(request, format=None):

    try:
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        if user_cred.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, status=409)

        enc_pass = make_password(password)
        obj = user_cred(name=name, email=email, password=enc_pass)
        obj.save()

        return Response({'message': 'User created'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    new_password = request.data.get('new_password')

    try:
        user = user_cred.objects.get(email=email)
        user.password = make_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful'}, status=200)
    except user_cred.DoesNotExist:
        return Response({'error': 'Email not found'}, status=404)


@api_view(['GET'])
def get_user_profile(request):
    email = request.GET.get('email')
    try:
        user = user_cred.objects.get(email=email)
        return Response({
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'dob': user.dob,
            'gender': user.gender,
            'profile_picture': user.profile_picture.url if user.profile_picture else ''
        })
    except user_cred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def update_user_profile(request):
    email = request.data.get('email')
    try:
        user = user_cred.objects.get(email=email)
        user.name = request.data.get('name', user.name)
        user.phone = request.data.get('phone', user.phone)
        user.dob = request.data.get('dob', user.dob)
        user.gender = request.data.get('gender', user.gender)
        
        # Handle removal before upload
        if request.data.get('remove_profile_picture') == 'true':
            if user.profile_picture:
                user.profile_picture.delete(save=False)
                user.profile_picture = None

        # Handle profile picture upload (if not removed)
        elif 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']

        user.save()
        return Response({'message': 'Profile updated successfully'})
    except user_cred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# @api_view(['POST'])
# def login(request):
#     try:
#         username = request.data.get('username')
#         password = request.data.get('password')

#         if not username or not password:
#             return Response({'message': 'Username and password are required'}, status=400)

#         try:
#             user = UserCred.objects.get(username=username)
#         except UserCred.DoesNotExist:
#             return Response({'message': 'User does not exist'}, status=404)

#         if check_password(password, user.password):
#             return Response({'message': 'Successfully logged in'}, status=200)
#         else:
#             return Response({'message': 'Wrong credentials'}, status=401)

#     except Exception as e:
#         return Response({'error': str(e)}, status=500)


# @api_view(['POST'])
# def create_user(request):
#     username = request.data.get('username')
#     password = request.data.get('password')

#     if UserCred.objects.filter(username=username).exists():
#         return Response({'error': 'Username already exists'}, status=400)

#     hashed_password = make_password(password)
#     UserCred.objects.create(username=username, password=hashed_password)
#     return Response({'message': 'User created successfully'}, status=201)


@api_view(['POST'])
def create_todo(request):
    title = request.data.get('title')
    desc = request.data.get('desc')
    status = 'in progress'

    TodoData.objects.create(title=title, desc=desc, status=status)

    todos = TodoData.objects.exclude(status='archived').values('id', 'title', 'desc', 'status')
    return Response({
        'message': 'Todo created successfully',
        'todo_data': todos,
        'stats': get_stats()
    })


@api_view(['GET'])
def initial_call(request):
    todos = TodoData.objects.exclude(status='archived').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Successful', 'todo_data': todos, 'stats': get_stats()})


@api_view(['GET'])
def completed(request):
    todos = TodoData.objects.filter(status='completed').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Successful', 'todo_data': todos, 'stats': get_stats()})


@api_view(['GET'])
def in_progress(request):
    todos = TodoData.objects.filter(status='in progress').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Successful', 'todo_data': todos, 'stats': get_stats()})


@api_view(['GET'])
def archived(request):
    todos = TodoData.objects.filter(status='archived').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Successful', 'todo_data': todos, 'stats': get_stats()})


@api_view(['POST'])
def complete_task(request):
    task_id = request.data.get('id')
    TodoData.objects.filter(id=task_id).update(status='completed')
    todos = TodoData.objects.exclude(status='archived').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Task marked as completed', 'todo_data': todos, 'stats': get_stats()})


@api_view(['POST'])
def archive_task(request):
    task_id = request.data.get('id')
    TodoData.objects.filter(id=task_id).update(status='archived')
    todos = TodoData.objects.exclude(status='archived').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Task archived', 'todo_data': todos, 'stats': get_stats()})


@api_view(['DELETE'])
def delete_task(request):
    task_id = request.data.get('id')
    TodoData.objects.filter(id=task_id).delete()
    todos = TodoData.objects.exclude(status='archived').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Task deleted', 'todo_data': todos, 'stats': get_stats()})


@api_view(['PUT'])
def update_task(request):
    task_id = request.data.get('id')
    title = request.data.get('title')
    desc = request.data.get('desc')
    TodoData.objects.filter(id=task_id).update(title=title, desc=desc)
    todos = TodoData.objects.exclude(status='archived').values('id', 'title', 'desc', 'status')
    return Response({'message': 'Task updated', 'todo_data': todos, 'stats': get_stats()})


# Optional ViewSets (for Router-based endpoints)
class UserCredViewSet(viewsets.ModelViewSet):
    queryset = UserCred.objects.all()
    serializer_class = UserCredSerializer


class TodoDataViewSet(viewsets.ModelViewSet):
    queryset = TodoData.objects.all()
    serializer_class = TodoDataSerializer