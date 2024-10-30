import os

import psycopg2
import dotenv
from pymongo import MongoClient

dotenv.load_dotenv()


def get_connection_db():
    conn = psycopg2.connect(
        database=os.getenv('db_name'),
        user=os.getenv('user'),
        password=os.getenv('password'),
        host=os.getenv('host')
    )

    return conn


def get_cache_db():
    client = MongoClient(os.getenv('cache_host'), int(os.getenv('cache_port')))
    db = client[os.getenv('cache_database')]

    return db
