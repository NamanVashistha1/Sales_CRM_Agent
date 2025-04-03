from flask import Flask, request, jsonify
from flask_cors import CORS
from qeury_agents import process_query
from MPR import process_sales_analysis
from ChurnPredFile import churn_predictions
app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['GET', 'POST'])  # Allow both GET & POST
def generate_response():
    if request.method == "GET":
        return jsonify({"message": "Use POST method to send a query"}), 200

    data = request.json
    user_query = data.get("query", "")
    print("User Query:", user_query)

    response = process_query(user_query)
    print(response)
    return jsonify(response), 200


@app.route('/SalesSummariser', methods=['GET', 'POST'])  # Allow both GET & POST
def sales_summariser():
    if request.method == "GET":
        return jsonify({"message": "Use POST method to send a query"}), 200

    response = process_sales_analysis(r"flask\Online Sales Data.csv")
    # print(response)
    cleaned_content = response.strip('```json\n').strip("```")

    return cleaned_content, 200

@app.route('/GetNotifications', methods=['GET', 'POST'])  # Allow both GET & POST
def getNotification():
    
    response = churn_predictions()
    return response

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
