from flask import Flask, render_template, jsonify, send_from_directory, request
import json
import pandas as pd
import numpy as np
import os
import sqlite3 as sql

#init app and class
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

#initiate memory cache of database
conn = sql.connect('data/amusement_accidents.db')
query = 'SELECT * FROM accidents'
df = pd.read_sql(query, conn)
conn.close()

# Route to render index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/getData", methods=["GET"])
def getData():
    accident_dict = df.to_dict(orient='index')
    accidents = jsonify(accident_dict)
    return accidents # send to javascript as JSON
####################################
# ADD MORE ENDPOINTS
###########################################
#approute for bar chart
@app.route("/barChart", methods=["GET"])
def barChart():
    
    return barData
#app route for scatterplot
#app route for piechart
#app route for map
#app route for table - uses /getdata
#############################################################
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r
#main
if __name__ == "__main__":
    app.run(debug=True)
