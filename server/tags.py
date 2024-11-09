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
                "content": "There is the site https://gutendex.com/books. It contains JSON info about lots of books. "
                           "Can you give me just the list of titles of 16 books from it"
                           "that match the mood of the next sentence: "
                           f"{mood}"
                           "I need only the list"
            },
        ],
        model="llama3-8b-8192",
    )

    answer = chat_completion.choices[0].message.content

    formatted_answer = []

    for a in answer.split('\n'):
        try:
            if a[0] in '0123456789':
                if 'by' in a:
                    formatted_answer.append(
                        a.split('.', 1)[1].split('by')[0].replace("\"", "").strip()
                    )
                else:
                    formatted_answer.append(
                        a.split('.', 1)[1].replace("\"", "").strip()
                    )
        except:
            pass

    return formatted_answer

