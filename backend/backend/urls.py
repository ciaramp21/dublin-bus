from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('bus/', include('bus.urls')),
    path('user/', include('user.urls')),
    path('admin/', admin.site.urls),
    path('', include('django.contrib.auth.urls')),
]

