from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
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
        user_get = UserCred.objects.get(email = email)
        
    except UserCred.DoesNotExist :
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

        if UserCred.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, status=409)

        enc_pass = make_password(password)
        obj = UserCred(name=name, email=email, password=enc_pass)
        obj.save()

        return Response({'message': 'User created'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    new_password = request.data.get('new_password')

    try:
        user = UserCred.objects.get(email=email)
        user.password = make_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful'}, status=200)
    except UserCred.DoesNotExist:
        return Response({'error': 'Email not found'}, status=404)



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