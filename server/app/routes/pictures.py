from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import pictures, database
from ..shared import schemas
from .token import oauth2_scheme, verify_token

# Initialization of router /pictures
router = APIRouter(
    tags=["picture"],
    prefix="/pictures"
)


@router.get('/{picture_id}/download/')
def download_album_picture(
        picture_id: int,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(database.get_db)):
    """
    Download picture request
    :param picture_id: id of picture
    :param token: JWT token
    :param db: database session
    :return: pictures
    """
    # Verify that user is logged in
    _, user_id = verify_token(token)
    return pictures.download_picture(db,
                                     picture_id=picture_id,
                                     requestor_id=user_id)


@router.get('/{album_id}',
            response_model=Optional[List[schemas.Picture]])
def get_album_pictures(album_id: int,
                       token: str = Depends(oauth2_scheme),
                       db: Session = Depends(database.get_db)):
    """
    Get pictures of an album
    :param album_id: id of album
    :param token: JWT token
    :param db: database session
    :return: pictures
    """
    # Verify that user is logged in
    verify_token(token)
    return pictures.get_album_pictures(db, album_id=album_id)


@router.post('/', response_model=schemas.Picture)
def create_picture(picture: schemas.PictureCreate,
                   token: str = Depends(oauth2_scheme),
                   db: Session = Depends(database.get_db)):
    """
    Create a picture in album
    :param picture: picture data
    :param token: JWT token
    :param db: database session
    :return: new picture
    """
    # Verify that user is logged in
    verify_token(token)
    return pictures.create_picture(db, picture=picture)


@router.delete('/{picture_id}', response_model=str)
def delete_picture(picture_id: int,
                   token: str = Depends(oauth2_scheme),
                   db: Session = Depends(database.get_db)):
    """
    Delete the picture
    :param picture_id: picture id
    :param token: JWT token
    :param db: database session
    :return: picture id
    """
    # Verify that user is logged in
    verify_token(token)
    pictures.delete_picture(db, picture_id)
    return picture_id


@router.patch('/{picture_id}', response_model=schemas.Picture)
def update_picture(picture_id: int,
                   picture: schemas.Picture,
                   token: str = Depends(oauth2_scheme),
                   db: Session = Depends(database.get_db)):
    """
    Update picture
    :param picture_id: id of picture
    :param picture: new data
    :param token: JWT token
    :param db: database session
    :return: updated picture
    """
    # Verify that user is logged in
    verify_token(token)
    return pictures.update_picture(db, picture_id=picture_id,
                                   picture=picture)
