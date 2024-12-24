import os
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from werkzeug.utils import secure_filename
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from model import InterviewPreparationModel  # Assuming the model class exists

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}) # Enable CORS for all routes

# Adzuna API credentials (for job details)
APP_ID = "55ce14f0"
APP_KEY = "b0f6219c55413f59a42a924e8286af7f"

# Configure upload settings
UPLOAD_FOLDER = tempfile.mkdtemp()  # Using a temporary folder for uploads
ALLOWED_EXTENSIONS = {'pdf'}

# Initialize the model (replace with your actual API key)
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', 'AIzaSyAGj4gZXJ19-66EJVlnkHmqRkE-pBpTBUs')  # Make sure to replace this key
    interview_model = InterviewPreparationModel(GOOGLE_API_KEY)
except Exception as e:
    print(f"Failed to initialize model: {e}")
    interview_model = None

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Define ATS score based on job description
def get_ats_score_for_job_description(job_description):
    """Return ATS score based on predefined job descriptions."""
    ats_scores = {
        "python": 40,
        "java": 80,
        "springboot": 70,
        "node": 60,
        "react": 60
    }
    
    # Normalize the job description to lowercase to ensure case-insensitive matching
    job_description_lower = job_description.lower()
    
    # Return the ATS score if job description matches any of the predefined job titles
    for key, score in ats_scores.items():
        if key in job_description_lower:
            return score
    
    # Default ATS score if no match is found
    return 0

@app.route('/api/job-details', methods=['GET'])
def get_job_details():
    """Fetch job details from the Adzuna API based on job title and location."""
    job_title = request.args.get('jobTitle')
    location = request.args.get('location', '')

    if not job_title:
        return jsonify({"error": "Job title is required"}), 400

    # Adzuna API endpoint
    api_url = "http://api.adzuna.com/v1/api/jobs/us/search/1"

    # Parameters for Adzuna API
    params = {
        "app_id": APP_ID,
        "app_key": APP_KEY,
        "what": job_title,
        "where": location,
        "content-type": "application/json",
    }

    try:
        # Make the API request
        response = requests.get(api_url, params=params)
        response.raise_for_status()  # Raise an error for bad status codes
        data = response.json()

        # Return the job results
        return jsonify(data)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching job details: {e}")
        return jsonify({"error": "Failed to fetch job details"}), 500

@app.route('/api/parse-resume', methods=['POST'])
def parse_resume():
    """
    Endpoint to parse the uploaded resume and calculate ATS score
    """
    if not interview_model:
        return jsonify({"error": "Model initialization failed"}), 500

    if 'resume' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['resume']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Create a temporary file
        temp_file = tempfile.mktemp(suffix='.pdf')
        file.save(temp_file)
        
        try:
            # Reset model state
            interview_model.reset()
            
            # Parse resume
            resume_data = interview_model.parse_resume(temp_file)
            
            # If there is an error while parsing, return the error and questions
            if "error" in resume_data:
                questions = interview_model.generate_interview_questions()
                return jsonify({
                    "error": resume_data['error'], 
                    "questions": questions
                }), 400
            
            # Retrieve job description from the JSON body
            job_description = request.form.get('job_description', '')
            ats_score = get_ats_score_for_job_description(job_description)  # Get ATS score based on job description
            
            # Generate interview questions
            questions = interview_model.generate_interview_questions()
            
            return jsonify({
                "resume_data": resume_data,
                "questions": questions,
                "ats_score": ats_score
            }), 200
        
        except Exception as e:
            print(f"Error: {str(e)}")  # Log the error to the server logs
            return jsonify({"error": str(e)}), 500
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    """
    Endpoint to generate a PDF resume based on user input.
    """
    data = request.json
    
    # Ensure all necessary data is provided
    required_fields = ['name', 'skills', 'qualification']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing {field} field"}), 400
    
    name = data['name']
    skills = data['skills']
    qualification = data['qualification']
    
    # Generate PDF resume
    resume_pdf = generate_pdf(name, skills, qualification)
    
    # Save to temporary file
    temp_file = tempfile.mktemp(suffix='.pdf')
    with open(temp_file, 'wb') as f:
        f.write(resume_pdf)
    
    # Return the generated resume as a response
    return send_file(temp_file, as_attachment=True, download_name='resume.pdf', mimetype='application/pdf')

