FROM node:20

# Set the working directory
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Install dependencies inside the backend folder
WORKDIR /app/backend
RUN npm install

# Expose the application port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
