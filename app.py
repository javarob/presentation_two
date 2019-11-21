import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Samples_Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples
Combined = Base.classes.combined_actual


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    return jsonify(list(df.columns)[2:])


@app.route("/metadata/<sample>")
def sample_metadata(sample):
    """Return the MetaData for a given sample."""
    sel = [
        Samples_Metadata.sample,
        Samples_Metadata.WORST_1,
        Samples_Metadata.WORST_2,
        Samples_Metadata.WORST_3
    ]

    results = db.session.query(*sel)\
        .filter(Samples_Metadata.sample == sample).all()

    # Create a dictionary entry for each row of metadata information
    sample_metadata = {}
    for result in results:
        sample_metadata["sample"] = result[0]
        sample_metadata["WORST_1"] = result[1]
        sample_metadata["WORST_2"] = result[2]
        sample_metadata["WORST_3"] = result[3]

    print('Hello world!')
    print(sample_metadata)
    return jsonify(sample_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    stmt = db.session.query(Samples).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above negative 1
    sample_data = df.loc[df[sample] > -1, ["otu_id", "otu_label", sample]]

    # Sort by sample
    sample_data.sort_values(by=sample, ascending=False, inplace=True)

    # Format the data to send as json
    data = {
        "otu_ids": sample_data.otu_id.values.tolist(),
        "sample_values": sample_data[sample].values.tolist(),
        "otu_labels": sample_data.otu_label.tolist(),
    }
    return jsonify(data)


@app.route("/combined_data")
def combined_data():
    """Return the combined data."""

    # Use Pandas to perform the sql query
    stmt2 = db.session.query(Combined).statement
    df2 = pd.read_sql_query(stmt2, db.session.bind)

    # Format the data to send as json
    data2 = {
        "year": df2.year.values.tolist(),
        "dow_dollars": df2.dow_dollars.values.tolist(),
        "snp500_dollars": df2.snp500_dollars.tolist(),
        "tbm_dollars": df2.tbm_dollars.tolist(),
    }

    # Return the combined data
    return jsonify(data2)


if __name__ == "__main__":
    app.run()
