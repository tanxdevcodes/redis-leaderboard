# Step 1: Use a lightweight Node.js base image
FROM node:18-alpine

# Step 2: Set the internal working directory inside the container
WORKDIR /app

# Step 3: Copy dependency definition files first
COPY package*.json ./

# Step 4: Install NPM packages inside the container image
RUN npm install

# Step 5: Copy all remaining backend source code into the container
COPY . .

# Step 6: Expose the application port to the internal Docker network
EXPOSE 5000

# Step 7: Define the command to start the Express application
CMD ["npm", "start"]