from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import UserAccount, UserFavourites, change_password

urlpatterns = [
    path('', UserAccount.as_view()),
    path('token/obtain', TokenObtainPairView.as_view(), name='token_create'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify', TokenVerifyView.as_view(), name='token_verify'),
    path('password', change_password, name='change_password'),
    path('favourites', UserFavourites.as_view()),
    path('favourites/<int:favourite_id>', UserFavourites.as_view())
]

