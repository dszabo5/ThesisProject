import unittest
import json
from app import app, db, User

class FlaskTest(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()

    def test_register_user(self):
        response = self.app.post('/register', json={"username": "testuser", "email": "test@example.com", "password": "password"})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['email'], "test@example.com")

    def test_login_user(self):
        user = User(username="testuser", email="test@example.com", password="password")
        db.session.add(user)
        db.session.commit()
        response = self.app.post('/login', json={"email": "test@example.com", "password": "password"})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['email'], "test@example.com")

    def test_logout_user(self):
        with self.app.session_transaction() as sess:
            sess['user_id'] = 1
        response = self.app.post('/logout')
        self.assertEqual(response.status_code, 200)

    def test_upload_dataset(self):
        # Mocking file upload
        data = {'file': (BytesIO(b'my file contents'), 'test.txt')}
        response = self.app.post('/upload/dataset', data=data)
        self.assertEqual(response.status_code, 200)

    def test_upload_file(self):
        # Mocking file upload
        data = {'file': (BytesIO(b'my file contents'), 'test.txt')}
        response = self.app.post('/upload/file', data=data)
        self.assertEqual(response.status_code, 200)

    def test_get_files(self):
        response = self.app.get('/files')
        self.assertEqual(response.status_code, 200)

    def test_get_datasets(self):
        response = self.app.get('/datasets')
        self.assertEqual(response.status_code, 200)

    def test_run_comparison(self):
        response = self.app.post('/compare', json={"selectedFile": "test.txt", "selectedDatasets": ["dataset1", "dataset2"]})
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main()