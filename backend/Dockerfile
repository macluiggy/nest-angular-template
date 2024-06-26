# FROM oven/bun
FROM node


ARG DATABASE_URL
ARG JWT_SECRET
ARG JWT_EXPIRES_IN
ARG HUGGINGFACE_API_KEY
ARG CLOUDFLARE_API_KEY
ARG CLOUDFLARE_S3_ACCESS_KEY_ID
ARG CLOUDFLARE_S3_SECRET_ACCESS_KEY
ARG CLOUDFLARE_ACCOUNT_ID
ARG CLOUDFLARE_S3_BUCKET_NAME


# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
COPY tsconfig.json ./
# COPY bun.lockb ./
COPY package-lock.json ./

# Bundle app source
COPY . .

RUN npm install -g bun
RUN bun install -g @nestjs/cli
RUN bun install
RUN bun run build


ENV NODE_ENV=production
# Expose port 3000 
EXPOSE 3000

CMD ["bun", "run", "start:prod:bun"]