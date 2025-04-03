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
from prophet import Prophet
load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash")

# Global variables to store sales data
weekly_sales = []
monthly_sales = []
yearly_sales = []
csv_file = r"flask\Online Sales Data.csv"
def import_csv_to_mysql(csv_file):
    """
    Imports a CSV file into a MySQL table.
    
    Parameters:
    - db_config: Dictionary with MySQL connection parameters (host, user, password, database).
    - csv_file: Path to the CSV file.
    - table_name: Name of the table where data will be inserted.
    """
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

def fetch_sales_data(date_filter=None):
    """
    Fetches weekly, monthly, and yearly sales data from MySQL and stores it in global variables.
    """

    global weekly_sales, monthly_sales, yearly_sales  # Access global variables

    try:
        # MySQL connection details from .env
        db_config = {
            "host": os.getenv("MYSQL_HOST"),
            "user": os.getenv("MYSQL_USER"),
            "password": os.getenv("MYSQL_PASSWORD"),
            "database": os.getenv("MYSQL_DATABASE"),
            "auth_plugin":'mysql_native_password' 
        }

        # Connect to MySQL
        connection = mysql.connector.connect(**db_config)
        cursor = connection.cursor()

        # Weekly Sales Query (Last 7 Days - Complete Rows)
        cursor.execute("""
            SELECT * FROM Sales_Data
            WHERE YEARWEEK(Date, 1) = YEARWEEK('2024-02-05', 1)  -- '2024-06' represents the 6th week of 2024
            ORDER BY Date;
        """)
        weekly_sales = cursor.fetchall()
        print("Last 7 Days Sales done")

        # Monthly Sales Query (Current Month - Complete Rows)
        cursor.execute("""
            SELECT * FROM Sales_Data
            WHERE DATE_FORMAT(Date, '%Y-%m') = '2024-06'
            ORDER BY Date;
        """)
        monthly_sales = cursor.fetchall()
        print("Current Month Sales done")

        # Yearly Sales Query (Current Year - Complete Rows)
        cursor.execute("""
            SELECT * FROM Sales_Data
            WHERE YEAR(Date) = 2024
            ORDER BY Date;
        """)
        yearly_sales = cursor.fetchall()
        print("Current Year Sales done")

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        # Close the connection
        cursor.close()
        connection.close()

def generate_sales_report1(date_filter=None):
    global weekly_sales, monthly_sales, yearly_sales  # Use global variables
    print("1")
    messages = [
        SystemMessage(content="You are an expert Data analyst. You can create a full-fledged data analysis report. Do not answer any other questions."),
        HumanMessage(content=f"""
        Generate a comprehensive data analysis report based on the given sales data across different time periods: weekly, monthly, and yearly.
        {weekly_sales, monthly_sales, yearly_sales}
        
        **Requirements:**
        - Identify key trends and patterns in sales performance.
        - Highlight significant growth or decline across different periods.
        - Provide insights into category-wise, product-wise, and regional sales performance.
        - Summarize payment method preferences and customer purchasing behaviors.
        - Offer actionable recommendations for improving sales and optimizing business strategies.

        Ensure the report is structured with clear sections, including Overview, Key Metrics, Trends Analysis, Insights, and Recommendations. Do not include raw data samples.
    """)
    ]
    
    response = llm.invoke(messages)
    return response.content.strip()
