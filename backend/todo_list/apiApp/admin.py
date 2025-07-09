from django.contrib import admin
from apiApp.models import UserCred, TodoData

@admin.register(UserCred)
class UserCredAdmin(admin.ModelAdmin):
    list_display = ('id', 'username')              
    search_fields = ('username',)                   
    ordering = ('id',)                            
    list_per_page = 20                              

@admin.register(TodoData)
class TodoDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'status')        
    search_fields = ('title', 'desc')               
    list_filter = ('status',)                       
    ordering = ('-id',)                             
    list_editable = ('status',)                     
    list_per_page = 20 