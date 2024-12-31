# Portfolio Website
[www.ethanparliament.com](https://www.ethanparliament.com)

This repository contains the source code for my portfolio website. The website showcases various projects and provides insights into my skills and experience.

## Pages

- **Home**: The landing page of the website.
- **NBA**: A section dedicated to NBA analytics, including predictions, results, and tracking the performance of my model
- **Hockey**: A page for showcasing various hockey analytics projects I've done.

## Tools and Technologies Used

- **AWS CDK**: Used for infrastructure as code to deploy the backend and frontend stacks.
- **React**: Used for building the frontend user interface.
- **TypeScript**: Used for type safety in both frontend and backend code.
- **AWS Lambda**: Used for serverless backend functions.
- **AWS DynamoDB**: Used as the database for storing data.
- **AWS S3**: Used for hosting the static website.
- **AWS CloudFront**: Used for content delivery network (CDN) to serve the website.

## Project Structure

- **backend/**: Contains the backend code including Lambda functions and API routes.
- **frontend/**: Contains the frontend code built with React.
- **lib/**: Contains the AWS CDK stack definitions for deploying the infrastructure.
- **bin/**: Contains the entry point for the CDK application.

## Deployment

The website is deployed using AWS services. The frontend is hosted on an S3 bucket and served via CloudFront. The backend consists of Lambda functions and API Gateway for handling API requests.

