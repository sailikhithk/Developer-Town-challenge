# Developer-Town-challenge

# Star Wars BFF (Backend for Frontend) Project

## Project Requirements Checklist

Based on what i understood, i have made a requirement checklist so that i can complete 100% of work

- [x] Backend using Python (Flask)
- [x] Frontend web application (React + TypeScript + Vite)
- [x] View a list of Starships in a `<table>`
- [x] Select Starship `manufacturer` from a `<select>` list
- [x] Filter Starships by selected `manufacturer`
- [x] Display all Starships if no `manufacturer` is selected
- [x] Implement authentication (Token-based auth using DynamoDB for production, local storage for development)
- [x] Prepare for serverless AWS technologies (API Gateway, Lambda)
- [x] Backend responds with JSON data
- [x] Do not use Star Wars API client libraries
- [x] Implement as a Backend for Frontend (BFF) pattern
- [x] Type-safe frontend using TypeScript
- [x] CORS support for local development
- [x] Environment variable support for configuration
- [x] Improved login screen with better UI
- [x] Added signup functionality
- [x] Implement routing for login, signup, and dashboard pages

## Detailed Implementation Checklist

- [x] Backend using Python (Flask)
  - [x] Set up Flask application structure
  - [x] Implement CORS support for local development
  - [x] Create endpoints for login, signup, starships, and manufacturers
  - [x] Implement token-based authentication
  - [x] Use environment variables for configuration
  - [x] Implement in-memory storage for local development
  - [ ] Prepare for serverless deployment (Lambda function handler)

- [x] Frontend web application (React + TypeScript + Vite)
  - [x] Set up project with Vite and TypeScript
  - [x] Implement React components for Login, Signup, and Dashboard
  - [x] Use React Router for navigation between pages
  - [x] Integrate Chakra UI for improved styling and layout

- [x] Authentication Features
  - [x] Implement login functionality
  - [x] Add signup functionality
  - [x] Store authentication token in local storage
  - [x] Protect routes that require authentication

- [x] Starships Display and Filtering
  - [x] Fetch and display list of Starships in a table
  - [x] Implement manufacturer dropdown for filtering
  - [x] Filter Starships by selected manufacturer
  - [x] Show all Starships when no manufacturer is selected

- [x] UI/UX Improvements
  - [x] Center Login and Signup forms on the page
  - [x] Make Login and Signup pages consistent in layout and styling
  - [x] Implement responsive design for Dashboard
  - [x] Add error handling and display for login/signup failures

- [x] API Integration
  - [x] Set up Axios for API calls
  - [x] Implement API calls for login, signup, starships, and manufacturers
  - [x] Handle API errors and display appropriate messages

- [x] Environment Configuration
  - [x] Set up .env files for both frontend and backend
  - [x] Use environment variables for API URL and other configurations

- [x] CORS and Security
  - [x] Implement CORS handling in the backend
  - [x] Set up proper CORS configuration for development and production

- [x] Code Organization and Best Practices
  - [x] Organize components into separate files
  - [x] Use TypeScript for type safety
  - [x] Implement proper error handling and logging

- [ ] Preparation for AWS Deployment
  - [ ] Create Lambda function handler (lambda.py)
  - [ ] Prepare backend for DynamoDB integration (for production use)
  - [ ] Set up build process for frontend deployment to S3

## Additional Considerations and Future Improvements (If time permits)

- [x] Implement caching for SWAPI requests to improve performance
- [ ] Enhance security with JWT implementation
- [ ] Add comprehensive unit and integration tests
- [ ] Set up CI/CD pipeline for automated testing and deployment
- [ ] Implement logging and monitoring solutions for production
- [ ] Implement pagination for the starships list
- [ ] Further improve responsive design for various device sizes
- [ ] Enhance accessibility features
- [ ] Consider adding state management (e.g., Redux) for scalability
- [ ] Implement user profile management and password reset functionality
- [ ] Add data validation on both frontend and backend
- [ ] Implement rate limiting and other API security measures
- [ ] Optimize API calls and implement request batching where appropriate
- [ ] Add a logout feature and handle token expiration
- [ ] Implement dark mode toggle using Chakra UI's color mode
- [ ] Add loading indicators for asynchronous operations
- [ ] Implement error boundaries for better error handling in React
- [ ] Add tooltips or help text for better user guidance
- [ ] Implement lazy loading for route components to improve initial load time