def generate_sales_report2(date_filter=None):
    """
    Generates a structured JSON sales analysis report using LLM.
    
    Args:
    - llm: Language model instance
    
    Returns:
    - JSON string containing structured sales insights
    """
    global weekly_sales, monthly_sales, yearly_sales  # Ensure global variables are accessible
    print("2")
    messages = [
        SystemMessage(content="You are an expert Data Analyst. Your task is to analyze sales data and generate structured insights in JSON format for visualization purposes. Do not include raw data samples."),
        HumanMessage(content=f"""
        Analyze the given sales data across different time periods (weekly, monthly, yearly) and provide key insights in JSON format.
        
        **Data:**
        - **Weekly Sales:** {weekly_sales}
        - **Monthly Sales:** {monthly_sales}
        - **Yearly Sales:** {yearly_sales}

        **Required JSON Structure:**
        ```json
        {{
            "weekly_sales_trends": {{
                "total_sales": <int>,
                "growth_rate": <float>,
                "sales_by_category": {{"category1": <int>, "category2": <int>}},
                "sales_by_region": {{"region1": <int>, "region2": <int>}}
            }},
            "monthly_sales_trends": {{
                "total_sales": <int>,
                "growth_rate": <float>,
                "sales_by_category": {{"category1": <int>, "category2": <int>}},
                "sales_by_region": {{"region1": <int>, "region2": <int>}}
            }},
            "yearly_sales_trends": {{
                "total_sales": <int>,
                "growth_rate": <float>,
                "sales_by_category": {{"category1": <int>, "category2": <int>}},
                "sales_by_region": {{"region1": <int>, "region2": <int>}}
            }}
        }}
        ```

        **Key Considerations:**
        - Extract important sales trends, including total revenue and growth rates.
        - Identify top-selling products and most profitable categories.
        - Provide regional sales distribution for better market understanding.
        - Ensure the JSON structure remains consistent for easy visualization.

        Only return the JSON response without additional explanations.
        """)
    ]

    response = llm.invoke(messages)  # Generate response using LLM
    return response.content.strip()  # Return the formatted response

def plot_sales_trends(sales_data):
    sns.set_style("whitegrid")
    time_periods = ["weekly_sales_trends", "monthly_sales_trends", "yearly_sales_trends"]
    labels = ["Weekly", "Monthly", "Yearly"]

    try:
        response_content = sales_data.strip("`json\n")
        sales_data = json.loads(response_content)
        print("3")
        for period, label in zip(time_periods, labels):
            if period in sales_data:
                categories = sales_data[period].get("sales_by_category", {})
                plt.figure(figsize=(8, 5))
                sns.barplot(x=list(categories.keys()), y=list(categories.values()), palette="muted")
                plt.title(f"Sales by Category ({label})")
                plt.xlabel("Category")
                plt.ylabel("Sales")
                plt.xticks(rotation=30)
                plt.show()

                regions = sales_data[period].get("sales_by_region", {})
                plt.figure(figsize=(8, 5))
                sns.barplot(x=list(regions.keys()), y=list(regions.values()), palette="coolwarm")
                plt.title(f"Sales by Region ({label})")
                plt.xlabel("Region")
                plt.ylabel("Sales")
                plt.xticks(rotation=30)
                plt.show()

    except json.JSONDecodeError as e:
        print("JSON Decode Error:", e)
    except Exception as e:
        print("Unexpected Error:", e)


def forecast_yearly_sales(data_filter = None):
    global yearly_sales  # Use global variable
    print(type(yearly_sales))
    forecast_data = pd.DataFrame(yearly_sales, columns=['Transaction ID','Date','Product Category','Product Name','Units Sold','Unit Price','Total Revenue','Region','Payment Method'])

    # Ensure correct column names for Prophet ('ds' for date, 'y' for sales)
    df_prophet = forecast_data.reset_index()[['Date', 'Total Revenue']]
    df_prophet.columns = ['ds', 'y']

    # Initialize and fit the model
    model = Prophet()
    model.fit(df_prophet)

    # Create future dates for forecasting (180 days ahead)
    future = model.make_future_dataframe(periods=180)  
    forecast = model.predict(future)

    forecast_json = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(
        columns={'ds': 'Date', 'yhat': 'Forecast', 'yhat_lower': 'Lower Bound', 'yhat_upper': 'Upper Bound'}
    ).to_json(orient="records")
    
    return forecast_json

