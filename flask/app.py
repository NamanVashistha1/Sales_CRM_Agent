from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET', 'POST'])  # Allow both GET & POST
def generate_response():
    if request.method == "GET":
        return jsonify({"message": "Use POST method to send a query"}), 200

    data = request.json
    user_query = data.get("query", "")
    print("User Query:", user_query)

    response = {"response": f"Received: {user_query}"}
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
