from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from pymysql import IntegrityError
from config import ApplicationConfig
from models import db, User, Dataset
from topicModelling import perform_topic_modeling
from fileComparison import perform_file_comparison, compare
import gensim
import pickle

app = Flask(__name__)
app.config.from_object(ApplicationConfig)


bcrypt = Bcrypt(app)
cors = CORS(app, supports_credentials=True)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/@me")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    user = User.query.filter_by(id=user_id).first()
    return jsonify({
        "id": user.id,
        "email": user.email
    }) 

@app.route("/register", methods=["POST"])
def register_user():
    username = request.json["username"]
    email = request.json["email"]
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        #return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"

@app.route('/upload/dataset', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        print('No file part')
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        print('No selected file')
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        lda_model = perform_topic_modeling(file_path)  # Call topic modeling function
        with open('./models/' + f'{filename}_model.pkl', "wb") as f:
            pickle.dump(lda_model, f)
        
        model_path = os.path.join('./models', f'{filename}_model.pkl')
        dataset = Dataset(name=filename, file_path=file_path, model_path=model_path)

        try:
            db.session.add(dataset)
            db.session.commit()
            #return jsonify({'message': 'User registered successfully'}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

        print('Success')
        return jsonify({'message': 'File uploaded successfully'}), 200
    
    return jsonify({'error': 'Unknown error occurred'}), 500

@app.route('/upload/file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        print('No file part')
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        print('No selected file')
        return jsonify({'error': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join('./files', filename)
        file.save(file_path)

        for model_name in os.listdir('./models'):
            if model_name.endswith(".pkl"):
                model_path = os.path.join('./models', model_name)

                with open(model_path, "rb") as f:
                    lda_model = pickle.load(f)
                
                print("TEST   : ", lda_model.print_topics())

                perform_file_comparison(file_path, lda_model)
 
        print('Success')
        return jsonify({'message': 'File uploaded successfully'}), 200
    
    return jsonify({'error': 'Unknown error occurred'}), 500

@app.route('/files')
def get_files():
    folder_path = './files'
    if not os.path.exists(folder_path):
        return jsonify({'error': 'Folder not found'}), 404
    
    files = os.listdir(folder_path)
    return jsonify({'files': files})

@app.route('/datasets')
def get_datasets():
    folder_path = './datasets'
    if not os.path.exists(folder_path):
        return jsonify({'error': 'Folder not found'}), 404
    
    datasets = os.listdir(folder_path)
    return jsonify({'datasets': datasets})

@app.route('/compare', methods=['POST'])
def run_comparison():
    file = request.json["selectedFile"]
    datasets = request.json["selectedDatasets"]

    if file == '':
        print('No selected file')
        return jsonify({'error': 'No selected file'}), 400
    if len(datasets) == 0:
        print('No datasets selected')
        return jsonify({'error': 'No datasets selected'}), 400
    print(file)
    print(datasets)

    result = compare(file, datasets, 10)

    print(result)
    print(jsonify(result))

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5001)