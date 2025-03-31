# EezyLiving Admin Panel

The **EezyLiving Admin Panel** is a secure interface for administrators to manage accommodations, bookings, and user information for the EezyLiving hotel booking application. This panel provides functionality to add, update, and manage accommodations and reservations.

## Deployed app
Click here to use and explore the app: https://eezyliving-admin-3.onrender.com

## Features

## Screenshot
![hotelAdmin](https://github.com/user-attachments/assets/bee08c6f-0caa-4141-8573-45932c06e63d)
![Image](https://github.com/user-attachments/assets/ff4f5c89-1b6e-4057-9126-ba642bcaefc9)
![Image](https://github.com/user-attachments/assets/3a2ff0c4-c479-47f9-98c4-738c4947e169)


### Admin Functionality

1. **Admin Authentication**
   - Secure login for administrators using Firebase Authentication.

2. **Accommodation Management**
   - **Add New Accommodations**: Admins can add new accommodations, including:
     - Room type
     - Capacity
     - Price
     - Availability
   - **Update Existing Accommodations**: Modify details such as:
     - Room availability
     - Pricing
     - Descriptions
   - **Delete Accommodations**: Remove accommodations from the system.

3. **Reservation Management**
   - **View Reservations**: Access detailed information about reservations, including:
     - Check-in and check-out dates
     - Guest details
     - Room details
   - **Manage Reservations**: Admins can:
     - Approve, modify, or cancel reservations.

4. **User Management**
   - Admins can view user profiles related to bookings and manage user data as needed.

---

## Technologies

- **Frontend**: ReactJS, Material-UI for UI/UX
- **Backend**: Firebase Firestore (for data storage), Firebase Authentication
- **State Management**: Redux Toolkit

---

## Installation

### Prerequisites

- Node.js
- Firebase account (for Authentication and Firestore)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/sphllzulu/eezyLiving-Admin.git
   cd eezyliving-admin


2. Install Dependancies:

   ```bash
   npm install
   ```

3. Start the project:

   ```bash
    npm run dev     
   ```

