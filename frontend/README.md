<div align="center">
  <a href="https://couture.ai">
    <img src="public/favicon.ico" alt="Logo" width="60" height="60">
  </a>
  <h1>Search Console UI</h1>
</div>

## Project Description
Welcome to the Couture Search Console UI, the frontend component of the Couture.AI Search Console. This powerful console is designed to provide a seamless and feature-rich search experience for fashion-related queries. Whether you're curating search results, exploring analytics, or utilizing our Fashion Dictionary, this UI component has you covered.

## Features of the project
1. Visual Merchandiser: Elevate your search experience with our Visual Merchandiser tool. Curate and showcase search results visually for a more engaging user experience. 
2. Analytics Details Dashboard: Unlock the power of data with our Analytics Details dashboard. Gain in-depth insights into search performance, track key metrics, and make informed decisions. 
3. Fashion Dictionary: Explore our Fashion Dictionary to enhance your understanding of fashion-related terms. A valuable resource for users seeking clarity on industry jargon. 
4. Curate Queries: Tailor your search queries with ease. Pin items, hide items, boost attributes, bury attributes, or filter results to customize your search experience. 
5. Widgets: Access various widgets, including "Did You Mean", "Brand Substitution" and "Query Suggestion," to refine and improve search results. 


## Install Dependencies
In the project directory, run:
```bash
npm i --legacy-peer-deps
```


## Available Scripts
In the project directory, you can run:
```bash
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see lint errors in the console.



### Deployment Process
1. Build Image: docker build --platform linux/amd64 -t <imagename>
2. Save  Image as a tarball: docker save -o <image_name.tar> <imagename> 
3. SCP to server 
4. Load the image in the server: docker load -i </path/to/image_name.tar>
5. docker-compose down 
6. docker-compose build
7. docker-compose up -d

***

Copyright © 2024 Couture AI, All Rights Reserved. 
