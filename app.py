import sqlite3 as sql
import pandas as pd

from flask import Flask, jsonify


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    """Read about roller coaster accidents from 1988-2009"""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/accidents"
    )


@app.route("/api/v1.0/accidents")
def data():
    
    conn = sql.connect('data/amusement_accidents.db')
    
    query = 'SELECT * FROM accidents'

    df = pd.read_sql(query, conn)
    
    conn.close()
    
    return jsonify(df)


if __name__ == '__main__':
    app.run(debug=True)
