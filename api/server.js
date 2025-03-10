const http=require('http');
const port=4200;
const app=require('./app');
const fileUpload = require("express-fileupload");

app.use(fileUpload({ useTempFiles: true }));

const server=http.createServer(app)

server.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

