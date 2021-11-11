from api.models import UserProfile, SdUser
from datetime import datetime
from dataclasses import dataclass

@dataclass
class UserDAO:
    _userProfile: UserProfile = None
    id: int = None
    first_name: str = None
    last_name: str = None
    username: str = None
    department: str = None
    lastAccess: datetime = None

    def __post_init__(self):
        """This adds a user if a supplied UserProfile does not have one"""
        if self._userProfile is None:
            self._userProfile = UserProfile()
        if not hasattr(self._userProfile, 'user'):
            self._userProfile.user = SdUser()

    @classmethod
    def read(cls, userId: int):
        user_profile_model = UserProfile.objects.get(pk=userId)

        return cls(
            id=user_profile_model.user_id,
            first_name=user_profile_model.user.first_name,
            last_name=user_profile_model.user.last_name,
            username=user_profile_model.user.username,
            department=user_profile_model.department,
            lastAccess=user_profile_model.user.last_login,  # TODO: rename this for consistency
            _userProfile=user_profile_model
        )

    @staticmethod
    def readAll():
        userProfileModels = UserProfile.objects.all()
        userProfileList = []

        for profile in userProfileModels:
            userProfileDAO = UserDAO(
                id=profile.user_id,
                first_name=profile.user.first_name,
                last_name=profile.user.last_name,
                username=profile.user.username,
                department=profile.department,
                lastAccess=profile.user.last_login,  # TODO: rename this for consistency
                _userProfile=profile
            )
            userProfileList.append(userProfileDAO)

        return userProfileList

    def save(self):
        if self.id is not None:
            self._userProfile.user.id = self.id
        self._userProfile.user.first_name = self.first_name
        self._userProfile.user.last_name = self.last_name
        self._userProfile.user.username = self.username
        self._userProfile.department = self.department
        self._userProfile.user.lastAccess = self.lastAccess

        self._userProfile.user.save()
        self._userProfile.save()
        #  Assign here in case there was no ID (will happen on initial create)
        self.id = self._userProfile.user_id

    def delete(self):
        self._userProfile.delete()
