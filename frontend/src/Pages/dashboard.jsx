import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from "react-markdown";
import { Line, Bar, Pie } from 'react-chartjs-2';
import { jsPDF } from "jspdf";
import remarkGfm from "remark-gfm";
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
    const [summary, setSummary] = useState(null);
    const [salesResponse, setsalesResponse] = useState(null);
    const [displayGraph, SetDisplayGraph] = useState(false);
    const [salesByRegionData, setSalesByRegionData] = useState([]);
    const [yearlySalesData, setYearlySalesData] = useState([]);
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const [weeklySalesData, setWeeklySalesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [forecastData, setForecastData] = useState(null);

    
useEffect(() => {
  if (!salesResponse) return; // Prevent running on first render

  console.log("Updated salesResponse:", salesResponse);

  const { weekly_sales_trends, monthly_sales_trends, yearly_sales_trends } = salesResponse;

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
  });

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
  });

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
  });

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

  SetDisplayGraph(true);
}, [salesResponse]); 



const handleGetNotifications = async () => {
      console.log("Asking for notifications.")
      try {
        const res = await axios.post("http://localhost:5000/GetNotifications");
        console.log("resssssssssssssspoonse",res)
        const formattedNotifications = res.data.map((item, index) => ({
          id: item.id,
          text: item.notification,
          time: "Just now",
          isRead: false
        }));
        setNotifications((prevNotifications) => [
          ...formattedNotifications,
          ...prevNotifications,
          
        ]);
      } catch (error) {
        console.error("Error fetching response:", error);
        setResponse("Error occurred!");
      }
    }

    const hasRun = useRef(false);

    useEffect(() => {
      console.log("Setting up interval...");
    
      const interval = setInterval(() => {
        // console.log("Calling handleGetNotifications...");
        handleGetNotifications();
      }, 30000);
    
      return () => {
        clearInterval(interval);
      };
    }, [handleGetNotifications]);
    

// Extract trends
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



