from flask import Flask, render_template, jsonify, send_from_directory, request
import json
import pandas as pd
import numpy as np
import os
import sqlite3 as sql
import sys 

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
#app route for boxplot
@app.route("/box", methods=["GET"])
def boxPlot():
    moddedDF = df[["age_youngest","num_injured","gender","year"]]
    agegroup = moddedDF[["age_youngest","num_injured","gender","year"]]
    bins= [0,1,11,21,31,41,51,61,200]
    labels = ['0','01-10','11-20','21-30','31-40','41-50','51-60','60+']
    agegroup['AgeGroup'] = pd.cut(agegroup['age_youngest'], bins=bins, labels=labels, right=False)
    boxchartdf = agegroup.groupby(['AgeGroup','gender']).num_injured.sum().reset_index()
    boxData = []

    for index, row in boxchartdf.iterrows():
        box_plot = {'age_group': row['AgeGroup'],
                    'gender': row['gender'],
                    'numInjured': row['num_injured']}
        boxData.append(box_plot)


    stackdata = []
    accidents_byage_bygender = boxchartdf.groupby("AgeGroup")
    for index, row in accidents_byage_bygender: 
        e = {"AgeGroup":row["AgeGroup"], "Maccidents":row["M"],"Faccidents":row["F"],"Uaccidents":row["U"]}
    print(accidents_byage_bygender.groups, file = sys.stderr) 
    # return jsonify(boxData)
    return 'ok'


#app route for bar chart
@app.route("/bar", methods=["GET"])
def barChart():
    barchartDF = pd.DataFrame(df, columns = ["gender","age_youngest", "num_injured","year"])
    barData = []
    for index, row in barchartDF.iterrows():
        bar_data = {'gender': row['gender'],
                    'age': row['age_youngest'],
                    'numInjured': row['num_injured'],
                    'year': row['year']}
        barData.append(bar_data)
    return jsonify(barData)
#app route for scatterplot
@app.route("/scatter", methods=["GET"])
def scatterPlot():
    moddedDF = df[["age_youngest","num_injured","gender","year"]]
    agegroup = moddedDF[["age_youngest","num_injured","gender","year"]]
    bins= [0,1,11,21,31,41,51,61,200]
    labels = ['0','01-10','11-20','21-30','31-40','41-50','51-60','60+']
    agegroup['AgeGroup'] = pd.cut(agegroup['age_youngest'], bins=bins, labels=labels, right=False)
    scatterdf = agegroup.groupby('age_youngest').num_injured.sum().reset_index()
    scatterData = []
    for index, row in scatterdf.iterrows():
        scatter_plot = {'age_youngest': row['age_youngest'],
                    'numInjured': row['num_injured']}
        scatterData.append(scatter_plot)
    return jsonify(scatterData)
#app route for piechart
@app.route("/pie", methods=["GET"])
def pieChart():
    device_category_pie = df["device_category"].value_counts()
    acc_by_device = []
    for device, acc in device_category_pie.items():
        device_sum = {'device': device,
                     'numAccs': acc}
        acc_by_device.append(device_sum)
    return jsonify(pieData)
#app route for map
@app.route('/USmap', methods=['GET'])
def buildMap():
    accidents_by_state = df.groupby('acc_state').size()
    acc_by_state = []
    for state, acc in accidents_by_state.items():
        state_sum = {'id': f'US.{state}',
                     'value': acc}
        acc_by_state.append(state_sum)
    return jsonify(acc_by_state)
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
