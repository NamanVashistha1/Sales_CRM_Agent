import React, { useState, useEffect } from 'react';
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

  // Sample data for charts
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales 2025',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Sales 2024',
        data: [45, 49, 60, 71, 46, 45],
        fill: false,
        borderColor: '#742774',
        tension: 0.1,
      }
    ],
  };

  const leadSourceData = {
    labels: ['Website', 'Referral', 'Social Media', 'Email', 'Other'],
    datasets: [
      {
        label: 'Lead Source',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const taskCompletionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [22, 19, 30, 24, 28, 25],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Pending Tasks',
        data: [12, 9, 13, 5, 12, 3],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  // Handler for sending messages in the chat
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    // Add user message
    const userMessageId = messages.length + 1;
    setMessages([...messages, { id: userMessageId, text: newMessage, sender: "user" }]);
    setNewMessage("");
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I can help you with that! What specific information do you need?",
        "Let me check our database for that information.",
        "Based on recent data, your sales have increased by 15% this quarter.",
        "Would you like me to generate a report on that?",
        "I'm analyzing your customer retention metrics now. They look positive!",
        "Is there anything else you'd like to know about your CRM data?"
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setMessages(prevMessages => [...prevMessages, { 
        id: prevMessages.length + 1, 
        text: randomResponse, 
        sender: "bot" 
      }]);
    }, 1000);
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
                            {!notification.isRead && <span className="badge bg-primary">New</span>}
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
          <div className="row mb-4">
            <div className="col-md-8">
              <div className="card h-100">
                <div className="card-header bg-white">
                  <h5 className="card-title m-0">Sales Performance</h5>
                </div>
                <div className="card-body">
                  <Line data={salesData} />
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
                    <Pie data={leadSourceData} />
                  </div>
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
                  <Bar data={taskCompletionData} />
                </div>
              </div>
            </div>
          </div>

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
                      <button className="btn btn-primary" type="submit">
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