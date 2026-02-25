const { v4: uuidv4 } = require('uuid');

const residents = [
  {
    id: "res_001",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@email.com",
    password: "resident123",
    phone: "512-555-0142",
    ssn: "423-55-6789",
    dateOfBirth: "1988-03-15",
    address: "4521 Riverside Dr, Apt 204, Austin, TX 78741",
    unitNumber: "204",
    propertyId: "prop_lakeside",
    moveInDate: "2023-06-01",
    leaseEnd: "2026-05-31",
    points: 15750,
    tier: "Gold",
    paymentMethod: {
      type: "credit_card",
      last4: "4242",
      cardNumber: "4242424242424242",
      expiry: "12/27",
      cvv: "123"
    },
    emergencyContact: {
      name: "Carlos Garcia",
      phone: "512-555-0198",
      relationship: "Brother"
    }
  },
  {
    id: "res_002",
    firstName: "James",
    lastName: "Wilson",
    email: "jwilson@email.com",
    password: "james2024",
    phone: "512-555-0267",
    ssn: "587-22-4431",
    dateOfBirth: "1975-11-22",
    address: "4521 Riverside Dr, Apt 310, Austin, TX 78741",
    unitNumber: "310",
    propertyId: "prop_lakeside",
    moveInDate: "2022-01-15",
    leaseEnd: "2026-01-14",
    points: 32400,
    tier: "Platinum",
    paymentMethod: {
      type: "credit_card",
      last4: "8910",
      cardNumber: "5555555555558910",
      expiry: "08/26",
      cvv: "456"
    },
    emergencyContact: {
      name: "Sarah Wilson",
      phone: "512-555-0301",
      relationship: "Spouse"
    }
  },
  {
    id: "res_003",
    firstName: "Aisha",
    lastName: "Patel",
    email: "aisha.p@email.com",
    password: "password1",
    phone: "512-555-0389",
    ssn: "612-88-3345",
    dateOfBirth: "1995-07-08",
    address: "4521 Riverside Dr, Apt 118, Austin, TX 78741",
    unitNumber: "118",
    propertyId: "prop_lakeside",
    moveInDate: "2024-09-01",
    leaseEnd: "2025-08-31",
    points: 4200,
    tier: "Silver",
    paymentMethod: {
      type: "bank_account",
      last4: "7654",
      routingNumber: "021000021",
      accountNumber: "123456789012"
    },
    emergencyContact: {
      name: "Raj Patel",
      phone: "512-555-0412",
      relationship: "Father"
    }
  }
];

const giftCards = [
  { id: "gc_001", name: "Amazon", description: "Amazon.com Gift Card", pointsCost: 5000, dollarValue: 50, image: "/images/amazon.png", inStock: true },
  { id: "gc_002", name: "Starbucks", description: "Starbucks Gift Card", pointsCost: 2500, dollarValue: 25, image: "/images/starbucks.png", inStock: true },
  { id: "gc_003", name: "Target", description: "Target Gift Card", pointsCost: 5000, dollarValue: 50, image: "/images/target.png", inStock: true },
  { id: "gc_004", name: "Uber Eats", description: "Uber Eats Gift Card", pointsCost: 1500, dollarValue: 15, image: "/images/ubereats.png", inStock: true },
  { id: "gc_005", name: "Netflix", description: "Netflix Gift Card", pointsCost: 3000, dollarValue: 30, image: "/images/netflix.png", inStock: false },
  { id: "gc_006", name: "Visa Prepaid", description: "Visa Prepaid Card", pointsCost: 10000, dollarValue: 100, image: "/images/visa.png", inStock: true },
  { id: "gc_007", name: "Home Depot", description: "Home Depot Gift Card", pointsCost: 5000, dollarValue: 50, image: "/images/homedepot.png", inStock: true },
  { id: "gc_008", name: "DoorDash", description: "DoorDash Gift Card", pointsCost: 2000, dollarValue: 20, image: "/images/doordash.png", inStock: true },
];

const transactions = [
  { id: "txn_001", residentId: "res_001", type: "earn", points: 500, description: "On-time rent payment - March 2025", date: "2025-03-01T00:00:00Z", balanceAfter: 15750 },
  { id: "txn_002", residentId: "res_001", type: "earn", points: 200, description: "Lease renewal bonus", date: "2025-02-15T00:00:00Z", balanceAfter: 15250 },
  { id: "txn_003", residentId: "res_001", type: "redeem", points: -2500, description: "Redeemed: Starbucks $25", date: "2025-02-10T00:00:00Z", balanceAfter: 15050 },
  { id: "txn_004", residentId: "res_001", type: "earn", points: 500, description: "On-time rent payment - February 2025", date: "2025-02-01T00:00:00Z", balanceAfter: 17550 },
  { id: "txn_005", residentId: "res_001", type: "earn", points: 1000, description: "Referral bonus - new resident", date: "2025-01-20T00:00:00Z", balanceAfter: 17050 },
  { id: "txn_006", residentId: "res_002", type: "earn", points: 500, description: "On-time rent payment - March 2025", date: "2025-03-01T00:00:00Z", balanceAfter: 32400 },
  { id: "txn_007", residentId: "res_002", type: "redeem", points: -10000, description: "Redeemed: Visa Prepaid $100", date: "2025-02-28T00:00:00Z", balanceAfter: 31900 },
  { id: "txn_008", residentId: "res_002", type: "earn", points: 500, description: "On-time rent payment - February 2025", date: "2025-02-01T00:00:00Z", balanceAfter: 41900 },
  { id: "txn_009", residentId: "res_003", type: "earn", points: 500, description: "On-time rent payment - March 2025", date: "2025-03-01T00:00:00Z", balanceAfter: 4200 },
  { id: "txn_010", residentId: "res_003", type: "earn", points: 200, description: "Community event attendance", date: "2025-02-20T00:00:00Z", balanceAfter: 3700 },
];

const adminUsers = [
  {
    id: "admin_001",
    email: "admin@casaperks.com",
    password: "admin123!",
    role: "super_admin",
    name: "System Admin"
  },
  {
    id: "admin_002",
    email: "manager@casaperks.com",
    password: "manager2024",
    role: "property_manager",
    name: "Property Manager"
  }
];

module.exports = { residents, giftCards, transactions, adminUsers };
