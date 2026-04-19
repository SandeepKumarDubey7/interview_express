import requests
from bs4 import BeautifulSoup
import json

url = 'https://www.interviewbit.com/dot-net-interview-questions/'
response = requests.get(url)
response.encode=('utf-8')  
soup = BeautifulSoup(response.text, 'html.parser')

category = 'Machine Learning'
data = []

questions = soup.find_all('h3')

for question in questions:
    q_text = question.get_text(strip=True)
    
    # Collect answer paragraphs until next <h3>
    answer_parts = []
    next_tag = question.find_next_sibling()
    while next_tag and next_tag.name != 'h3':
        if next_tag.name in ['p', 'ul', 'ol']:
            answer_parts.append(next_tag.get_text(strip=True))
        next_tag = next_tag.find_next_sibling()
    
    full_answer = " ".join(answer_parts).strip()
    
    if full_answer:
        data.append({
            "category": category,
            "question": q_text,
            "answer": full_answer
        })

# Optional: Print the result or save it to JSON
for entry in data:
    print("Q:", entry['question'])
    print("A:", entry['answer'])
    print()

with open('ml_interview_questions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
