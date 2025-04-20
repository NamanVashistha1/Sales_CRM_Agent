import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import pickle
import json
import requests
from flask_socketio import SocketIO

import threading 
import asyncio
import time


def churn_predictions(): 
    # Load the dataset (replace 'filename.csv' with the actual filename)
    commerce_filepath = r"D:\projects\Sales_CRM_Agent\flask\E Commerce Dataset.xlsx"
    pd.read_excel(commerce_filepath,sheet_name = "E Comm")
    df = pd.read_excel(commerce_filepath,sheet_name = "E Comm")
    df_original = df.copy()
      
      
      # Fill missing values with median
    df['Tenure'].fillna(df['Tenure'].median(), inplace=True)
    df['WarehouseToHome'].fillna(df['WarehouseToHome'].median(), inplace=True)
    df['HourSpendOnApp'].fillna(df['HourSpendOnApp'].median(), inplace=True)
    df['OrderAmountHikeFromlastYear'].fillna(df['OrderAmountHikeFromlastYear'].median(), inplace=True)
    df['CouponUsed'].fillna(df['CouponUsed'].median(), inplace=True)
    df['OrderCount'].fillna(df['OrderCount'].median(), inplace=True)
    df['DaySinceLastOrder'].fillna(df['DaySinceLastOrder'].median(), inplace=True)

    # Encode categorical variables
    label_encoders = {}
    Customer_IDs = df['CustomerID']
    for col in df.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        label_encoders[col] = le

    # Normalize numerical features
    scaler = StandardScaler()

    numerical_cols = df.select_dtypes(include=['float64', 'int64']).columns.drop(['Churn', 'CustomerID'])  # Exclude target column
    df[numerical_cols] = scaler.fit_transform(df[numerical_cols])


    # Define features (X) and target (y)
    X = df.drop(columns=['Churn', 'CustomerID'])
    y = df['Churn']

    # Split into training and test sets (80-20 split)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
          
          
    MODEL_PATH = r'D:\projects\Sales_CRM_Agent\flask\Churn_model.pkl'

    if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, "rb") as file:
                model = pickle.load(file)


    # Make predictions
    y_pred = model.predict(X_test)

        
    # Inverse transform numerical features to restore original values
    X_test_original = X_test.copy()
    X_test_original[numerical_cols] = scaler.inverse_transform(X_test[numerical_cols])

    # Reattach Customer_IDs using the original index of X_test
    X_test_original['CustomerID'] = Customer_IDs.loc[X_test.index].values

    # Add predictions
    y_pred_series = pd.Series(y_pred, index=X_test.index, name="Predicted")
    X_test_original['Predicted'] = y_pred_series

    # Filter rows where y_pred == 1
    filtered_X_test = X_test_original[X_test_original["Predicted"] == 1]


    # Get indices where y_pred == 1 (churn predicted)
    churn_indices = X_test.index[y_pred == 1]

    # Retrieve the original rows from df_original
    churn_customers = df_original.loc[churn_indices]

    # Select the top 10 customers (if more than 10 exist)
    churn_customers = churn_customers.head(10)


    # Convert to JSON format
    churn_customers_json = churn_customers.to_dict(orient="records")
          
              
    api_key = ""  # Replace with your actual API key
    prompt = f"""
    You are a marketing AI expert generating personalized notifications for customers at high risk of churn.

    ### **Task:**
    You will receive structured customer data in JSON format with the following attributes:
      - **CustomerID** (Unique ID)
      - **Churn** (Churn status)
      - **Tenure**, **PreferredLoginDevice**, **CityTier**, **WarehouseToHome**
      - **PreferredPaymentMode**, **Gender**, **HourSpendOnApp**
      - **NumberOfDeviceRegistered**, **PreferedOrderCat**, **SatisfactionScore**
      - **MaritalStatus**, **NumberOfAddress**, **Complain**, **Order Trends**
      - **CouponUsed**, **OrderCount**, **DaySinceLastOrder**, **CashbackAmount**
      
    Based on the given data, craft **tailored promotional notifications**.

    ### **Personalization Guidelines:**
    - 📢 **Cashback Offers**: Offer exclusive cashback for frequent users or those with **high order amounts**.
    - 🛍 **Category Discounts**: Provide discounts on **favorite order categories** for customers with **reduced spending**.
    - 💬 **Complaint Handling**: Address customer **complaints** with **targeted retention offers**.
    - 🎖 **Loyalty Rewards**: Highlight **loyalty rewards** for **long-tenure** customers.
    - 🔄 **Re-engagement**: Encourage **repeat purchases** for customers **inactive for many days**.

    ---

    ### **Expected JSON Output Format:**
    Ensure the response is **strictly in JSON format**, with separate entries for each customer.

    ```json
    [
      {{
        "CustomerID": "12345",
        "Notification": "Hi John! 🎉 We've noticed you love ordering electronics. Enjoy an exclusive 20% discount on your next purchase! Use code TECH20 at checkout. Limited time offer!"
      }},
      {{
        "CustomerID": "67890",
        "Notification": "Hey Sarah! We miss you! Your last order was 45 days ago. Get ₹300 cashback on your next purchase. Come back and shop with us today!"
      }}
    ]
    Now, generate tailored notifications for each customer based on the given JSON data. JSON data {json.dumps(churn_customers_json, indent=2)}""" 
      

    def generate_content(prompt, api_key):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        response = requests.post(url, headers=headers, json=data)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": response.status_code, "message": response.text}

    # Example usage:

    response = generate_content(prompt, api_key)

      

    # Extract the JSON string from the response
    json_text = response['candidates'][0]['content']['parts'][0]['text']

    # Remove markdown notation if present (```json ... ```)
    json_text_clean = json_text.strip("```json").strip("```")

    # Convert to Python dictionary
    customer_notifications = json.loads(json_text_clean)

    # Extract the required fields
    formatted_notifications = [
        {"id": customer["CustomerID"], "notification": customer["Notification"]}
        for customer in customer_notifications
    ]

    # Print or use the formatted JSON
    print(json.dumps(formatted_notifications, indent=2))
    return json.dumps(formatted_notifications, indent=2)
    

# def schedule_churn_prediction():
#     while True:
#         churn_predictions()
#         time.sleep(15)  

# def run_async_task():
#     thread = threading.Thread(target=schedule_churn_prediction)
#     thread.daemon = True
#     thread.start()
    
# run_async_task()
# asyncio.get_event_loop().run_forever()
