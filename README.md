# UNCC Student Marketplace

## Overview

Welcome to the UNCC Student Marketplace, an exclusive online marketplace designed for students at the University of North Carolina at Charlotte (UNCC). This platform allows students to buy, sell, and trade items within the university community.

## Features

- **User Authentication:** Secure login and sign-up for UNCC students using their university email.
- **Profile Management:** Users can create and manage their profiles.
- **Browse Items:** Easily browse through item listings with advanced search and filter options.
- **Direct Messaging:** Communicate directly with other users through the platform.
- **Create Item Listings:** Post items for sale with detailed descriptions and images.
- **Backend Database:** Robust database to store user and product information, with efficient data retrieval using tags.
- **Recommended Pricing:** Suggests prices for sellers based on similar products.

## Tech Stack

- **Frontend:** Next.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** University email verification

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/uncc-student-marketplace.git
   ```
2. Navigate to the project directory:
   ```bash
   cd uncc-student-marketplace
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Setup environmental variable:

- Create a .env file in the root directory.
- Add your MongoDB URI

5. Run the development server:

```bash
 npm run dev
```

6. View development server:

- Navigate to http://localhost:3000/

## Progress

We are currently in the planning phase of Sprint 2

Backlog:
1. Profile page should include listings created by user.
2. Update and delete functionalities should work on user listings.
3. User uploaded listings should allow images.
4. Product browsing should include tag based searching.
5. Product browsing should include filter options (price, condition, date created, alphabetical, etc).
