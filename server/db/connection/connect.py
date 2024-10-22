import os

import psycopg2
import dotenv

dotenv.load_dotenv()


def get_connection_db():
    conn = psycopg2.connect(
        database=os.getenv('db_name'),
        user=os.getenv('user'),
        password=os.getenv('password'),
        host=os.getenv('host')
    )

    return conn
