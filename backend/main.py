from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_mysql_connector import MySQL

import datetime

# db
app = Flask(__name__)
CORS(app)

app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_DATABASE'] = 'vois'
app.config['MYSQL_PASSWORD'] = '02112000'


app.config.from_object(__name__)
# CORS(app, resources={r"/*":{'origins' : "*", "allow_headers": "Access-Control-Allow-Origin"}})
# CORS(app, resources={r"/*":{'origins' : 'http://localhost:8080', "allow_headers": "Access-Control-Allow-Origin"}})


mysql = MySQL(app)
EXAMPLE_SQL = "SELECT * FROM news"

# connect to db example
@app.route('/news', methods=['GET'])
def connection():
    conn = mysql.connection
    cur = conn.cursor()
    cur.execute(EXAMPLE_SQL)
    output = cur.fetchall()

    result = []

    for row in output:
        obj = {}
        for i in range(len(cur.description)):
            if isinstance(row[i], datetime.date):
                obj[cur.description[i][0]] = row[i].strftime('%Y, %m, %d')
            else:
                obj[cur.description[i][0]] = row[i]
        result.append(obj)

    return jsonify(result)

@app.route('/articles', methods=['GET'])
def articles():
    conn = mysql.connection
    cur = conn.cursor()
    cur.execute("SELECT * FROM articles")
    output = cur.fetchall()

    result = []

    for row in output:
        obj = {}
        for i in range(len(cur.description)):
            if isinstance(row[i], datetime.date):
                obj[cur.description[i][0]] = row[i].strftime('%Y, %m, %d')
            else:
                obj[cur.description[i][0]] = row[i]
        result.append(obj)

    return jsonify(result)

@app.route('/api/auth', methods=['POST'])
def handle_data():
  data = request.get_json() # Получаем тело POST-запроса как словарь в Python
  email = data['email']
  password = data['password']
  # return jsonify({'message': f'Данные получены: {email}, {password}'})

  conn = mysql.connection
  cur = conn.cursor()

  query = "SELECT * FROM administrators WHERE email = %s"
  cur.execute(query, (email,))

  row = cur.fetchone()

  if row:
    # Пользователь найден, проверить пароль и вернуть результат
    if row[2] == password:
      # return jsonify({'message': f'Вход выполнен для пользователя: {email}'})
      return jsonify({
        'username': row[1],
        'email':row[3]
        })
    # else:
    #   # return jsonify({'message': 'Неверный пароль'})
  else:
    # Пользователь не найден
    return jsonify({'message': 'Пользователь не найден'})

@app.route('/newData/news', methods=['POST'])
def new_news():
  data = request.get_json() # Получаем тело POST-запроса как словарь в Python
  title = data['title']
  text = data['text']
  organization = data['organization']
  icon = data['icon']

  conn = mysql.connection
  cur = conn.cursor()

  query = "INSERT INTO news (title, text, organization, icon) VALUES (%s, %s, %s, %s)"
  cur.execute(query, (title, text, organization, icon))

  conn.commit()
  return jsonify({'success': True})

@app.route('/newData/articles', methods=['POST'])
def new_article():
  data = request.get_json() # Получаем тело POST-запроса как словарь в Python
  title = data['title']
  author = data['author']
  text = data['text']
  date = data['date']
  
  conn = mysql.connection
  cur = conn.cursor()

  query = "INSERT INTO articles (title, author, text, date_published) VALUES (%s, %s, %s, %s)"
  cur.execute(query, (title, author, text, date))

  conn.commit()
  return jsonify({'success': True})

if __name__ == "__main__": 
    app.run(debug=True)
