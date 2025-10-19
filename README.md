Backend Wizards — Stage 0 Submission
Dynamic Profile API with Cat Facts Integration

This is my submission for the HNG Backend Stage 0 task.
I built a simple RESTful API using Node.js and Express.js that returns my basic profile information along with a random cat fact fetched dynamically from the Cat Facts API.

 Live Endpoint

GET:
https://hng-production-8013.up.railway.app/me


 What I Did

Initialized a new Node.js project and set up Express.

Used Axios to fetch live data from the Cat Facts API
.

Handled API errors gracefully with a fallback message.

Deployed successfully on Railway using a linked GitHub repository.

Tested the /me route to confirm JSON response structure and timestamp accuracy.

 Tools & Dependencies
Package	Purpose
Express	API routing and server handling
Axios	Fetching random cat facts
CORS	Enabling safe cross-origin requests

 My Workflow Summary

Created index.js and wrote the API logic.

Tested locally with Postman and browser.

Pushed the project to my GitHub repo — xyler0/HNG
.

Connected the repo to Railway for auto-deployment.

Verified the live link and response output before submission.

🐾 Fallback Example

If the external API is down, my app returns:

"fact": "Cats are fascinating creatures loved worldwide."

Stack: Node.js / Express