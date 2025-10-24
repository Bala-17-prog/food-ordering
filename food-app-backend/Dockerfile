# Use an official Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all your backend source code into the container
COPY . .

# Tell Docker your app runs on port 4000 (or your server's port)
EXPOSE 4000

# The command to run your application
CMD ["node", "server.js"]