## Project Structure

```
starwars-bff/
├── backend/
│   ├── venv/
│   ├── app.py
│   ├── lambda.py
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── Login.tsx
    │   ├── Signup.tsx
    │   ├── Dashboard.tsx
    │   └── main.tsx
    ├── .env
    ├── index.html
    ├── package.json
    └── vite.config.ts
```

## Backend Setup (Python + Flask)

a. setup the backend

```bash
mkdir backend
cd backend
python -m venv venv # i want to keep it independent of system's python version
source venv/bin/activate  # On Windows: venv\Scripts\activate
touch app.py .env requirements.txt
pip install -r requirements.txt
```

b. Create a .env file for the backend:

```
AUTH_TABLE_NAME=auth-tokens
AWS_ACCESS_KEY_ID=XXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXX
AWS_DEFAULT_REGION=us-east-1
```

c. Create a requirements.txt file:

```
flask
flask-cors
python-dotenv
requests
boto3
aws-wsgi
```

## Frontend Setup (React + TypeScript + Vite)

a. Set up the frontend:

```bash
cd ..
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install axios react-router-dom @chakra-ui/react @emotion/react @emotion/styled framer-motion
touch .env
```
b. Implement the React components (Login.tsx, Signup.tsx, Dashboard.tsx, App.tsx)
c. Create a .env file for the frontend:

```
VITE_API_URL=http://localhost:5000
```
d. Update vite.config.ts

## Running the Application

1. Start the backend:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   flask run
   ```

2. In a new terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open a web browser and navigate to `http://localhost:5173` (or the URL provided by Vite).

4. Log in using the credentials:
   - Username: demo
   - Password: password

5. After logging in, you'll see the list of starships and a dropdown to select manufacturers.

6. Select a manufacturer from the dropdown to filter the starships.

## Preparing for Serverless Deployment on AWS

1. For the backend, modify the Flask app to work with AWS Lambda:

Create a new file `lambda.py` in the backend directory:

```python
import awsgi
from app import app

def lambda_handler(event, context):
    return awsgi.response(app, event, context)
```

2. For the frontend, build the React app:

```bash
cd frontend
npm run build
```

3. Deploy the built frontend to an S3 bucket configured for static website hosting.

4. Set up an API Gateway to trigger your Lambda function.

5. Update the frontend's API_URL to point to your API Gateway endpoint.

## Additional Considerations

1. Security: The current implementation uses a simple token system. Consider implementing a more robust solution like JWT for production.
2. Error Handling: Implement comprehensive error handling and logging in both frontend and backend.
3. Testing: Add unit tests and integration tests for both frontend and backend components.
4. CI/CD: Set up a continuous integration and deployment pipeline for automated testing and deployment.
5. Monitoring: Implement logging and monitoring solutions, especially important in a serverless environment.
6. Caching: Consider implementing caching strategies to reduce calls to the SWAPI and improve performance.
7. Pagination: Implement pagination for the starships list to handle large datasets more efficiently.
8. Responsive Design: Ensure the frontend is responsive and works well on various device sizes.
9. Accessibility: Implement accessibility features to ensure the application is usable by people with disabilities.
10. State Management: For larger applications, consider using a state management library like Redux or MobX.

# Mockups
## Signup Portal
![image](https://github.com/user-attachments/assets/5ed7f924-c0b4-46fe-a3e5-6948f204a6a7)
### User Already Exists
![image](https://github.com/user-attachments/assets/7a566a4c-c9ed-4a2b-a59d-bdf8cfc05e83)
### Signup to route to Login on successful Signup
![image](https://github.com/user-attachments/assets/1576062d-c9f6-4b97-9a6c-c01b27f10306)



## Login
### If no user exists
![image](https://github.com/user-attachments/assets/b0ed0bec-24c6-4bf9-bfb0-571576667451)
### Successful Login to Dashboards
![image](https://github.com/user-attachments/assets/a51ae4ff-3846-4707-b9e5-19d1af573677)
### Filter selected manufacturer only
![image](https://github.com/user-attachments/assets/ae314472-4f73-4019-ac81-aac4d0380635)




# AWS

aws dynamodb create-table \
  --table-name starwarsBFF \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
