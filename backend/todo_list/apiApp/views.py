from django.contrib.auth.hashers import make_password, check_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from collections import Counter
from apiApp.models import UserCred, TodoData
from apiApp.serializers import UserCredSerializer, TodoDataSerializer


def get_stats(user):
    all_todos = list(TodoData.objects.filter(user=user).values())

    # Use .get('status', '') to avoid KeyError
    status_counts = Counter(todo.get('status', '').lower() for todo in all_todos)

    return [
        {'label': 'All', 'value': len(all_todos)},
        {'label': 'Completed', 'value': status_counts.get('completed', 0)},
        {'label': 'In Progress', 'value': status_counts.get('in progress', 0)},
        {'label': 'Archived', 'value': status_counts.get('archived', 0)},
    ]


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = UserCred.objects.get(email=email)
    except UserCred.DoesNotExist:
        return Response({"error": "User does not exist"}, status=404)

    if check_password(password, user.password):
        return Response({"success": True, "message": "Login successful"}, status=200)
    else:
        return Response({"error": "Invalid credentials"}, status=401)
        

@api_view(['POST'])
def create_user(request):
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        if UserCred.objects.filter(email=email).exists():
            return Response({'error': 'User already exists'}, status=409)

        enc_pass = make_password(password)
        UserCred.objects.create(name=name, email=email, password=enc_pass)

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
    email = request.data.get('email')

    try:
        user = UserCred.objects.get(email=email)
        TodoData.objects.create(user=user, title=title, desc=desc, status='in progress')
        todos = TodoData.objects.filter(user=user).exclude(status='archived').values()
        return Response({'message': 'Todo created successfully', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['GET', 'POST'])
def initial_call(request):
    if request.method == 'POST':
        email = request.data.get('email')
    else:
        email = request.query_params.get('email')
    print("Received email:", email)

    if not email:
        return Response({'error': 'Email query param is required'}, status=400)

    try:
        user = UserCred.objects.get(email=email)
        todos = TodoData.objects.filter(user=user).exclude(status='archived').values()
        stats = get_stats(user)  # Could throw error
        return Response({
            'message': 'Successful',
            'todo_data': list(todos),
            'stats': stats
        })
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except Exception as e:
        import traceback
        print("Unhandled error in initial_call:", traceback.format_exc())
        return Response({'error': 'Internal server error', 'detail': str(e)}, status=500)



@api_view(['POST'])
def completed(request):
    email = request.data.get('email')
    try:
        user = UserCred.objects.get(email=email)
        todos = TodoData.objects.filter(user=user, status='completed').values()
        return Response({'message': 'Successful', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
def in_progress(request):
    email = request.data.get('email')
    try:
        user = UserCred.objects.get(email=email)
        todos = TodoData.objects.filter(user=user, status='in progress').values()
        return Response({'message': 'Successful', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
def archived(request):
    email = request.data.get('email')
    try:
        user = UserCred.objects.get(email=email)
        todos = TodoData.objects.filter(user=user, status='archived').values()
        return Response({'message': 'Successful', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
def complete_task(request):
    task_id = request.data.get('id')
    email = request.data.get('email')
    try:
        user = UserCred.objects.get(email=email)
        task = TodoData.objects.filter(id=task_id, user=user).first()
        if task:
            task.status = 'completed'
            task.save()
        todos = TodoData.objects.filter(user=user).exclude(status='archived').values()
        return Response({'message': 'Task marked as completed', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['POST'])
def archive_task(request):
    task_id = request.data.get('id')
    email = request.data.get('email')
    try:
        user = UserCred.objects.get(email=email)
        task = TodoData.objects.filter(id=task_id, user=user).first()
        if task:
            task.status = 'archived'
            task.save()
        todos = TodoData.objects.filter(user=user).exclude(status='archived').values()
        return Response({'message': 'Task archived', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['DELETE'])
def delete_task(request):
    task_id = request.data.get('id')
    email = request.data.get('email')
    try:
        user = UserCred.objects.get(email=email)
        TodoData.objects.filter(id=task_id, user=user).delete()
        todos = TodoData.objects.filter(user=user).exclude(status='archived').values()
        return Response({'message': 'Task deleted', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


@api_view(['PUT'])
def update_task(request):
    task_id = request.data.get('id')
    title = request.data.get('title')
    desc = request.data.get('desc')
    email = request.data.get('email')
    try:
        user = UserCred.objects.get(email=email)
        TodoData.objects.filter(id=task_id, user=user).update(title=title, desc=desc)
        todos = TodoData.objects.filter(user=user).exclude(status='archived').values()
        return Response({'message': 'Task updated', 'todo_data': todos, 'stats': get_stats(user)})
    except UserCred.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)


# Optional ViewSets (not required in your case, but fine to keep)
class UserCredViewSet(viewsets.ModelViewSet):
    queryset = UserCred.objects.all()
    serializer_class = UserCredSerializer


class TodoDataViewSet(viewsets.ModelViewSet):
    queryset = TodoData.objects.all()
    serializer_class = TodoDataSerializer
