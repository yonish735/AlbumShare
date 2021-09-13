from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import albums, database
from ..shared import schemas
from .token import oauth2_scheme, verify_token

# Initialization of router /albums
router = APIRouter(
    tags=["album"],
    prefix="/albums"
)


@router.get('/', response_model=Optional[List[schemas.Album]])
def get_user_albums(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(database.get_db)):
    """
    Get albums of the user
    :param token: JWT token
    :param db: database session
    :return: albums
    """
    # Verify that user is logged in
    _, user_id = verify_token(token)
    return albums.get_user_albums(db, user_id=user_id)


@router.get('/public', response_model=Optional[List[schemas.AlbumWithUser]])
def get_public_albums(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(database.get_db)):
    """
    Get all public albums for user
    :param token: JWT token
    :param db: database session
    :return: albums
    """
    # Verify that user is logged in
    _, user_id = verify_token(token)
    if user_id != 0:
        return albums.get_public_albums(db, user_id=user_id)
    return []


@router.get('/{album_id}/download/')
def download_album_all_pictures(
        album_id: int,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(database.get_db)):
    """
    Download Request of all pictures of album
    :param album_id: id of album
    :param token: JWT token
    :param db: database session
    :return: album id
    """
    # Verify that user is logged in
    _, user_id = verify_token(token)
    return albums.download_pictures(
        db, album_id=album_id, requestor_id=user_id)


@router.post('/', response_model=schemas.Album)
def create_album(album: schemas.AlbumCreate,
                 token: str = Depends(oauth2_scheme),
                 db: Session = Depends(database.get_db)):
    """
    Create an album
    :param album: album data
    :param token: JWT token
    :param db: database session
    :return: new album
    """
    # Verify that user is logged in
    verify_token(token)
    album = albums.create_album(db, album=album)
    if album == NameError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Album with the same title already exists")
    return album


@router.delete('/{album_id}', response_model=str)
def delete_album(album_id: int,
                 token: str = Depends(oauth2_scheme),
                 db: Session = Depends(database.get_db)):
    """
    Delete the album
    :param album_id: id of album
    :param token: JWT token
    :param db: database session:
    :return: album id
    """
    # Verify that user is logged in
    verify_token(token)
    albums.delete_album(db, album_id)
    return album_id


@router.patch('/{album_id}', response_model=schemas.Album)
def update_album(album_id: int, album: schemas.Album,
                 token: str = Depends(oauth2_scheme),
                 db: Session = Depends(database.get_db)):
    """
    Update an album
    :param album_id: id of album
    :param album: new data
    :param token: JWT token
    :param db: database session
    :return: updated album
    """
    # Verify that user is logged in
    verify_token(token)
    album = albums.update_album(db, album_id=album_id, album=album)
    if album == NameError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Album with the same title already exists")

    if album == NotImplementedError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unable to find this album")
    return album


@router.get('/{album_id}/states')
def download_album_picture_states(
        album_id: int,
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(database.get_db)):
    """
    Download states of pictures of album
    :param album_id: id of picture
    :param token: JWT token
    :param db: database session
    :return: pictures
    """
    # Verify that user is logged in
    _, user_id = verify_token(token)
    return albums.get_album_picture_state(
        db, album_id=album_id, user_id=user_id)
