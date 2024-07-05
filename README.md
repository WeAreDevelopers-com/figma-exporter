![WeAreDevelopers Logo](https://careers.recruiteecdn.com/image/upload/q_auto,f_auto,w_400,c_limit/production/images/A5xK/fbNWuS0fl4_2.png)

# Figma Image Export Tool

This tool will allow you to export images from a Figma file in bath.
The original file location is set with the FILE_KEY environment variable, and a personal access token in FIGMA_API_TOKEN.

## Installation

Install and run the development server:

```bash
  npm i
  node server
```

## Dependencies

This project requires three dependencies, featured in package.json:

```bash
"axios": "^1.7.2",
"dotenv": "^16.4.5",
"express": "^4.19.2"
```

## Environment Variables

This project requires two environment variables:

```bash
FIGMA_API_TOKEN=your-figma-api-token
FILE_KEY=your-figma-file-key
```

## Authors

This project was created by Daniel Cranney (Developer Advocate at WeAreDevelopers) - [@danielcranney](https://www.github.com/danielcranney).
