# File2URL - From Files to Links, Simplifying Transfers

**File2URL** is a web application that allows users to upload images, convert them into PDFs, and generate unique links for easy sharing. Users can also view a preview of their PDF before finalizing the conversion, and keep track of their conversion history. The app supports OTP-based authentication for secure and seamless user access.

---

## Features

- **Image to PDF Conversion**: Upload images and convert them into a downloadable PDF file.
- **Unique Link Generation**: Generate a unique, shareable link for each converted PDF.
- **Preview Option**: Preview your PDF before finalizing the conversion or sharing.
- **History**: Keep track of all your previous conversions (for logged-in users).
- **OTP Authentication**: Secure login system using One-Time Password (OTP) sent to your email.
- **Easy Image Upload**: Users can upload multiple images for quick PDF creation.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Authentication](#authentication)
6. [Features Breakdown](#features-breakdown)
7. [Contributing](#contributing)
8. [License](#license)

---

## Getting Started

To get started with **File2URL**, follow the steps below to set up the project on your local machine or deploy it to a server.

---

## Prerequisites

Before starting, ensure that you have the following software installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- A **web browser** to access the app

---

## Installation

### 1. Clone the Repository

Clone the project to your local machine using the following Git command:

git clone https://github.com/yourusername/file2url.git

### 2. Navigate to the Project Directory

Go into the project directory:

cd file2url

### 3. Install Required Dependencies

Install all the necessary dependencies:

npm install

### 4. Start the Development Server

Launch the development server:

npm run dev

Now open your web browser and go to:

http://localhost:3000

You can now start using the **File2URL** application.

---

## Usage

Once the app is running, you can:

### 1. **Upload Images**
- Click on the "Upload" button to select and upload images from your device. You can upload multiple images at once.

### 2. **Preview PDF**
- After uploading, the app will automatically generate a preview of your PDF file. Review the PDF to ensure everything looks correct.

### 3. **Generate Unique Link**
- Once satisfied with the preview, click the "Generate Link" button to create a unique URL for your PDF. You can share this link with others for easy access.

### 4. **Share the Link**
- Copy the unique link and share it with anyone you want to access your PDF.

### 5. **Access History**
- If you're logged in, you can access your conversion history and revisit any previously generated PDF links.

---

## Authentication

### OTP-Based Login

**Sign Up / Sign In**:  
Users can create an account or log in using an OTP (One-Time Password) that will be sent to their registered email address.

**OTP Verification**:  
Once you enter the OTP, the system will authenticate and grant you access.

**Secure Authentication**:  
OTPs are valid for a limited time, providing a secure and efficient login process.

---

## Features Breakdown

### 1. **Image Upload & PDF Creation**
- Upload multiple images (JPEG, PNG, etc.) and the app will automatically convert them into a PDF.

### 2. **Unique Link Generation**
- After conversion, a unique link will be created for your PDF, making it easy to share with others.

### 3. **PDF Preview**
- Preview your PDF before generating a shareable link, ensuring everything looks great.

### 4. **History for Logged-in Users**
- Logged-in users can view their previous PDF conversions and links in a history section, making it easy to manage and access past files.

### 5. **OTP-Based Authentication**
- Users receive an OTP via email to log in securely, ensuring user privacy and data security.

---

## Contributing

We welcome contributions to make **File2URL** even better! Here's how you can get involved:

1. **Fork the repository** to your own GitHub account:
   git fork (https://github.com/AashishKumarSingh1/File2Url)

2. **Create a new branch** for your feature:
   git checkout -b feature/your-feature

3. **Make your changes** and commit them:
   git commit -am 'Add new feature'

4. **Push the changes** to your forked repository:
   git push origin feature/your-feature


5. **Create a pull request** to the main repository from your branch.

---

## License

This project is licensed under the **MIT License**.

---

## Acknowledgments

- Thanks to [Nodemailer](https://nodemailer.com/) for handling OTP email delivery.
- Inspired by simple yet powerful file-sharing tools that prioritize security and ease of use.

---

**File2URL** makes it simple and secure to convert images into PDFs and share them with unique, customizable links. Get started today and enjoy hassle-free file sharing!" 
