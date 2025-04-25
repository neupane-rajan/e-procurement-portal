// Mock data for e-procurement portal with Indian company names

// User data
export const users = [
    {
      id: 1,
      name: "Rajan Neupane",
      email: "rajan.neupane@example.com",
      role: "admin",
      department: "Procurement"
    },
    {
      id: 2,
      name: "Vikram Sharma",
      email: "vikram.sharma@example.com",
      role: "manager",
      department: "Finance"
    },
    {
      id: 3,
      name: "Priya Patel",
      email: "priya.patel@example.com",
      role: "user",
      department: "IT"
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      role: "user",
      department: "Operations"
    },
    {
      id: 5,
      name: "Ananya Singh",
      email: "ananya.singh@example.com",
      role: "manager",
      department: "Logistics"
    }
  ];
  
  // Vendor data with Indian companies
  export const vendors = [
    {
      id: 1,
      name: "Reliance Industries",
      category: "Conglomerate",
      contactPerson: "Mukesh Ambani",
      email: "m.ambani@reliance.com",
      phone: "+91 22 3555 5000",
      address: "Maker Chambers IV, Nariman Point, Mumbai",
      status: "active",
      rating: 4.9,
      totalOrders: 127
    },
    {
      id: 2,
      name: "Tata Consultancy Services",
      category: "IT Services",
      contactPerson: "N. Chandrasekaran",
      email: "chandra@tcs.com",
      phone: "+91 22 6778 9999",
      address: "9th Floor, Nirmal Building, Nariman Point, Mumbai",
      status: "active",
      rating: 4.8,
      totalOrders: 93
    },
    {
      id: 3,
      name: "Infosys Limited",
      category: "IT Services",
      contactPerson: "Salil Parekh",
      email: "salil@infosys.com",
      phone: "+91 80 2852 0261",
      address: "Electronics City, Hosur Road, Bangalore",
      status: "active",
      rating: 4.7,
      totalOrders: 85
    },
    {
      id: 4,
      name: "Bharti Airtel",
      category: "Telecommunications",
      contactPerson: "Sunil Mittal",
      email: "sunil@airtel.com",
      phone: "+91 11 4666 6100",
      address: "Bharti Crescent, Nelson Mandela Road, New Delhi",
      status: "active",
      rating: 4.5,
      totalOrders: 72
    },
    {
      id: 5,
      name: "Mahindra & Mahindra",
      category: "Automotive",
      contactPerson: "Anand Mahindra",
      email: "anand@mahindra.com",
      phone: "+91 22 2490 1441",
      address: "Gateway Building, Apollo Bunder, Mumbai",
      status: "active",
      rating: 4.6,
      totalOrders: 68
    },
    {
      id: 6,
      name: "Wipro Limited",
      category: "IT Services",
      contactPerson: "Thierry Delaporte",
      email: "thierry@wipro.com",
      phone: "+91 80 2844 0011",
      address: "Doddakannelli, Sarjapur Road, Bangalore",
      status: "active",
      rating: 4.5,
      totalOrders: 64
    },
    {
      id: 7,
      name: "Larsen & Toubro",
      category: "Engineering",
      contactPerson: "S.N. Subrahmanyan",
      email: "sns@larsentoubro.com",
      phone: "+91 22 6752 5656",
      address: "L&T House, Ballard Estate, Mumbai",
      status: "active",
      rating: 4.7,
      totalOrders: 59
    },
    {
      id: 8,
      name: "Adani Group",
      category: "Infrastructure",
      contactPerson: "Gautam Adani",
      email: "gautam@adani.com",
      phone: "+91 79 2555 5555",
      address: "Adani House, Near Mithakhali Circle, Ahmedabad",
      status: "pending",
      rating: 4.4,
      totalOrders: 45
    },
    {
      id: 9,
      name: "HDFC Bank",
      category: "Banking",
      contactPerson: "Sashidhar Jagdishan",
      email: "sashidhar@hdfcbank.com",
      phone: "+91 22 3395 8000",
      address: "HDFC Bank House, Senapati Bapat Marg, Mumbai",
      status: "active",
      rating: 4.8,
      totalOrders: 56
    },
    {
      id: 10,
      name: "Bajaj Auto",
      category: "Automotive",
      contactPerson: "Rajiv Bajaj",
      email: "rajiv@bajajauto.com",
      phone: "+91 20 6610 6000",
      address: "Mumbai-Pune Road, Akurdi, Pune",
      status: "inactive",
      rating: 4.3,
      totalOrders: 38
    },
    {
      id: 11,
      name: "HCL Technologies",
      category: "IT Services",
      contactPerson: "C Vijayakumar",
      email: "cvk@hcl.com",
      phone: "+91 120 6125 000",
      address: "Plot No. 3A, Sector 126, Noida",
      status: "active",
      rating: 4.6,
      totalOrders: 71
    },
    {
      id: 12,
      name: "Asian Paints",
      category: "Manufacturing",
      contactPerson: "Amit Syngle",
      email: "amit@asianpaints.com",
      phone: "+91 22 6212 1000",
      address: "6A Shantinagar, Santacruz East, Mumbai",
      status: "active",
      rating: 4.5,
      totalOrders: 52
    }
  ];
  
  // Requisition data
  export const requisitions = [
    {
      id: 1001,
      title: "IT Infrastructure Upgrade",
      department: "IT",
      requestedBy: 3,
      dateRequested: "2025-04-10T09:32:15Z",
      status: "approved",
      priority: "high",
      totalAmount: 1250000.00,
      items: [
        { name: "Server Infrastructure", quantity: 5, unitPrice: 185000.00 },
        { name: "Networking Equipment", quantity: 10, unitPrice: 35000.00 }
      ]
    },
    {
      id: 1002,
      title: "Office Supplies - Q2",
      department: "Operations",
      requestedBy: 4,
      dateRequested: "2025-04-15T11:20:45Z",
      status: "pending",
      priority: "medium",
      totalAmount: 234050.00,
      items: [
        { name: "Printer Paper", quantity: 500, unitPrice: 250.00 },
        { name: "Ink Cartridges", quantity: 50, unitPrice: 1200.00 },
        { name: "Office Stationery", quantity: 100, unitPrice: 850.00 }
      ]
    },
    {
      id: 1003,
      title: "Conference Room Renovation",
      department: "Facilities",
      requestedBy: 5,
      dateRequested: "2025-04-08T15:45:22Z",
      status: "rejected",
      priority: "low",
      totalAmount: 875000.00,
      items: [
        { name: "Conference Tables", quantity: 5, unitPrice: 45000.00 },
        { name: "Executive Chairs", quantity: 30, unitPrice: 15000.00 },
        { name: "AV Equipment", quantity: 5, unitPrice: 65000.00 }
      ]
    }
  ];
  
  // Inventory items
  export const inventoryItems = [
    {
      id: 101,
      name: "HP ProBook Laptops",
      category: "IT Equipment",
      location: "IT Storage",
      quantity: 25,
      unitPrice: 65000.00,
      minimumStock: 10,
      status: "in-stock",
      supplier: 2
    },
    {
      id: 102,
      name: "Dell Monitors 27-inch",
      category: "IT Equipment",
      location: "IT Storage",
      quantity: 42,
      unitPrice: 18000.00,
      minimumStock: 15,
      status: "in-stock",
      supplier: 3
    },
    {
      id: 103,
      name: "A4 Paper Reams",
      category: "Office Supplies",
      location: "Supply Room 1",
      quantity: 320,
      unitPrice: 250.00,
      minimumStock: 100,
      status: "in-stock",
      supplier: 6
    },
    {
      id: 104,
      name: "HP Toner Cartridges",
      category: "Office Supplies",
      location: "Supply Room 1",
      quantity: 8,
      unitPrice: 3500.00,
      minimumStock: 10,
      status: "low-stock",
      supplier: 2
    },
    {
      id: 105,
      name: "Executive Office Chairs",
      category: "Furniture",
      location: "Warehouse B",
      quantity: 0,
      unitPrice: 15000.00,
      minimumStock: 5,
      status: "out-of-stock",
      supplier: 7
    }
  ];
  
  // Reports data
  export const reports = [
    {
      id: 201,
      title: "Monthly Procurement Summary - March 2025",
      type: "procurement",
      format: "PDF",
      dateGenerated: "2025-04-01T08:15:30Z",
      generatedBy: 2,
      size: "2.4 MB"
    },
    {
      id: 202,
      title: "Vendor Performance Q1 2025",
      type: "vendor",
      format: "Excel",
      dateGenerated: "2025-04-05T14:30:20Z",
      generatedBy: 1,
      size: "1.8 MB"
    },
    {
      id: 203,
      title: "Inventory Status Report - April 2025",
      type: "inventory",
      format: "PDF",
      dateGenerated: "2025-04-08T09:22:15Z",
      generatedBy: 4,
      size: "3.1 MB"
    },
    {
      id: 204,
      title: "Budget Variance Analysis - Q1 2025",
      type: "financial",
      format: "Excel",
      dateGenerated: "2025-04-10T11:45:00Z",
      generatedBy: 2,
      size: "1.2 MB"
    }
  ];
  
  // Orders data
  export const orders = [
    {
      id: 5001,
      orderNumber: "PO-2025-5001",
      vendor: 1,
      dateCreated: "2025-04-01T09:30:00Z",
      status: "delivered",
      totalAmount: 1250000.00,
      paymentStatus: "paid",
      items: [
        { name: "Industrial Equipment", quantity: 5, unitPrice: 185000.00 },
        { name: "Petrochemical Products", quantity: 10, unitPrice: 35000.00 }
      ]
    },
    {
      id: 5002,
      orderNumber: "PO-2025-5002",
      vendor: 2,
      dateCreated: "2025-04-03T14:15:22Z",
      status: "in-transit",
      totalAmount: 850000.00,
      paymentStatus: "pending",
      items: [
        { name: "Software Licenses", quantity: 100, unitPrice: 8500.00 }
      ]
    },
    {
      id: 5003,
      orderNumber: "PO-2025-5003",
      vendor: 5,
      dateCreated: "2025-04-05T10:20:15Z",
      status: "processing",
      totalAmount: 3575000.00,
      paymentStatus: "not-paid",
      items: [
        { name: "Commercial Vehicles", quantity: 5, unitPrice: 715000.00 }
      ]
    }
  ];
  
  // Budget data
  export const budgetData = {
    fiscalYear: "2025",
    departments: [
      {
        name: "IT",
        totalBudget: 12500000.00,
        spent: 5432578.00,
        remaining: 7067422.00
      },
      {
        name: "Operations",
        totalBudget: 8500000.00,
        spent: 3762450.00,
        remaining: 4737550.00
      },
      {
        name: "Marketing",
        totalBudget: 6500000.00,
        spent: 3256875.00,
        remaining: 3243125.00
      }
    ]
  };