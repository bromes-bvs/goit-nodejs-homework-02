FROM node

WORKDIR /app

COPY . /app

RUN npm i

RUN npm uninstall bcrypt

RUN npm i bcrypt

EXPOSE 2233

CMD ["node","./server.js"]
