import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template, redirect
from flask_sqlalchemy import SQLAlchemy
import json
import psycopg2
from config import password

app = Flask(__name__)


#################################################
# Database Setup
#################################################


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/stockdata')
def stockdata():
    engine = create_engine('postgresql://postgres:' +
                           password + '@localhost:5432/tbm')

    data = engine.execute(
        "SELECT id, date, adj_open, adj_close, symbol, end_val, date_str FROM stock_data")
    newdata = []

    for x in data:
        d = {
            'id': x[0],
            'date': [1],
            'adj_open': x[2],
            'adj_close': x[3],
            'symbol': x[4],
            'end_val': x[5],
            'date_str': x[6]
        }
        newdata.append(d)

    return jsonify(newdata)


# @app.route('/years')
# def getyears():
#     engine = create_engine('postgresql://postgres:' +
#                            password + '@localhost:5432/tbm')
#     data = engine.execute(
#         "select distinct date_part('year',date) as date from stock_data order by date;")
#     newdata = []

#     for x in data:
#         d = {
#             'year': x[0]
#         }
#         newdata.append(d)

#     return jsonify(newdata)


@app.route('/years')
def get_year_page():
    return render_template("years.html")


@app.route('/api/years')
def getyears():
    engine = create_engine('postgresql://postgres:' +
                           password + '@localhost:5432/tbm')
    data = engine.execute(
        "select distinct date_part('year',date) as date from stock_data order by date;")
    newdata = []
    for x in data:
        d = {
            'year': x[0]
        }
        newdata.append(d)
    return jsonify(newdata)


@app.route('/stocktable')
def stocktable():
    return render_template("stocktable.html")


if __name__ == "__main__":
    app.run(debug=True)

# test Adam test Adam
