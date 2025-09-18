FROM oven/bun:alpine

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Runtime configuration
# Ensure you duplicate `.env.example` to `.env` and update values accordingly.
# `APP_PORT` should be defined in `.env`; the value here is the default.
ENV APP_PORT=3000
EXPOSE ${APP_PORT}

USER bun
CMD ["bun", "run", "start"]