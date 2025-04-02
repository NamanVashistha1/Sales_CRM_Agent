import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const CRMDashboard = () => {
  // State for chat and notifications
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! How can I help you with your CRM today?", sender: "bot" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New lead assigned to you", time: "10 mins ago", isRead: false },
    { id: 2, text: "Meeting with Acme Corp at 3 PM", time: "1 hour ago", isRead: false },
    { id: 3, text: "Sales target achieved for Q1", time: "Yesterday", isRead: true },
    { id: 4, text: "New feature update available", time: "2 days ago", isRead: true }
  ]);
    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [summary, setSummary] = useState([]);
    const [salesResponse, setsalesResponse] = useState([]);
    const [displayGraph, SetDisplayGraph] = useState(false);
    const [salesByRegionData, setSalesByRegionData] = useState([]);
    const [yearlySalesData, setYearlySalesData] = useState([]);
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const [weeklySalesData, setWeeklySalesData] = useState([]);

    // const handleSend = async () => {
    //   if (!query) return;
    //   console.log("handleSend",query)
    //   try {
    //     const res = await axios.post("http://localhost:5000/generate", { query });
    //     setResponse(res.data.response);
    //     console.log("resssssssssssssspoonse",res)
    //   } catch (error) {
    //     console.error("Error fetching response:", error);
    //     setResponse("Error occurred!");
    //   }
    // }
  // Sample data for charts
  const data = {
    "Notifications" : 
    [
      {
        "id": 52126,
        "notification": "Hi! \ud83d\udc4b Enjoy 15% off on your next Fashion purchase. Use code FASHION15 at checkout. Thanks for shopping with us!"
      },
      {
        "id": 50959,
        "notification": "Hello! We see you love Mobile phones. Get \u20b950 cashback on your next Mobile purchase. Shop now!"
      },
      {
        "id": 55217,
        "notification": "Hi! Enjoy 10% off on your next Mobile Phone purchase. We appreciate your continued support!"
      },
      {
        "id": 54378,
        "notification": "Hi! We noticed you like Mobile Phones. Here's a special offer: \u20b975 cashback on your next order. Shop now!"
      },
      {
        "id": 50933,
        "notification": "Hello! Laptops & Accessories are now at discounted prices! Get an extra 10% off with code LAPTOP10. Shop today!"
      },
      {
        "id": 52827,
        "notification": "We value your feedback! As a valued customer, get an exclusive 20% discount on your next Fashion order. Use code THANKYOU20."
      },
      {
        "id": 50438,
        "notification": "We apologize for any inconvenience! Enjoy a special \u20b9100 discount on your next Mobile order. Use code SORRY100."
      },
      {
        "id": 52009,
        "notification": "We are sorry to hear that your experience was not satisfactory. Get \u20b925 cashback on your next mobile order. We hope to see you soon!"
      },
      {
        "id": 54497,
        "notification": "We value your feedback! As a valued customer, get an exclusive 15% discount on your next Mobile Phone order. Use code VALUED15."
      },
      {
        "id": 50355,
        "notification": "We apologize for any inconvenience! Enjoy a special \u20b950 discount on your next Mobile order. Use code APOLOGY50."
      }
    ],
  };
  useEffect(() => {
    // Transform data to required format
    const formattedNotifications = data.Notifications.map((item, index) => ({
      id: item.id,
      text: item.notification,
      time: index === 0 ? "Just now" : `${index * 10} mins ago`,
      isRead: false
    }));

    setNotifications(formattedNotifications);
  }, []);
  
  // const salesData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  //   datasets: [
  //     {
  //       label: 'Sales 2025',
  //       data: [65, 59, 80, 81, 56, 55],
  //       fill: false,
  //       borderColor: 'rgb(75, 192, 192)',
  //       tension: 0.1,
  //     },
  //     {
  //       label: 'Sales 2024',
  //       data: [45, 49, 60, 71, 46, 45],
  //       fill: false,
  //       borderColor: '#742774',
  //       tension: 0.1,
  //     }
  //   ],
  // };

  // const leadSourceData = {
  //   labels: ['Website', 'Referral', 'Social Media', 'Email', 'Other'],
  //   datasets: [
  //     {
  //       label: 'Lead Source',
  //       data: [12, 19, 3, 5, 2],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.5)',
  //         'rgba(54, 162, 235, 0.5)',
  //         'rgba(255, 206, 86, 0.5)',
  //         'rgba(75, 192, 192, 0.5)',
  //         'rgba(153, 102, 255, 0.5)',
  //       ],
  //       borderColor: [
  //         'rgba(255, 99, 132, 1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const taskCompletionData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  //   datasets: [
  //     {
  //       label: 'Completed Tasks',
  //       data: [22, 19, 30, 24, 28, 25],
  //       backgroundColor: 'rgba(54, 162, 235, 0.5)',
  //     },
  //     {
  //       label: 'Pending Tasks',
  //       data: [12, 9, 13, 5, 12, 3],
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     }
  //   ],
  // };
