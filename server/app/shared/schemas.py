from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


# Presentation of different types in system
# Loosely related to models


# Base Album class
class AlbumBase(BaseModel):
    title: str
    description: str
    private: bool
    image: Optional[str] = None
    filename: Optional[str] = None


# Album before creation (it has user id)
class AlbumCreate(AlbumBase):
    user_id: int


# Base Picture class
class PictureBase(BaseModel):
    title: str
    description: str
    image: Optional[str] = None
    filename: Optional[str] = None


# Picture before creation (it has album id)
class PictureCreate(PictureBase):
    album_id: int


# Picture after creation (it has id)
class Picture(PictureBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# Album after creation (it has id)
class Album(AlbumBase):
    id: int
    user_id: int
    created_at: datetime

    pictures: List[Picture] = []

    class Config:
        orm_mode = True


# Base User class
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str


# Login data
class UserLogin(BaseModel):
    email: str
    password: str


# User before creation (it has password)
class UserCreate(UserBase):
    password: str


# Update password for user (via forgot password)
class UserForgotPassword(BaseModel):
    email: str
    password: str
    token: str


# User after creation (it has id and albums)
class User(UserBase):
    id: int
    albums: List[Album] = []

    class Config:
        orm_mode = True


# Album with user
class AlbumWithUser(Album):
    user: User

    class Config:
        orm_mode = True


# Token for password restoration
class TokenResponse(BaseModel):
    token: str


# Request to download picture
class Download(BaseModel):
    id: int
    created_at: datetime
    requestor_id: int
    requestor: User
    owner_id: int
    album_id: int
    album: Album
    picture_id: int
    picture: Picture

    class Config:
        orm_mode = True