def generate_pdf(name, skills, qualification):
    """
    Function to generate a PDF for the resume.
    """
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    
    # Adding name and qualifications to the resume PDF
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, 750, f"Name: {name}")
    
    c.setFont("Helvetica", 12)
    c.drawString(100, 730, f"Skills: {skills}")
    c.drawString(100, 710, f"Qualifications: {qualification}")
    
    # Saving the PDF to buffer
    c.showPage()
    c.save()
    
    # Get the PDF content
    buffer.seek(0)
    return buffer.read()

@app.route('/api/evaluate-answer', methods=['POST'])
def evaluate_answer():
    """
    Endpoint to evaluate interview answer
    """
    if not interview_model:
        return jsonify({"error": "Model initialization failed"}), 500

    data = request.json
    
    # Check if the request data contains the required fields 'question' and 'answer'
    if not data or 'question' not in data or 'answer' not in data:
        return jsonify({"error": "Missing question or answer"}), 400
    
    try:
        # Assuming the model has a method `evaluate_answer` that takes a question and answer as inputs
        feedback = interview_model.evaluate_answer(data['question'], data['answer'])
        
        # Return the feedback from the model as JSON
        return jsonify({"feedback": feedback}), 200
    
    except Exception as e:
        # Return any error that occurs during evaluation
        return jsonify({"error": str(e)}), 500

def fetch_coding_questions(language):
    try:
        # Predefined set of languages for which we want to fetch questions
        available_languages = ['python', 'c', 'cpp', 'java']
        
        if language not in available_languages:
            return {"error": f"No questions available for language: {language}"}, 404
        
        # Set questions based on language
        coding_questions = {
    "python": [
        "What is Python?",
        "Explain list comprehensions in Python?",
        "What are decorators in Python?",
        "What is the difference between a tuple and a list in Python?",
        "Explain how Python handles memory management?",
        "What are Python's built-in data types?",
        "What is a lambda function?",
        "What is the difference between deep copy and shallow copy?",
        "How does exception handling work in Python?",
        "What is the purpose of the self keyword?",
        "What are generators in Python?",
        "What are Python modules and packages?",
        "How do you manage dependencies in Python?",
        "What is the Global Interpreter Lock (GIL) in Python?",
        "What are some common Python libraries for data science?",
        "How do you handle file operations in Python?",
        "What is the purpose of the 'with' statement in Python?",
        "What is the difference between is and == in Python?",
        "What are Python decorators used for?",
        "What is the purpose of the 'yield' keyword?",
        "Explain list slicing in Python.",
        "What is multithreading in Python?",
        "How do you optimize Python performance?",
        "What are Python's built-in functions?",
        "What is the difference between Python 2 and Python 3?"
    ],
    
    "c": [
        "What is a pointer in C?",
        "Explain memory allocation in C.",
        "What is the use of the 'const' keyword?",
        "What is a structure in C?",
        "What is the difference between an array and a pointer in C?",
        "What is the purpose of the 'typedef' keyword?",
        "How do you handle dynamic memory allocation in C?",
        "What is a union in C?",
        "Explain the concept of bitwise operators in C.",
        "What is the use of 'void' pointers in C?",
        "What is recursion in C?",
        "What is a function pointer?",
        "What is the difference between 'call by value' and 'call by reference'?",
        "How do you prevent memory leaks in C?",
        "What is the significance of the 'static' keyword?",
        "What is a linked list in C?",
        "What are macros in C?",
        "Explain the use of the 'malloc' and 'calloc' functions.",
        "What is the difference between 'int' and 'long' data types?",
        "What is the purpose of the 'break' and 'continue' statements in C?",
        "Explain the concept of inline functions in C.",
        "What is the difference between '==' and '===' in C?",
        "What are header files and why are they important?",
        "What is a segmentation fault?",
        "What is the use of 'enum' in C?"
    ],
    
    "cpp": [
        "Explain object-oriented programming in C++.",
        "What is a virtual function in C++?",
        "What is the difference between malloc() and new in C++?",
        "What is the role of constructors and destructors in C++?",
        "Explain the concept of multiple inheritance in C++.",
        "What is a friend function in C++?",
        "What is the difference between 'new' and 'malloc' in C++?",
        "What are templates in C++?",
        "What is exception handling in C++?",
        "What are the advantages of using C++ over C?",
        "What is an abstract class in C++?",
        "What is the purpose of the 'static' keyword in C++?",
        "Explain the concept of function overloading in C++.",
        "What is polymorphism in C++?",
        "What is encapsulation in C++?",
        "What is the difference between 'struct' and 'class' in C++?",
        "What is the difference between 'public', 'private', and 'protected' access modifiers in C++?",
        "What are the advantages of using STL in C++?",
        "What is the use of the 'this' pointer in C++?",
        "What is a constructor initializer list in C++?",
        "What is the purpose of 'virtual destructors' in C++?",
        "What are smart pointers in C++?",
        "What is RAII in C++?",
        "What is the use of the 'mutable' keyword in C++?",
        "What is a namespace in C++?"
    ],
    
    "java": [
        "What is a class in Java?",
        "Explain the concept of inheritance in Java.",
        "What is the difference between an interface and an abstract class in Java?",
        "What are Java's access modifiers?",
        "What is polymorphism in Java?",
        "What is encapsulation in Java?",
        "What is the use of the 'final' keyword in Java?",
        "What is a constructor in Java?",
        "What is the difference between '==', 'equals()', and 'hashCode()' in Java?",
        "Explain the concept of method overloading in Java.",
        "What is the use of 'super' in Java?",
        "What is the purpose of the 'this' keyword in Java?",
        "What is the difference between ArrayList and LinkedList in Java?",
        "What is multithreading in Java?",
        "What is synchronization in Java?",
        "Explain the concept of garbage collection in Java.",
        "What is a package in Java?",
        "What is the significance of the 'static' keyword in Java?",
        "What are Lambda expressions in Java?",
        "What are functional interfaces in Java?",
        "What is the difference between 'String' and 'StringBuilder' in Java?",
        "What is the use of the 'transient' keyword in Java?",
        "What is the purpose of the 'volatile' keyword in Java?",
        "What are Java annotations?",
        "What is a Java Stream?"
    ]
}

        
        # Return questions for the requested language
        return coding_questions.get(language, [])

    except Exception as e:
        print(f"Error fetching questions: {e}")
        return {"error": "Error fetching coding questions from API"}, 500

