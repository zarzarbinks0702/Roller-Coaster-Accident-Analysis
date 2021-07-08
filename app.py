import sqlite3 as sql
import pandas as pd

from flask import Flask, jsonify, render_template


#################################################
# Flask Setup
#################################################
app = Flask(__name__, static_url_path='/static')


#################################################
# Flask Routes
#################################################

@app.route("/")
def home():

    accidents = data()

    return render_template('index.html', accidents=accidents)

@app.route('/accidents')
def data():
        conn = sql.connect('data/amusement_accidents.db')

        query = 'SELECT * FROM accidents'

        df = pd.read_sql(query, conn)

        conn.close()

        accident_dict = df.to_dict(orient='index')

        accidents = jsonify(accident_dict)
        
        return accidents

if __name__ == '__main__':
    app.run(debug=True)
