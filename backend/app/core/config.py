from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AskPaper"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    DATABASE_URL: str

    class Config:
        env_file = ".env"


settings = Settings()