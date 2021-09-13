from sqlalchemy.orm import Session
from sqlalchemy import false
from datetime import datetime

from ..shared import models, schemas


def get_album(db: Session, album_id: int):
    """
    Get album by id
    :param db: database session
    :param album_id: id of album
    :return: album
    """
    return db.query(models.Album).filter(
        models.Album.id == album_id).first()


def get_album_by_title(db: Session, title: str):
    """
    Get album by title
    :param db: database session
    :param title: title of album
    :return: album
    """
    return db.query(models.Album).filter(
        models.Album.title == title).first()


def get_public_albums(db: Session, user_id: int):
    """
    Get all public albums which don't belong to user
    :param db: database session
    :param user_id: id of user
    :return: albums
    """
    return db.query(models.Album) \
        .filter(models.Album.private == false(),
                models.Album.user_id != user_id) \
        .order_by(models.Album.title) \
        .all()


def get_user_albums(db: Session, user_id: int):
    """
    Get all albums of user
    :param db: database session
    :param user_id: id of user
    :return: albums
    """
    return db.query(models.Album).filter(
        models.Album.user_id == user_id).order_by(models.Album.title).all()


def download_pictures(db: Session, album_id: int, requestor_id: int):
    """
    Create request to download all pictures from album
    :param db: database session
    :param album_id: album id
    :param requestor_id: requestor id
    :return: id of picture
    """
    # Verify the album exists
    album = db.query(models.Album).filter(
        models.Album.private == false(),
        models.Album.id == album_id).first()
    if album is None:
        return {"download": False}
    # Create download request for all pictures
    for picture in album.pictures:
        # Verify the request doesn't exist
        download = db.query(models.Download).filter(
            models.Download.requestor_id == requestor_id,
            models.Download.picture_id == picture.id,
        ).first()
        # If request exists change status to requested
        if download is not None:
            download.status = 'requested'
            download.created_at = datetime.now()
            db.commit()
            continue
        # Create download request
        download = {
            "requestor_id": requestor_id,
            "owner_id": picture.album.user_id,
            "album_id": album.id,
            "picture_id": picture.id,
            "created_at": datetime.now(),
            "status": "requested",
        }
        # Convert request to model
        db_download = models.Download(**download)
        db.add(db_download)
        db.commit()

    return {"albumId": album_id}


def get_album_picture_state(db: Session, user_id: int, album_id: int):
    """
    Get download state of pictures from album
    :param db: database session
    :param user_id: user (requestor) id
    :param album_id: album id
    :return: pictures
    """
    return db.query(models.Download) \
        .with_entities(models.Download.picture_id, models.Download.status) \
        .filter(models.Download.album_id == album_id,
                models.Download.requestor_id == user_id,
                ).all()


def create_album(db: Session, album: schemas.AlbumCreate):
    """
    Create a new album
    :param db: database session
    :param album: album data
    :return: new album
    """
    # Verify that album doesn't exist
    db_album = get_album_by_title(db, album.title)
    if db_album:
        return NameError
    # Convert Album to model
    db_album = models.Album(**album.dict())
    db_album.created_at = datetime.now()
    db.add(db_album)
    db.commit()
    # Sync album from database
    db.refresh(db_album)
    return db_album


def delete_album(db: Session, album_id: int):
    """
    Delete an album
    :param db: database session
    :param album_id: id of album
    """
    album = db.query(models.Album).filter(
        models.Album.id == album_id).first()
    if album:
        db.delete(album)
        db.commit()


def update_album(db: Session, album_id: int, album: schemas.Album):
    """
    Update an album
    :param db: database session
    :param album_id: id of album
    :param album: album data
    :return: album
    """
    # Verify that another album with the same title doesn't exist
    db_album_title = get_album_by_title(db, album.title)
    if db_album_title is not None and db_album_title.id != album_id:
        return NameError
    # Find album
    db_album = get_album(db, album_id)
    if not db_album:
        return NotImplementedError
    # Update data
    db_album.title = album.title
    db_album.description = album.description
    db_album.private = album.private
    db_album.image = album.image
    db_album.filename = album.filename
    db.commit()
    # Sync album from database
    db.refresh(db_album)
    return db_album