const generatePDF = () => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(summary, 10, 10, { maxWidth: 180 });
  doc.save("summary.pdf");
};

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
const handleGenerate = async () => {

//  let json_data = [{"Date":1704067200000,"Forecast":735.4431009948,"Lower Bound":183.0720006261,"Upper Bound":1372.9983772019},{"Date":1704153600000,"Forecast":758.3095227938,"Lower Bound":141.4766312568,"Upper Bound":1390.7141514869},{"Date":1704240000000,"Forecast":661.7561303936,"Lower Bound":89.9709705995,"Upper Bound":1305.8622194841},{"Date":1704326400000,"Forecast":601.9098693318,"Lower Bound":3.8249072624,"Upper Bound":1208.981318715},{"Date":1704412800000,"Forecast":708.6720224568,"Lower Bound":113.0091943076,"Upper Bound":1284.3612641639},{"Date":1704499200000,"Forecast":653.1524168779,"Lower Bound":81.5966060899,"Upper Bound":1241.9960004503},{"Date":1704585600000,"Forecast":629.4902077426,"Lower Bound":31.5668581792,"Upper Bound":1234.2477374946},{"Date":1704672000000,"Forecast":626.5320292084,"Lower Bound":43.2545622011,"Upper Bound":1244.7345766144},{"Date":1704758400000,"Forecast":649.3984511016,"Lower Bound":62.0500896898,"Upper Bound":1257.078820929},{"Date":1704844800000,"Forecast":552.8450587956,"Lower Bound":-34.565645262,"Upper Bound":1188.0892394927},{"Date":1704931200000,"Forecast":492.9987978279,"Lower Bound":-88.8041748817,"Upper Bound":1112.4700296829},{"Date":1705017600000,"Forecast":599.7609510467,"Lower Bound":6.4334655354,"Upper Bound":1180.103854974},{"Date":1705104000000,"Forecast":544.241345562,"Lower Bound":-48.4380226776,"Upper Bound":1136.1796516767},{"Date":1705190400000,"Forecast":520.5791365206,"Lower Bound":-76.6124471698,"Upper Bound":1164.8255362465},{"Date":1705276800000,"Forecast":517.6209580804,"Lower Bound":-38.5074190783,"Upper Bound":1095.5904211741},{"Date":1705363200000,"Forecast":540.4873799735,"Lower Bound":-91.5181889371,"Upper Bound":1158.8010416826},{"Date":1705449600000,"Forecast":445.4013172941,"Lower Bound":-154.3963244986,"Upper Bound":1055.9502378496},{"Date":1705536000000,"Forecast":387.0223859533,"Lower Bound":-227.068213622,"Upper Bound":947.6227047428},{"Date":1705622400000,"Forecast":495.2518687989,"Lower Bound":-103.0183503515,"Upper Bound":1167.841024134},{"Date":1705708800000,"Forecast":441.1995929408,"Lower Bound":-170.789179186,"Upper Bound":1044.0079173079},{"Date":1705795200000,"Forecast":419.004713526,"Lower Bound":-156.5460641659,"Upper Bound":1007.0754120869},{"Date":1705881600000,"Forecast":417.5138647128,"Lower Bound":-224.2913895703,"Upper Bound":1041.9900523332},{"Date":1705968000000,"Forecast":441.8476162326,"Lower Bound":-196.3967550729,"Upper Bound":1059.0780974794},{"Date":1706054400000,"Forecast":346.7615535535,"Lower Bound":-261.8686708615,"Upper Bound":932.9663638478},{"Date":1706140800000,"Forecast":301.9104147223,"Lower Bound":-286.1405161678,"Upper Bound":912.208783199},{"Date":1706227200000,"Forecast":423.6676900778,"Lower Bound":-138.1868338924,"Upper Bound":1032.4627640165},{"Date":1706313600000,"Forecast":383.1432067296,"Lower Bound":-223.9734933709,"Upper Bound":989.2763137477},{"Date":1706400000000,"Forecast":374.4761198248,"Lower Bound":-206.7824835166,"Upper Bound":993.9051319286},{"Date":1706486400000,"Forecast":386.5130635213,"Lower Bound":-229.1612773458,"Upper Bound":965.0760920911},{"Date":1706572800000,"Forecast":424.3746075512,"Lower Bound":-148.1800525329,"Upper Bound":1050.4913415813},{"Date":1706659200000,"Forecast":342.8163373819,"Lower Bound":-282.1980103074,"Upper Bound":959.829040028},{"Date":1706745600000,"Forecast":297.965449961,"Lower Bound":-271.9386272155,"Upper Bound":899.4569797061},{"Date":1706832000000,"Forecast":419.7229767276,"Lower Bound":-153.0349386399,"Upper Bound":1032.4476072907},{"Date":1706918400000,"Forecast":379.1987447899,"Lower Bound":-206.5190056115,"Upper Bound":985.8323457324},{"Date":1707004800000,"Forecast":370.5319092959,"Lower Bound":-242.9490634172,"Upper Bound":935.4833685466},{"Date":1707091200000,"Forecast":382.5691044029,"Lower Bound":-221.0846300545,"Upper Bound":996.6768054576},{"Date":1707177600000,"Forecast":420.4308998435,"Lower Bound":-161.4660917187,"Upper Bound":1009.8822320892},{"Date":1707264000000,"Forecast":338.8728810849,"Lower Bound":-261.6515638097,"Upper Bound":928.0988271415},{"Date":1707350400000,"Forecast":294.0219936642,"Lower Bound":-312.3034376056,"Upper Bound":872.1810114825},{"Date":1707436800000,"Forecast":415.7795173883,"Lower Bound":-160.5829057067,"Upper Bound":987.0304521876},{"Date":1707523200000,"Forecast":375.2552824088,"Lower Bound":-236.172099693,"Upper Bound":952.3629367974},{"Date":1707609600000,"Forecast":366.5884438726,"Lower Bound":-226.5893507092,"Upper Bound":1047.1319181931},{"Date":1707696000000,"Forecast":378.6256359379,"Lower Bound":-190.412693911,"Upper Bound":971.7447273206},{"Date":1707782400000,"Forecast":416.4874283361,"Lower Bound":-154.155883132,"Upper Bound":1057.3224870284},{"Date":1707868800000,"Forecast":334.9294065353,"Lower Bound":-235.4310334608,"Upper Bound":947.0878406832},{"Date":1707955200000,"Forecast":290.0785160727,"Lower Bound":-334.7094432821,"Upper Bound":908.6836388371},{"Date":1708041600000,"Forecast":411.8360397968,"Lower Bound":-164.7227252096,"Upper Bound":1025.876746161},{"Date":1708128000000,"Forecast":371.3121457841,"Lower Bound":-187.9836757006,"Upper Bound":997.0043880993},{"Date":1708214400000,"Forecast":362.6456482148,"Lower Bound":-240.9344709,"Upper Bound":961.0531217313},{"Date":1708300800000,"Forecast":374.6831812468,"Lower Bound":-248.9254337441,"Upper Bound":982.5632147402},{"Date":1708387200000,"Forecast":412.545314612,"Lower Bound":-190.2549148079,"Upper Bound":1016.6760873043},{"Date":1708473600000,"Forecast":330.9876337777,"Lower Bound":-286.6663709473,"Upper Bound":912.8711386455},{"Date":1708560000000,"Forecast":286.1370842823,"Lower Bound":-330.6579478586,"Upper Bound":867.0496685418},{"Date":1708646400000,"Forecast":407.8949489732,"Lower Bound":-129.7930311376,"Upper Bound":1034.6119563396},{"Date":1708732800000,"Forecast":368.9475043491,"Lower Bound":-237.6100580018,"Upper Bound":971.4031587822},{"Date":1708819200000,"Forecast":361.8574561686,"Lower Bound":-213.8168721895,"Upper Bound":981.119604707},{"Date":1708905600000,"Forecast":375.4714385895,"Lower Bound":-207.2181346066,"Upper Bound":995.6797435855},{"Date":1708992000000,"Forecast":414.9100213435,"Lower Bound":-212.3786933079,"Upper Bound":991.2588415792},{"Date":1709078400000,"Forecast":334.9287898984,"Lower Bound":-254.1488413329,"Upper Bound":938.2070051076},{"Date":1709164800000,"Forecast":291.6546897912,"Lower Bound":-335.2803016694,"Upper Bound":882.5695948332},{"Date":1709251200000,"Forecast":414.9890038709,"Lower Bound":-189.6807498896,"Upper Bound":1053.9607018005},{"Date":1709337600000,"Forecast":376.0415592469,"Lower Bound":-203.851907229,"Upper Bound":980.5600366836},{"Date":1709424000000,"Forecast":368.9515150511,"Lower Bound":-244.4639462249,"Upper Bound":961.5677685777},{"Date":1709510400000,"Forecast":382.5655014568,"Lower Bound":-236.2769361035,"Upper Bound":964.9673204582},{"Date":1709596800000,"Forecast":422.0040881955,"Lower Bound":-149.5160715493,"Upper Bound":1070.7921210789},{"Date":1709683200000,"Forecast":342.0228607356,"Lower Bound":-276.234172407,"Upper Bound":936.2475080465},{"Date":1709769600000,"Forecast":298.7487646129,"Lower Bound":-324.9158246231,"Upper Bound":885.9770517142},{"Date":1709856000000,"Forecast":422.0830826778,"Lower Bound":-198.7392973051,"Upper Bound":1043.7037450266},{"Date":1709942400000,"Forecast":383.1356420385,"Lower Bound":-208.8727293807,"Upper Bound":997.6977483118},{"Date":1710028800000,"Forecast":376.0455978428,"Lower Bound":-226.9432382271,"Upper Bound":922.993692888},{"Date":1710115200000,"Forecast":389.6595764774,"Lower Bound":-217.9733110439,"Upper Bound":989.2067559158},{"Date":1710201600000,"Forecast":429.0981554451,"Lower Bound":-175.0305445417,"Upper Bound":1015.9936155242},{"Date":1710288000000,"Forecast":349.1169202139,"Lower Bound":-255.3386793691,"Upper Bound":919.0191394146},{"Date":1710374400000,"Forecast":305.8428163204,"Lower Bound":-314.9382085095,"Upper Bound":915.7487439043},{"Date":1710460800000,"Forecast":429.1771266143,"Lower Bound":-175.0869443263,"Upper Bound":1026.3563647726},{"Date":1710547200000,"Forecast":390.229678204,"Lower Bound":-203.5888267022,"Upper Bound":976.1846253177},{"Date":1710633600000,"Forecast":383.1396262371,"Lower Bound":-161.3912177918,"Upper Bound":983.0919753067},{"Date":1710720000000,"Forecast":396.7535901121,"Lower Bound":-268.3436343135,"Upper Bound":977.4759184942},{"Date":1710806400000,"Forecast":436.1921543204,"Lower Bound":-181.4633692786,"Upper Bound":1064.4858297166},{"Date":1710892800000,"Forecast":356.2109043295,"Lower Bound":-227.583004612,"Upper Bound":986.8810265861},{"Date":1710979200000,"Forecast":312.9367856767,"Lower Bound":-269.0064914549,"Upper Bound":882.2664860824},{"Date":1711065600000,"Forecast":436.2710812109,"Lower Bound":-149.6234082493,"Upper Bound":1009.0970732976},{"Date":1711152000000,"Forecast":397.3236180411,"Lower Bound":-175.8410486533,"Upper Bound":994.1819037955},{"Date":1711238400000,"Forecast":390.2335513146,"Lower Bound":-256.8703826431,"Upper Bound":1008.774765222},{"Date":1711324800000,"Forecast":403.8475151896,"Lower Bound":-178.0848483222,"Upper Bound":1007.1431481039},{"Date":1711411200000,"Forecast":443.2860545761,"Lower Bound":-168.9796262425,"Upper Bound":1016.6741769217},{"Date":1711497600000,"Forecast":363.3047797634,"Lower Bound":-245.3111807925,"Upper Bound":948.5268835186},{"Date":1711584000000,"Forecast":320.0306362888,"Lower Bound":-299.4099822154,"Upper Bound":931.892538334},{"Date":1711670400000,"Forecast":443.3649070012,"Lower Bound":-177.4146063923,"Upper Bound":1026.9653453674},{"Date":1711756800000,"Forecast":404.4174190099,"Lower Bound":-207.1625819146,"Upper Bound":1009.9482259548},{"Date":1711843200000,"Forecast":397.3273274617,"Lower Bound":-217.0308258559,"Upper Bound":984.25767945},{"Date":1711929600000,"Forecast":410.9412665149,"Lower Bound":-165.9924351563,"Upper Bound":1039.6721289203},{"Date":1712016000000,"Forecast":450.3798059014,"Lower Bound":-201.5460340764,"Upper Bound":1048.776784954},{"Date":1712102400000,"Forecast":370.3985317056,"Lower Bound":-245.1723402185,"Upper Bound":984.2041000898},{"Date":1712188800000,"Forecast":327.1243888478,"Lower Bound":-290.6787691616,"Upper Bound":941.166432059},{"Date":1712275200000,"Forecast":450.4586601768,"Lower Bound":-113.4133837826,"Upper Bound":1030.4643535352},{"Date":1712361600000,"Forecast":411.5111728021,"Lower Bound":-161.3970914562,"Upper Bound":998.1818335288},{"Date":1712448000000,"Forecast":404.4210818707,"Lower Bound":-212.1530949249,"Upper Bound":980.6917125472},{"Date":1712534400000,"Forecast":418.0350215409,"Lower Bound":-187.3402541041,"Upper Bound":1019.8168272186},{"Date":1712620800000,"Forecast":457.4735615439,"Lower Bound":-147.5277413892,"Upper Bound":1079.5819156527},{"Date":1712707200000,"Forecast":373.3038286319,"Lower Bound":-223.3974374456,"Upper Bound":985.3305147227},{"Date":1712793600000,"Forecast":325.8412270577,"Lower Bound":-267.3713122547,"Upper Bound":942.7657809313},{"Date":1712880000000,"Forecast":444.9870396703,"Lower Bound":-110.4528289674,"Upper Bound":1108.2763220119},{"Date":1712966400000,"Forecast":401.8510935791,"Lower Bound":-216.3865932241,"Upper Bound":960.3976451139
//  }]
//  // Convert JSON data into chart-friendly format
//  const forecastLabels = json_data.map(entry => 
//   new Date(entry.Date).toLocaleDateString() // Convert timestamp to readable date
// );

// const forecastValues = json_data.map(entry => entry.Forecast);
// const lowerBoundValues = json_data.map(entry => entry["Lower Bound"]);
// const upperBoundValues = json_data.map(entry => entry["Upper Bound"]);
// // Update state with graph data
// setForecastData({
//   labels: forecastLabels,
//   datasets: [
//     {
//       label: "Forecast",
//       data: forecastValues,
//       borderColor: "blue",
//       backgroundColor: "rgba(0, 0, 255, 0.2)",
//       fill: false,
//       tension: 0.3,
//     },
//     {
//       label: "Lower Bound",
//       data: lowerBoundValues,
//       borderColor: "red",
//       backgroundColor: "rgba(255, 0, 0, 0.2)",
//       fill: false,
//       borderDash: [5, 5],
//       tension: 0.3,
//     },
//     {
//       label: "Upper Bound",
//       data: upperBoundValues,
//       borderColor: "green",
//       backgroundColor: "rgba(0, 255, 0, 0.2)",
//       fill: false,
//       borderDash: [5, 5],
//       tension: 0.3,
//     }
//   ]
// });
// SetDisplayGraph(true);
  console.log("handleGenerate requested");
  setLoading(true);
  setError(""); // Reset error message before fetching

  try {
    const res = await axios.post("http://localhost:5000/SalesSummariser");

    // if (!res.data) {
    //   throw new Error("Server response is empty. Please try again.");
    // }

    // console.log(res.data);

    const { summary, json_data } = res.data;

    // Check if summary or json_data is missing OR empty
    // console.log(summary, json_data)
    // const { summary, json_data } = data1;
    if (
     // summary is empty or missing
      !json_data || Object.keys(json_data).length === 0 // json_data is empty object `{}` or missing
    ) {
      throw new Error("Received empty data. Please try again later.");
    }

    setTimeout(() => {
      setSummary(summary);
      setsalesResponse(json_data);
      setLoading(false);
    }, 1000);

  } catch (error) {
    console.error("Error fetching response:", error.message);
    setError(error.message); // Set error message for UI
  } finally {
    setLoading(false);
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
                          <span>
                            <strong>To: Customer{notification.id}</strong>, {notification.text}
                          </span>
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
          <div className="card text-center">
                      <div className="card-header">
                      📊 Report Generation
                      </div>
                      <div className="card-body">
          {displayGraph ? (
            <>

            {/* <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Weekly Sales Performance</h5>
                </div>
                <div className="card-body">
                <Line
    data={forecastData}
    options={{
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Sales Forecast Over Time", // Chart Title
          font: {
            size: 16,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date", // X-axis Label
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        y: {
          title: {
            display: true,
            text: "Sales Qty.", // Y-axis Label
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
      },
    }}
  />
                </div>
              </div> */}
            
  
            <div className="row mb-4">
            <div className="col-md-8">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Weekly Sales Performance</h5>
                </div>
                <div className="card-body">
                <Bar data={weeklySalesData} />

                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Monthly Sales Performance</h5>
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
                  <h5 className="card-title m-0">Yearly Sales Performance</h5>
                </div>
                <div className="card-body">
                <Bar data={yearlySalesData} />

                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Sales By Region</h5>
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
                textAlign: "justify",
                // maxWidth: "800px", 
                background: "#fff", 
                padding: "20px", 
                borderRadius: "10px", 
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", 
                lineHeight: "1.6", 
                whiteSpace: "pre-wrap" 

              }}
            >
              <button onClick={()=> generatePDF()} style={{ marginTop: "10px" }} ype="button" class="btn btn-outline-secondary mb-2"><i className="bi bi-download"/> Download PDF</button>
              

              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>



          </>
          ) : (<>
                    {error && <div className="alert alert-danger">{error}</div>}

                     {loading ? (
                      <div className="spinner-grow" role="status">
                      </div>
                    ): (
                     <>
                        <h5 className="card-title">Generate Sales Report</h5>
                        <p className="card-text"> Click the button below to generate a detailed sales report with trends and insights.</p>
                        <button className="btn btn-primary d-flex align-items-center gap-2 mx-auto" onClick={handleGenerate}>
                          <i className="bi bi-file-earmark-bar-graph"></i> Generate Report
                        </button>  
                     </>

                    // <div className="spinner-grow" role="status">
                    //   </div>
                    )}
                   
                   

          </>)}
          </div>
          </div>
          

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
              <div className="card shadow p-0" style={{ width: '550px',     height: "700px" }}>
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
                         <ReactMarkdown 
    remarkPlugins={[remarkGfm]}
    components={{
      // Paragraph Styling
      p: ({ children }) => (
        <p style={{
          marginBottom: "10px",
          lineHeight: "1.5"
        }}>
          {children}
        </p>
      ),

      // Table Styling
      table: ({ children }) => (
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
          backgroundColor: "#fff",
          border: "1px solid #ddd"
        }}>
          {children}
        </table>
      ),
      th: ({ children }) => (
        <th style={{
          backgroundColor: "#f4f4f4",
          border: "1px solid #ddd",
          padding: "8px",
          textAlign: "left"
        }}>
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td style={{
          border: "1px solid #ddd",
          padding: "8px"
        }}>
          {children}
        </td>
      ),
      tr: ({ children }) => (
        <tr style={{
          borderBottom: "1px solid #ddd"
        }}>
          {children}
        </tr>
      )
    }}
  >
    {message.text}
  </ReactMarkdown> 
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