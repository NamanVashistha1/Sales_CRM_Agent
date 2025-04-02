 # print(report)
import os
import json
import mysql.connector
import csv
import pandas as pd
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import AgentExecutor, Tool, create_openai_functions_agent
from langchain.schema import SystemMessage, HumanMessage
from langchain.prompts import PromptTemplate
import matplotlib.pyplot as plt
import seaborn as sns

load_dotenv()

csv_file = r"flask\Online Sales Data.csv"

def funct():
    try:
        # Load MySQL credentials from environment variables
        db_config = {
            "host": os.getenv("MYSQL_HOST"),
            "user": os.getenv("MYSQL_USER"),
            "password": os.getenv("MYSQL_PASSWORD"),
            "database": os.getenv("MYSQL_DATABASE")
        }
        
        # Connect to MySQL database
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Open the CSV file and read the header
        with open(csv_file, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            header = next(reader)  # Extract column names from header
            
            # Create table dynamically if it doesn't exist
            create_table_query = f"""
            CREATE TABLE IF NOT EXISTS Sales_Data (
                {', '.join([f'`{col}` TEXT' for col in header])}
            )
            """
            cursor.execute(create_table_query)

            # Insert data into table
            placeholders = ', '.join(['%s'] * len(header))  # Prepare placeholders for values
            insert_query = f"INSERT INTO Sales_Data VALUES ({placeholders})"
            
            for row in reader:
                cursor.execute(insert_query, row)

        # Commit changes and close connection
        connection.commit()
        print("Data imported successfully!")
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'connection' in locals() and connection:
            connection.close()

funct()