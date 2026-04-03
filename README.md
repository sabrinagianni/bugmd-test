# BugMD Quiz Funnel – Playwright Tests

This repo contains automated tests for the BugMD Pest Defense Pro quiz funnel.
Test file is under tests

## Setup

npm install  
npx playwright install

## Run tests

npx playwright test --project=chromium --workers=1

## What is tested

- Annual plan flow adds correct product and redirects to cart/checkout
- Quarterly plan flow shows correct pricing and adds to cart
- ZIP code validation shows error for invalid input

## Store

Funnel Landing Page: https://bugmd-4.myshopify.com/pages/get-started  
Password: cranberry
