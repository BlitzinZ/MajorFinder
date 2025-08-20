from flask import Flask, render_template, request, jsonify
from majors import majors  # We'll define 5 majors here

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html', majors=majors)

@app.route('/faqs')
def faqs():
    return render_template('faqs.html')

@app.route('/calculate_final', methods=['POST'])
def calculate_final():
    data = request.get_json()
    answers = data.get('answers', {})

    # Score calculation
    results = []
    for m in majors:
        score = sum(answers.get(cat, 0) * weight for cat, weight in m["categories"].items())
        results.append({"major": m["name"], "percent": min(100, int(score))})

    results = sorted(results, key=lambda x: x["percent"], reverse=True)[:3]
    return jsonify(results)

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.form
    print("Feedback received:", data)  # You can log/store this
    return render_template('index.html', message="Thank you for your feedback!")

if __name__ == "__main__":
    app.run(debug=True)
