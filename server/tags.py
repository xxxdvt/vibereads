import os

import dotenv
from groq import Groq

dotenv.load_dotenv()

client = Groq(
    api_key=os.getenv('GROQ_API_KEY'),
)


def get_books_by_mood(mood: str):
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Search the first 25 pages of Gutendex (https://gutendex.com/books/). "
                           "Based on the description: "
                           f"{mood}, "
                           "provide me with a list of 25 books that fit the mood, "
                           "matching with metadata such as titles, subjects, or themes. "
                           "Return the list only, with no numbering or additional details. SEARCH ONLY THE FIRST 25 "
                           "PAGES: THAT MEANS YOU CAN WATCH ONLY https://gutendex.com/books/?page=1, "
                           "https://gutendex.com/books/?page=2, ... and so on till https://gutendex.com/books/?page=25"
            },
        ],
        model="llama3-8b-8192",
    )

    answer = chat_completion.choices[0].message.content

    formatted_answer = [book for book in answer.split('\n')[2:]]

    return formatted_answer


