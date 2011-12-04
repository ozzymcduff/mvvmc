#!/usr/bin/env python
# encoding: utf-8
"""
application.py

Created by Oskar Gewalli on 2011-12-02.
License: MIT (http://www.opensource.org/licenses/mit-license.php)
"""

from flask import Flask, url_for, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/search/<query>")
def search(query):
    # TODO: render search with search data preloaded in the template 
    return render_template('index.html')

@app.route("/hello")
def hello():
    return render_template('index.html')
    
if __name__ == "__main__":
    app.run(debug=True)