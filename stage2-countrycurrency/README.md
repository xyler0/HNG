Country Currency & Exchange API - HNG13 Stage 2 (Backend)

A backend service built with Node.js, Express, Sequelize, and MySQL, deployed on Railway, for fetching, caching, and analyzing country and currency data with computed GDP and image summaries.

 Overview

This project fulfills the Stage 2 Backend Task for HNG13.
It fetches data from two public APIs:

 Countries API — https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies

 Exchange Rates API — https://open.er-api.com/v6/latest/USD

Each country record is processed, cached in MySQL, and served through clean REST endpoints.
The app was built from scratch using Node + Express + Sequelize, tested locally, and deployed successfully to Railway.

 What It Does
 Main Features

Fetch and cache all country and exchange rate data.

Match each country’s currency to its exchange rate.

Compute estimated_gdp = (population × random(1000–2000)) ÷ exchange_rate.

Support filtering, sorting, and CRUD operations.

Auto-generate and serve a summary image (cache/summary.png) showing:

Total countries cached

Top 5 by estimated GDP

Last refresh timestamp

⚙️ Endpoints
1. POST /countries/refresh

Fetches countries and exchange rates, computes GDP, and stores/updates in MySQL.

Response

{
  "message": "Countries refreshed successfully",
  "total": 250
}


If an external API fails:

{
  "error": "External data source unavailable",
  "details": "Could not fetch data from restcountries.com"
}

2. GET /countries

Fetch all cached countries.
Supports filters and sorting:

?region=Africa
?currency=NGN
?sort=gdp_desc


Sample Response

[
  {
    "name": "Nigeria",
    "region": "Africa",
    "population": 206139589,
    "currency_code": "NGN",
    "exchange_rate": 1600.23,
    "estimated_gdp": 25767448125.2,
    "flag_url": "https://flagcdn.com/ng.svg"
  }
]

3. GET /countries/:name

Fetch a single country by name.

404 Example

{ "error": "Country not found" }

4. DELETE /countries/:name

Delete a single country record.

Response

{ "message": "Country deleted successfully" }

5. GET /status

Quick API health/status endpoint.

Response

{
  "total_countries": 250,
  "last_refreshed_at": "2025-10-22T18:00:00Z"
}

6. GET /countries/image

Serves the generated image summary (cache/summary.png).

If not found:

{ "error": "Summary image not found" }

 Tech Stack
Layer	Technology
Language	Node.js
Framework	Express
ORM	Sequelize
Database	MySQL (Railway)
Hosting	Railway.app
External APIs	RestCountries + Open Exchange Rates
Image Generation	Canvas (node-canvas)
 Setup Instructions
 Local Setup (My Process)

Here’s how I personally built and ran the project:

Initialized project

npm init -y
npm install express mysql2 sequelize axios dotenv cors
npm install --save-dev nodemon


Connected MySQL using Railway’s connection URL.

Created Sequelize models and routes step by step.

Tested every endpoint using Postman.

Generated the summary image successfully after refresh.

Pushed to GitHub, deployed to Railway, and verified from multiple networks.

 Environment Variables

Create a .env file with:

PORT=3000
MYSQL_URL=mysql://<username>:<password>@<host>:<port>/<database>

▶Run Locally
npm run dev

 Deploy

Push to GitHub

Connect GitHub repo to Railway

Add environment variables

Railway builds and runs automatically

 Dependencies
Package	Use
express	REST API framework
sequelize	ORM for MySQL
mysql2	MySQL driver
axios	Fetch external APIs
dotenv	Environment management
cors	Allow requests
canvas	Generate summary image
nodemon	Auto reload during development
 Sample Workflow (Summary)

Run POST /countries/refresh

Verify GET /status → total count + last refresh timestamp

Open GET /countries/image → view the summary PNG

Filter countries by region or currency

Delete or view details by name

 Error Handling
Code	Description
400	Validation failed
404	Country not found
503	External data source unavailable
500	Internal server error

 Author

Slack: @RidwanA