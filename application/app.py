from flask import Flask, render_template, request, jsonify
import pathlib
import textwrap
import google.generativeai as genai

app = Flask(__name__, template_folder="templates")

# Define to_markdown at the module level
def to_markdown(text):
    text = text.replace('•', ' *')  # Adjust indentation for VS Code output
    return textwrap.indent(text, '> ', predicate=lambda _: True)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process():
    try:
        data = request.get_json()  # retrieve the data sent from JavaScript
        result = data['value']

        api_key = "AIzaSyDTyOrtwTt5NmYe0FchjwJbWqW1Y2V1dno"
        genai.configure(api_key=api_key)
        
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(m.name)
                model = genai.GenerativeModel('gemini-pro')
                output = "Provide a summary report for the following brands".join(result)
                response = model.generate_content(output)
                result_text = to_markdown(response.text)
                print(result_text)

        return jsonify(result=result_text)
    except Exception as e:
        print("Error processing request:", str(e))
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    app.run(debug=True)
