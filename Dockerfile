# --- Build Stage ---
# Use a Node.js image to build the app
FROM node:20 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all your frontend source code
COPY . .

# Build your React app for production
RUN npm run build

# --- Production Stage ---
# Use a lightweight Nginx server
FROM nginx:alpine

# Copy the built files from the 'build' stage 
# (Check if your build folder is 'dist' or 'build')
COPY --from=build /app/dist /usr/share/nginx/html

# Tell Docker the container runs on port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]