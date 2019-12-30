const fancy = require('fancy-log');
const app = require('./app');

const port = 3000;

app.listen(port, () => { fancy.info(`server running on ${port}`); });
