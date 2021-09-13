from sqlalchemy.orm import Session
from datetime import datetime

from ..shared import models, schemas
from .users import download_delete_picture


def download_picture(db: Session, picture_id: int, requestor_id: int):
    """
    Create request to download picture
    :param db: database session
    :param picture_id: picture id
    :param requestor_id: requestor id
    :return: id of picture
    """
    # Verify the picture exists
    picture = db.query(models.Picture).filter(
        models.Picture.id == picture_id).first()
    if picture is None:
        return {"download": False}
    # Verify the request doesn't exist
    download = db.query(models.Download).filter(
        models.Download.requestor_id == requestor_id,
        models.Download.picture_id == picture_id,
    ).first()
    # If request exists change status to requested
    if download is not None:
        download.status = 'requested'
        download.created_at = datetime.now()
        db.commit()
        return {"pictureId": picture_id}
    # Create download request
    download = {
        "requestor_id": requestor_id,
        "owner_id": picture.album.user_id,
        "album_id": picture.album.id,
        "picture_id": picture_id,
        "created_at": datetime.now(),
        "status": "requested",
    }
    # Convert request to model
    db_download = models.Download(**download)
    db.add(db_download)
    db.commit()
    return {"pictureId": picture_id}


def get_album_pictures(db: Session, album_id: int):
    """
    Get all pictures from album
    :param db: database session
    :param album_id: id of album
    :return: pictures
    """
    return db.query(models.Picture).filter(
        models.Picture.album_id == album_id).all()


def get_picture(db: Session, picture_id: int):
    """
    Get picture by id
    :param db: database session
    :param picture_id: picture id
    :return: picture
    """
    return db.query(models.Picture).filter(
        models.Picture.id == picture_id).first()


def create_picture(db: Session, picture: schemas.PictureCreate):
    """
    Create a new picture
    :param db: database session
    :param picture: picture data
    :return: picture
    """
    # Convert picture to model
    db_picture = models.Picture(**picture.dict())
    db_picture.created_at = datetime.now()
    db.add(db_picture)
    db.commit()
    # Sync picture from database
    db.refresh(db_picture)
    return db_picture


def delete_picture(db: Session, picture_id: int):
    """
    Delete a picture
    :param db: database session
    :param picture_id: picture id
    """
    picture = db.query(models.Picture).filter(
        models.Picture.id == picture_id).first()
    if picture:
        download_delete_picture(db, picture_id=picture_id)
        db.delete(picture)
        db.commit()


def update_picture(db: Session, picture_id: int, picture: schemas.Picture):
    """
    Update picture data
    :param db: database session
    :param picture_id: picture id
    :param picture: picture data
    :return: updated picture
    """
    # Find picture
    db_picture = get_picture(db, picture_id)
    if not db_picture:
        return NameError
    # Update data
    db_picture.title = picture.title
    db_picture.description = picture.description
    db_picture.image = picture.image
    db_picture.filename = picture.filename
    db.commit()
    # Sync picture from database
    db.refresh(db_picture)
    return db_picture