tools = [
    Tool(
        name="fetch_sales_data",
        func=fetch_sales_data,
        description=("Fetches sales data for the last 7 days (weekly), current month (monthly), "
            "and current year (yearly) from the MySQL database in a single execution. "
            "setting three global variable of sales data in the format: "
            "{'weekly_sales': [...], 'monthly_sales': [...], 'yearly_sales': [...]}.")
    ),
    Tool(
        name="analyze_sales_report_text",
        func=generate_sales_report1,
        description=(
            "Analyzes sales data for the last 7 days (weekly), current month (monthly), "
            "and current year (yearly) and generates a structured sales report in text format using an LLM."
        ),
    ),
    Tool(
        name="generate_sales_report_json",
        func=generate_sales_report2,
        description=(
            "Processes sales data for the last 7 days (weekly), current month (monthly), and current year (yearly) "
            "and generates graph data points in JSON format using an LLM."
        ),
    ),
    # Tool(
    #     name="forecast_yearly_sales",
    #     func=forecast_yearly_sales,
    #     description=(
    #         "Uses Prophet to predict future yearly sales trends based on historical sales data. "
    #         "It takes the `yearly_sales` global variable as input, fits a forecasting model, "
    #         "and predicts future sales for the next **180 days**. "
    #         "The output to be return must be in json format"
    #         "Useful for long-term trend analysis and business planning."
    #     ),
    # )
]

prompt_template = """
You are an expert data analyst with deep expertise in sales forecasting and trend analysis.  
Your objective is to fetch sales data, analyze it, and generate structured reports and visualizations.  

### **Steps to Follow:**
1. **Fetch Sales Data**: Retrieve weekly, monthly, and yearly sales data from the MySQL database.  
   - Use the `fetch_sales_data` tool to store the sales data in the format:  
     ```python
     {{
         'weekly_sales': [...],
         'monthly_sales': [...],
         'yearly_sales': [...]
     }}
     ```
   - Ensure the fetched data is stored correctly in global variables. 
    
2. **Generate JSON Data for Graphing**:  
   - Use the `generate_sales_report_json` tool to extract key data points and trends.  
   - Convert the processed sales insights into a structured JSON format for visualization.  
   
3. **Analyze Sales Data (Text Report)**:  
   - Use the `analyze_sales_report_text` tool to generate a structured sales summary in text format.  
   - Identify key trends, insights, and any anomalies in the data.  



   
### **Final Output Expectations:**
 - **ouput format: dict [json_data: JSON Data for Graphing, summary:**Analyze Sales Data (Text Report)**  

Now execute the workflow step by step. **Do not skip any steps & always send complete dict data asked in Output Format.** Don't stop after Step2, complete all steps also. Generate JSON Data for Graphing then respond with final output. **Strictly use all the tools and follow each step till end."


{agent_scratchpad}
"""

prompt = PromptTemplate(
    input_variables=["agent_scratchpad"],
    template=prompt_template
)

print(prompt_template)

# Create Agent
agent = create_openai_functions_agent(llm, prompt=prompt, tools=tools)

# Agent Executor
agent_executor = AgentExecutor(
    agent=agent,  
    tools=tools, 
    verbose=True    
)

import tempfile

def process_sales_analysis(csv_file):
    """Imports CSV data, fetches sales data, and processes analysis using the agent autonomously."""
    
    # Step 1: Handle DataFrame input
    """Imports CSV data, fetches sales data, and processes analysis using the agent autonomously."""
    
    
    # Step 3: Invoke the agent with updated sales records
    response = agent_executor.invoke({
        "weekly_sales_count": len(weekly_sales),
        "monthly_sales_count": len(monthly_sales),
        "yearly_sales_count": len(yearly_sales),
        "agent_scratchpad": ""  # Keeps track of execution steps
    })

    if isinstance(response, dict) and "output" in response:
       return response['output'] # return f"Sales Analysis Report:\n{response['output']}"
    
    return "Error: Could not generate the sales analysis report."


# Run script
#       # Read CSV as DataFrame
# if __name__ == "__main__":
#     print("Running Autonomous Sales Analysis...")
    
#     report = process_sales_analysis(csv_file)  # Pass DataFrame
#     print(report)
