FROM public.ecr.aws/lambda/nodejs:latest
COPY app/package*.json ./
RUN npm install
COPY app/index.mjs ./
CMD [ "index.handler" ]