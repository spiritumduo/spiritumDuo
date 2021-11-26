from api.common import db_sync_to_async
from api.models import SdUser, UserProfile

@db_sync_to_async
def CreateUser(
    first_name:str=None,
    last_name:str=None,
    username:str=None,
    password:str=None,
    is_staff:str=None,
    is_superuser:str=None,
    department:str=None,
):
      user=SdUser.objects.create_user(
          first_name=first_name,
          last_name=last_name,
          username=username,
          password=password,
          is_staff=is_staff,
          is_superuser=is_superuser,
      )
      user.save()
      profile=UserProfile(
          user=user,
          department=department
      )
      profile.save()
      return user