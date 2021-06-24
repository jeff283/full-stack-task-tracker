from enum import unique
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy, sqlalchemy
from flask_marshmallow import Marshmallow
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
basedir = os.path.abspath(os.path.dirname(__file__))

#database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'task.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#init db
db = SQLAlchemy(app)
#init marshmallow
ma = Marshmallow(app)

#Task Model

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(1000))
    day = db.Column(db.String(200))
    reminder = db.Column(db.Boolean)


    def __init__(self, text, day, reminder):
        self.text = text
        self.day = day
        self.reminder = reminder


#Task Schema
class TaskSchema(ma.Schema):
    class Meta:
        fields = ('id', 'text', 'day', 'reminder')

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)

#Create a task

@app.route('/task', methods=['POST'])
def add_task():
    text = request.json['text']
    day = request.json['day']
    reminder = request.json['reminder']


    new_task = Task(text, day, reminder)
    db.session.add(new_task)
    db.session.commit()

    return task_schema.jsonify(new_task)


#Get all tasks
@app.route("/task", methods=['GET'])
def get_tasks():
    all_tasks = Task.query.all()
    results = tasks_schema.dump(all_tasks)
    return jsonify(results)

#get single task
@app.route("/task/<id>", methods=['GET'])
def get_task(id):
    task = Task.query.get(id)
    return task_schema.jsonify(task )



#Update
@app.route('/task/<id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    #getting from user
    text = request.json['text']
    day = request.json['day']
    reminder = request.json['reminder']


    #Init items to be commited
    task.text = text
    task.day = day
    task.reminder = reminder


    db.session.commit()

    return task_schema.jsonify(task)

#delete
@app.route("/task/<id>", methods=['DELETE'])
def delete(id):
    task = Task.query.get(id)
    db.session.delete(task)
    db.session.commit()

    return task_schema.jsonify(task )




if __name__ == '__main__':
    app.run(debug=True)