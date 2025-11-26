# Base DevContainer image
FROM mcr.microsoft.com/devcontainers/php:1-8.2

# Install system tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
        zip unzip git default-mysql-client redis-tools sudo \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install WP-CLI manually
RUN curl -fsSL -o /usr/local/bin/wp https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x /usr/local/bin/wp

USER vscode
WORKDIR /workspaces/wp-plugin-builder-fixed