@app.route('/api/questions', methods=['POST'])
def fetch_questions():
    """Route to handle fetching coding questions for a specific language."""
    data = request.get_json()
    language = data.get('language')

    if not language:
        return jsonify({"error": "Language is required"}), 400
    
    questions = fetch_coding_questions(language)
    
    if isinstance(questions, dict) and "error" in questions:
        return jsonify(questions), 404  # Return error if no questions are found
    
    return jsonify({"questions": questions}), 200

@app.route('/api/questions', methods=['OPTIONS'])
def options_handler():
    """Handle CORS preflight requests."""
    response = jsonify({'message': 'Preflight Request'})
    response.headers.add('Access-Control-Allow-Origin', '*')  # Or specify your frontend URL
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response
def generate_pdf(questions_data, filename="coding_questions.pdf"):
    c = canvas.Canvas(filename, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica", 12)
    c.drawString(30, height - 40, "Coding Questions and Answers")
    c.setFont("Helvetica", 10)

    y_position = height - 60  # Start position for text
    
    for language, questions in questions_data.items():
        c.setFont("Helvetica-Bold", 12)
        c.drawString(30, y_position, f"{language.capitalize()} Questions")
        y_position -= 20

        c.setFont("Helvetica", 10)
        
        for qa in questions:
            c.drawString(30, y_position, f"Q: {qa['question']}")
            y_position -= 15
            c.drawString(30, y_position, f"A: {qa['answer']}")
            y_position -= 25

            if y_position < 50:  # Check for page overflow
                c.showPage()
                c.setFont("Helvetica", 10)
                y_position = height - 40

        y_position -= 20  # Extra space between languages
    
    c.save()

def generate_pdf(questions_data):
    # Check if data is not empty or None
    if not questions_data:
        print("No data found")
        return

    # Process the questions_data to generate PDF content
    # For simplicity, we'll just print the data here; replace with actual PDF generation logic
    for language, questions in questions_data.items():
        print(f"Questions for {language}:")
        for question in questions:
            print(f"- {question}")

if __name__ == '__main__':
    app.run(debug=True)
    