//   const salesResponse = {
//     "weekly_sales_trends": {
//         "total_sales": 5374.84,
//         "growth_rate": 0.0,
//         "sales_by_category": {
//             "Sports": 2454.96,
//             "Electronics": 1199.97,
//             "Home Appliances": 1599.98,
//             "Clothing": 239.96,
//             "Books": 74.97,
//             "Beauty Products": 105.0
//         },
//         "sales_by_region": {
//             "Asia": 2394.92,
//             "North America": 1274.94,
//             "Europe": 1705.0
//         }
//     },
//     "monthly_sales_trends": {
//         "total_sales": 5309.54,
//         "growth_rate": 0.0,
//         "sales_by_category": {
//             "Clothing": 679.42,
//             "Books": 149.86,
//             "Beauty Products": 210.49,
//             "Sports": 1365.93,
//             "Electronics": 2799.94,
//             "Home Appliances": 904.0
//         },
//         "sales_by_region": {
//             "Asia": 2074.79,
//             "North America": 2369.88,
//             "Europe": 864.87
//         }
//     },
//     "yearly_sales_trends": {
//         "total_sales": 49424.82,
//         "growth_rate": 0.0,
//         "sales_by_category": {
//             "Electronics": 13789.73,
//             "Home Appliances": 8469.8,
//             "Clothing": 6064.07,
//             "Books": 2089.1,
//             "Beauty Products": 1337.22,
//             "Sports": 5674.9
//         },
//         "sales_by_region": {
//             "North America": 13359.21,
//             "Europe": 9087.04,
//             "Asia": 26978.57
//         }
//     }
// };

