import base64
from os.path import dirname, join
import smtplib
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email import encoders
import dns.resolver

from . import models

ALBUMSHARE_EMAIL = 'yonialbumshare@gmail.com'
ALBUMSHARE_PASSWORD = 'yonialbum'


def send_token(user: models.User, token: str):
    """
    Send an email with restoration code
    :param user: addressee
    :param token: restoration code
    """
    # Build a message
    message = 'This is your verification code: %s' % token

    # Build an email
    msg = MIMEMultipart()
    msg['From'] = ALBUMSHARE_EMAIL
    msg['To'] = user.email
    msg['Subject'] = 'AlbumShare -- This is your verification code'

    # Add Text part
    msg.attach(MIMEText(message, 'plain'))
    # Add Logo (image part)
    attach_image('logo.png', '/logo.png', '<0>', msg)

    # Add HTML part
    message = f"""
<html>
<body>
    <p><img src="cid:0"></p>
    <br />
    <h1>Hello, {user.first_name} {user.last_name}!<h1>
    <br />
    <h2>This is a verification code to restore your
        forgotten password:
        <span style="color: #2277ca">{token}</span>
     </h2>
    <br/><br/>
    <h2>Sincerely yours,<br/>
        <span style="color: #54c25a; font-weight: 900">Album</span><span
         style="color: #2277ca">Share</span>
    </h2>
</body>
</html>
"""
    msg.attach(MIMEText(message, 'html', 'utf-8'))

    send_mail(msg, user.email)


def send_picture(request: models.Download, user: models.User):
    """
    Send an email with picture
    :param request: request with data to send email with
    :param user: user to send an email to
    """
    # Build a subject
    subject = 'AlbumShare -- This is the picture you requested'
    picture: models.Picture = request.picture
    album: models.Album = request.album

    # image has format of data:image/png;base64,aVRBOw0AKg1mL9...
    # Parse it to get mimetype and base64-encoded data
    (data, image) = picture.image.split(';base64,')
    ext = data.split('/')[1]  # data:image/png
    image = base64.b64decode(image)

    # Create attachment
    img_attachment = MIMEImage(image, ext)
    img_attachment.add_header('Content-Disposition', 'attachment',
                              filename=picture.filename)

    # Build an email
    msg = MIMEMultipart()
    msg['From'] = ALBUMSHARE_EMAIL
    msg['To'] = request.requestor.email
    msg['Subject'] = subject

    # Add Logo (image part)
    attach_image('logo.png', '/logo.png', '<0>', msg)
    # Add the requested image as an attachment
    msg.attach(img_attachment)
    # Add HTML part
    message = f"""
    <html>
    <body>
        <p><img src="cid:0"></p>
        <br />
        <h1>Hello, {request.requestor.first_name}
{request.requestor.last_name}!<h1>
        <br />
        <h2>
            <p>
            You've requested a picture from album 
            <span style="color: #2277ca">"{album.title}"</span> 
            of <span style="color: #2277ca">{user.first_name} 
                                            {user.last_name}</span>
            <br/>Title: <span style="color: #2277ca">{picture.title}</span>
            <br/>Description: 
                <span style="color: #2277ca">{picture.description}</span>
            <p>
            <p>The requested picture is attached</p>
        </h2>
        <br/><br/>
        <h2>Sincerely yours,<br/>
            <span style="color: #54c25a; font-weight: 900">Album</span><span
            style="color: #2277ca">Share</span>
        </h2>
    </body>
    </html>
    """
    msg.attach(MIMEText(message, 'html', 'utf-8'))

    send_mail(msg, request.requestor.email)


def send_mail(msg, email):
    """
    Connect to SMTP server and send the email
    :param msg: multipart message
    :param email: addressee
    """
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(ALBUMSHARE_EMAIL, ALBUMSHARE_PASSWORD)
    text = msg.as_string()
    server.sendmail(ALBUMSHARE_EMAIL, email, text)
    server.quit()


def verify_email(email):
    """
    Check whether email truly exist
    :param email: email to verify
    :return: True - exists, False - not exists
    """
    try:
        # Get domain for DNS lookup
        split_address = email.split('@')
        domain = str(split_address[1])

        # MX record lookup
        records = dns.resolver.resolve(domain, 'MX')
        mx_record = str(records[0].exchange)

        # SMTP lib setup (use debug level for full output)
        server = smtplib.SMTP()
        server.set_debuglevel(1)

        # SMTP Conversation
        server.connect(mx_record)
        server.helo(server.local_hostname)

        server.mail(ALBUMSHARE_EMAIL)
        code, message = server.rcpt(str(email))
        server.quit()
        # Assume SMTP response 250 is success
        if code == 250:
            return True
        else:
            return False
    except Exception as err:
        print("=========> Exception: ", err)
        return False


def attach_image(filename: str, path: str, _id: str, msg):
    """
    Attach an image as an Image part
    :param filename: name of a file to attach
    :param path: path to a file to attach
    :param _id: id to use in HTML part in format <0>
    :param msg: multipart message
    """
    # Location of the current .py file
    current_dir = dirname(__file__)
    images = join(current_dir, "../images")

    with open(images + path, 'rb') as image:
        # Define mime and file name of an attachment
        # Image type: png
        mime = MIMEBase('image', 'png', filename=filename)
        # add headers:
        mime.add_header('Content-Disposition', 'attachment',
                        filename=filename)
        mime.add_header('X-Attachment-Id', '0')
        mime.add_header('Content-ID', _id)
        # Read logo into the MIMEBase object
        mime.set_payload(image.read())
        encoders.encode_base64(mime)
        # Add image part
        msg.attach(mime)
