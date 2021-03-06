import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import albums
from .routes import users
from .routes import pictures

# Initialization of the web framework
app = FastAPI(
    title="Picture Albums",
    description="My best project",
    version="1.1.0"
)

# Permit Cross Origin requests to everyone from everywhere
app.add_middleware(CORSMiddleware,
                   allow_origins=["*", "https://localhost:3000"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"],
                   )
# Initialize router with routes for different parts of application:
app.include_router(users.router)
app.include_router(albums.router)
app.include_router(pictures.router)

# Read port number from environment; default: 8000
port = int(os.environ.get('PORT', 8000))
if __name__ == "__main__":
    # Run server based on application (app)
    uvicorn.run(app, host="0.0.0.0", port=port)