// Extract trends

  const formatResponse = (response) => {
    const lines = response.split("\n");
  
    let formattedText = "";
    let inTable = false;
  
    lines.forEach(line => {
      if (line.includes("|") && !line.includes("---")) {
        if (!inTable) {
          formattedText += "\n"; // Ensure a line break before the table starts
          inTable = true;
        }
        formattedText += `${line}\n`;
      } else {
        if (inTable) {
          formattedText += "\n"; // Add a line break after table ends
          inTable = false;
        }
        formattedText += `${line}\n`;
      }
    });
  
    return formattedText.trim();
  };
  

  // Handler for sending messages in the chat
  const handleSendMessage = async(e) => {
    if (!query) return;
    console.log("handleSend", query);

    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMessageId = messages.length + 1;
    setMessages([...messages, { id: userMessageId, text: newMessage, sender: "user" }]);
    setNewMessage("");
     
      try {
        const res = await axios.post("http://localhost:5000/generate", { query });
        // const formattedResponse = formatResponse(res.data.response);
        console.log(res.data)
        setMessages(prevMessages => [...prevMessages, { 
          id: prevMessages.length + 1, 
          text: res.data, 
          sender: "bot" 
        }]);

      } catch (error) {
        console.error("Error fetching response:", error);
        setMessages(prevMessages => [...prevMessages, { 
          id: prevMessages.length + 1, 
          text: "❌ Error occurred while fetching response.", 
          sender: "bot" 
        }]);
      }
  };

  const graph1= {
    "labels": [
        "Clothing",
        "Books",
        "Beauty Products",
        "Sports",
        "Electronics",
        "Home Appliances"
    ],
    "datasets": [
        {
            "label": "Monthly Sales",
            "data": [
                579.4,
                149.86,
                209.49,
                1365.93,
                2099.94,
                1173.88
            ],
            "backgroundColor": "rgba(255, 159, 64, 0.5)",
            "borderColor": "rgba(255, 159, 64, 1)",
            "borderWidth": 1
        }
    ]
}

  const handleGenerate = async() => {
    
    console.log("handleGenerate requested");
      try {
        // const res = await axios.post("http://localhost:5000/SalesSummariser");
        // const formattedResponse = formatResponse(res.data.response);
       let data1  = {
          "summary": "## Sales Data Analysis Report - 2024\n\n**Executive Summary:**\n\nThis report presents a comprehensive analysis of sales data collected across various timeframes (weekly, monthly, and yearly) in 2024. The analysis identifies key trends, patterns, and insights into sales performance, category-wise performance, regional contributions, payment method preferences, and customer purchasing behaviors. Based on these findings, the report concludes with actionable recommendations to improve sales strategies and optimize business operations.\n\n**1. Overview:**\n\nThe sales data encompasses transactions across diverse product categories (Electronics, Home Appliances, Clothing, Books, Beauty Products, and Sports) and geographical regions (Asia, North America, and Europe). The analysis aims to understand the dynamics of sales performance throughout the year, identify high-performing areas, and reveal opportunities for growth and improvement. The dataset includes information on order ID, purchase date, product category, product name, quantity, unit price, total price, region, and payment method.\n\n**2. Key Metrics:**\n\n*   **Total Sales Revenue:** The overall revenue generated during the analyzed period.\n*   **Average Order Value (AOV):** The average amount spent per transaction.\n*   **Sales Volume:** The total number of products sold.\n*   **Category-Specific Sales:** Revenue generated by each product category.\n*   **Regional Sales:** Revenue generated by each geographical region.\n*   **Payment Method Distribution:** Percentage of sales attributed to each payment method.\n*   **Top-Selling Products:** Products with the highest sales revenue.\n*   **Customer Acquisition Cost (CAC):** The cost associated with acquiring a new customer.\n*   **Customer Lifetime Value (CLTV):** A prediction of the net profit attributed to the entire future relationship with a customer.\n\n**3. Trends Analysis:**\n\n*   **Yearly Trends:**\n    *   Overall sales trajectory for 2024, showcasing the total revenue earned.\n    *   Sales growth or decline compared to the previous year (if prior data is available).\n    *   Identification of the best and worst-performing months in terms of sales revenue.\n*   **Monthly Trends:**\n    *   Detailed breakdown of sales performance on a month-by-month basis.\n    *   Identification of seasonal patterns or recurring trends in sales.\n    *   Analysis of the impact of marketing campaigns or promotional activities on monthly sales figures.\n*   **Weekly Trends:**\n    *   Granular analysis of sales fluctuations within each week.\n    *   Identification of peak sales days or periods during the week.\n    *   Assessment of the impact of day-specific promotions or events on sales.\n\n**4. Insights:**\n\n*   **Category Performance:**\n    *   Identification of the best-performing product categories in terms of revenue and volume.\n    *   Analysis of the growth potential and market share of each category.\n    *   Insights into customer preferences and demand for different product types.\n*   **Product Performance:**\n    *   Identification of top-selling products driving the majority of revenue.\n    *   Analysis of product-specific sales trends and customer reviews.\n    *   Insights into product pricing strategies and their impact on sales volume.\n*   **Regional Performance:**\n    *   Analysis of sales performance across different geographical regions (Asia, North America, Europe).\n    *   Identification of key markets and growth opportunities in each region.\n    *   Insights into regional customer preferences and purchasing behaviors.\n*   **Payment Method Preferences:**\n    *   Analysis of the distribution of payment methods used by customers.\n    *   Identification of the most popular payment methods in each region.\n    *   Insights into the impact of payment options on conversion rates and customer satisfaction.\n*   **Customer Purchasing Behaviors:**\n    *   Analysis of customer purchase frequency, average order value, and product preferences.\n    *   Identification of customer segments based on purchasing behaviors.\n    *   Insights into customer loyalty and retention rates.\n\n**5. Recommendations:**\n\nBased on the analysis of sales data, the following recommendations are proposed to improve sales performance and optimize business strategies:\n\n*   **Category Optimization:**\n    *   Focus on promoting and expanding the product offerings in high-performing categories.\n    *   Develop targeted marketing campaigns to drive sales in underperforming categories.\n    *   Conduct market research to identify emerging trends and customer demands in each category.\n*   **Product Strategy:**\n    *   Prioritize the marketing and promotion of top-selling products.\n    *   Consider bundling or cross-selling opportunities to increase the average order value.\n    *   Evaluate product pricing strategies to maximize profitability and competitiveness.\n*   **Regional Expansion:**\n    *   Focus on expanding sales efforts in regions with high growth potential.\n    *   Customize marketing campaigns and product offerings to cater to regional customer preferences.\n    *   Explore partnerships with local distributors or retailers to increase market penetration.\n*   **Payment Method Enhancement:**\n    *   Offer a variety of payment options to cater to customer preferences.\n    *   Implement secure and user-friendly payment gateways to improve the customer experience.\n    *   Consider offering incentives or discounts for using preferred payment methods.\n*   **Customer Engagement:**\n    *   Implement customer loyalty programs to reward repeat customers.\n    *   Personalize marketing communications based on customer purchasing behaviors.\n    *   Solicit customer feedback to improve product offerings and customer service.\n*   **Promotional Campaigns:**\n    *   Strategically plan promotional campaigns based on the weekly and monthly trends.\n    *   Increase promotional activities during off-peak periods to boost sales.\n    *   Use data-driven insights to optimize pricing strategies and promotional offers.\n*   **Inventory Management:**\n    *   Optimize inventory levels to minimize stockouts and overstocking based on demand trends.\n    *   Implement a robust inventory management system to track product availability and sales performance.\n    *   Analyze historical sales data to forecast future demand and optimize inventory planning.\n\n**Conclusion:**\n\nBy implementing these recommendations, the company can leverage the insights gained from the sales data analysis to improve sales performance, optimize business strategies, and enhance customer satisfaction. Continuous monitoring and analysis of sales data are essential to adapt to changing market conditions and maintain a competitive edge in the industry.",
          "json_data": {
              "weekly_sales_trends": {
                  "total_sales": 5274.86,
                  "growth_rate": 0,
                  "sales_by_category": {
                      "Sports": 2754.94,
                      "Electronics": 1199.97,
                      "Home Appliances": 1599.98,
                      "Clothing": 239.96,
                      "Books": 74.97,
                      "Beauty Products": 105
                  },
                  "sales_by_region": {
                      "Asia": 2494.92,
                      "North America": 1274.94,
                      "Europe": 1505
                  }
              },
              "monthly_sales_trends": {
                  "total_sales": 5578.5,
                  "growth_rate": 0,
                  "sales_by_category": {
                      "Clothing": 579.4,
                      "Books": 149.86,
                      "Beauty Products": 209.49,
                      "Sports": 1365.93,
                      "Electronics": 2099.94,
                      "Home Appliances": 1173.88
                  },
                  "sales_by_region": {
                      "Asia": 2726.79,
                      "North America": 2213.86,
                      "Europe": 637.85
                  }
              },
              "yearly_sales_trends": {
                  "total_sales": 41876.71,
                  "growth_rate": 0,
                  "sales_by_category": {
                      "Electronics": 9739.86,
                      "Home Appliances": 8779.77,
                      "Clothing": 5289.39,
                      "Books": 2118.84,
                      "Beauty Products": 1556.25,
                      "Sports": 14402.59
                  },
                  "sales_by_region": {
                      "North America": 14893.39,
                      "Europe": 9070.74,
                      "Asia": 17912.58
                  }
              }
          }
        }

        // console.log(data1.summary, data1.json_data)
        setSummary(data1.summary)
        setsalesResponse(data1.json_data)
        // console.log(summary, salesResponse)
       

        const { weekly_sales_trends, monthly_sales_trends, yearly_sales_trends } = salesResponse;

        console.log(weekly_sales_trends, monthly_sales_trends, yearly_sales_trends)
        setWeeklySalesData({
          labels: Object.keys(weekly_sales_trends.sales_by_category),
          datasets: [
            {
              label: 'Weekly Sales',
              data: Object.values(weekly_sales_trends.sales_by_category),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        })
        
        setMonthlySalesData({
          labels: Object.keys(monthly_sales_trends.sales_by_category),
          datasets: [
            {
              label: 'Monthly Sales',
              data: Object.values(monthly_sales_trends.sales_by_category),
              backgroundColor: 'rgba(255, 159, 64, 0.5)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        })
        
        setYearlySalesData({
          labels: Object.keys(yearly_sales_trends.sales_by_category),
          datasets: [
            {
              label: 'Yearly Sales',
              data: Object.values(yearly_sales_trends.sales_by_category),
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        })
        
        setSalesByRegionData({
          labels: Object.keys(yearly_sales_trends.sales_by_region),
          datasets: [
            {
              label: 'Sales by Region',
              data: Object.values(yearly_sales_trends.sales_by_region),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              borderWidth: 1,
            },
          ],
        });

        // console.log(monthlySalesData, salesByRegionData, yearlySalesData, weeklySalesData)

        SetDisplayGraph(true);
        

      } catch (error) {
        console.error("Error fetching response:", error);
        // setMessages(prevMessages => [...prevMessages, { 
        //   id: prevMessages.length + 1, 
        //   text: "Error occurred while fetching response.", 
        //   sender: "bot" 
        // }]);
      }
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(note => ({ ...note, isRead: true })));
  };

  // Calculate unread notifications count
  const unreadCount = notifications.filter(note => !note.isRead).length;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-white p-3 min-vh-100">
          <h3 className="text-center mb-4">CRM Dashboard</h3>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a href="#" className="nav-link text-white active">
                <i className="bi bi-house-door me-2"></i> Dashboard
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link text-white">
                <i className="bi bi-people me-2"></i> Contacts
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link text-white">
                <i className="bi bi-briefcase me-2"></i> Deals
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link text-white">
                <i className="bi bi-calendar-event me-2"></i> Tasks
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link text-white">
                <i className="bi bi-bar-chart me-2"></i> Reports
              </a>
            </li>
            <li className="nav-item mb-2">
              <a href="#" className="nav-link text-white">
                <i className="bi bi-gear me-2"></i> Settings
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-3 position-relative">
          {/* Top Bar with Notifications */}
          <div className="row mb-4">
            <div className="col d-flex justify-content-between align-items-center">
              <h2>Welcome back, User</h2>
              <div className="position-relative">
                <button 
                  className="btn btn-outline-secondary position-relative" 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <i className="bi bi-bell-fill"></i>
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {isNotificationOpen && (
                  <div className="position-absolute end-0 mt-2 shadow bg-white rounded p-2" style={{ width: '300px', zIndex: 1000 }}>
                    <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                      <h6 className="m-0">Notifications</h6>
                      <button className="btn btn-sm btn-link" onClick={markAllAsRead}>Mark all as read</button>
                    </div>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-2 border-bottom ${notification.isRead ? '' : 'bg-light'}`}
                        >
                          <div className="d-flex justify-content-between">
                            <span>{notification.text}</span>
                            {!notification.isRead && <span className="badge bg-primary"style={{height:'fit-content'}}>New</span>}
                          </div>
                          <small className="text-muted">{notification.time}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
         
          <button className='Primary' onClick={()=> handleGenerate()}>Generate</button>
          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5 className="card-title">Total Customers</h5>
                  <p className="card-text fs-1">1,254</p>
                  <small>+5% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5 className="card-title">Revenue</h5>
                  <p className="card-text fs-1">$84,520</p>
                  <small>+12% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-warning">
                <div className="card-body">
                  <h5 className="card-title">Open Deals</h5>
                  <p className="card-text fs-1">37</p>
                  <small>-2% from last month</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-danger">
                <div className="card-body">
                  <h5 className="card-title">Tasks</h5>
                  <p className="card-text fs-1">24</p>
                  <small>8 urgent tasks</small>
                </div>
              </div>
            </div>
          </div>


          {/* Charts */}
          {displayGraph ? (
            <>
            <div className="row mb-4">
            <div className="col-md-8">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Sales Performance</h5>
                </div>
                <div className="card-body">
                <Bar data={weeklySalesData} />

                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Lead Sources</h5>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center">
                  <div style={{ width: '100%', height: '100%' }}>
                  <Bar data={monthlySalesData} />

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Sales Performance</h5>
                </div>
                <div className="card-body">
                <Bar data={yearlySalesData} />

                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Lead Sources</h5>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center">
                  <div style={{ width: '100%', height: '100%' }}>
                  <Pie data={salesByRegionData} />

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div 
              style={{ 
                maxWidth: "800px", 
                background: "#fff", 
                padding: "20px", 
                borderRadius: "10px", 
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", 
                lineHeight: "1.6", 
                whiteSpace: "pre-wrap" 
              }}
            >
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>


          </>
          ) : (<>
          </>)}
          

          {/* <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Task Completion</h5>
                </div>
                <div className="card-body">
                <Bar data={yearlySalesData} />
                
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Task Completion</h5>
                </div>
                <div className="card-body">
                <Pie data={salesByRegionData} />
                
                </div>
              </div>
            </div>
          </div> */}

          {/* Recent Activities */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Recent Activities</h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>John Doe</strong> added a new contact
                        <div className="text-muted small">10 minutes ago</div>
                      </div>
                      <span className="badge bg-primary rounded-pill">Contact</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Jane Smith</strong> closed a deal with Acme Inc
                        <div className="text-muted small">1 hour ago</div>
                      </div>
                      <span className="badge bg-success rounded-pill">Deal</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Mike Johnson</strong> scheduled a meeting with XYZ Corp
                        <div className="text-muted small">Yesterday</div>
                      </div>
                      <span className="badge bg-warning text-dark rounded-pill">Meeting</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Sarah Williams</strong> updated the pricing for Enterprise plan
                        <div className="text-muted small">Yesterday</div>
                      </div>
                      <span className="badge bg-info text-dark rounded-pill">Update</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Bot */}
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1000 }}>
            {/* Chat Button */}
            {!isChatOpen && (
              <button 
                className="btn btn-primary rounded-circle shadow" 
                style={{ width: '60px', height: '60px' }}
                onClick={() => setIsChatOpen(true)}
              >
                <i className="bi bi-chat-dots-fill fs-4"></i>
              </button>
            )}
            
            {/* Chat Window */}
            {isChatOpen && (
              <div className="card shadow" style={{ width: '350px' }}>
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="m-0">CRM Assistant</h5>
                  <button 
                    className="btn btn-sm text-white" 
                    onClick={() => setIsChatOpen(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="card-body bg-light p-3" style={{ height: '350px', overflowY: 'auto' }}>
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`d-flex ${message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                    >
                      <div 
                        className={`p-2 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-white'}`}
                        style={{ maxWidth: '80%' }}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-footer p-2">
                  <form onSubmit={handleSendMessage}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button className="btn btn-primary" type="submit" onClick={()=>{
                        setQuery(newMessage)
                      }}>
                        <i className="bi bi-send"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard;