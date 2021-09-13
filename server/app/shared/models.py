from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app.database.database import Base


# Description of database models

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    email = Column(String)
    hashed_password = Column(String)
    token = Column(String)

    # User has many Albums
    albums = relationship("Album", back_populates='user',
                          cascade="all, delete, delete-orphan")

    # The string representation of a User
    def __repr__(self):
        return "<User(id=%d,fullname='%s %s', email='%s')>" % (
            self.id, self.first_name, self.last_name,
            self.email)


# Album model
class Album(Base):
    __tablename__ = "albums"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    private = Column(Boolean)
    image = Column(String)
    filename = Column(String)
    created_at = Column(DateTime)

    # Album has many Pictures
    pictures = relationship("Picture", back_populates='album',
                            cascade="all, delete, delete-orphan")

    # Album belongs to User
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")

    # The string representation of a Album
    def __repr__(self):
        return "<Album(userid='%s', id=%d, private='%s', title='%s')>" % (
            self.user.id, self.id, self.private, self.title)


# Picture model
class Picture(Base):
    __tablename__ = "pictures"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    image = Column(String)
    filename = Column(String)
    created_at = Column(DateTime)

    # Picture belongs to Album
    album_id = Column(Integer, ForeignKey("albums.id"))
    album = relationship("Album")

    # The string representation of a Picture
    def __repr__(self):
        return "<Picture(album.id='%s', id=%d, title='%s')>" % (
            self.album.id, self.id, self.title)


# Download model
class Download(Base):
    __tablename__ = "downloads"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime)
    owner_id = Column(Integer, index=True)

    # Download belongs to User (requestor)
    requestor_id = Column(Integer, ForeignKey("users.id"))
    requestor = relationship("User")

    # Download belongs to Album
    album_id = Column(Integer, ForeignKey("albums.id"))
    album = relationship("Album")

    # Download belongs to Picture
    picture_id = Column(Integer, ForeignKey("pictures.id"))
    picture = relationship("Picture")

    # Status of this request
    # requested
    # approved
    # denied
    status = Column(String)
