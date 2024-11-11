import express from 'express'
import bodyParser from 'body-parser'
import { loadEnv } from './config/dotenv.config'
import { allowedCors } from './config/origin.config'
import { connectDatabase } from './config/db.config'
import cloudinary from './config/cloudinary.config'
import { auth } from './router/auth.router'
import { link } from './router/file.link.route'
import cors from 'cors'
import path from 'path'
import http from 'http'
import { Server } from 'http'
import Message from './model/message.model'
const app=express();
const port=process.env.PORT || 9002;
loadEnv();
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());
console.log('_dirname is: ',__dirname)
app.use('/uploads', express.static(path.join(__dirname,'../uploads')));
// allowedCors();
app.use(cors());
connectDatabase();
cloudinary;
const server = http.createServer(app);
const io = new Server(server);
app.get('/',(req,res)=>{
    res.send(`Server is Live!`);
});

io.on('connection', (socket) => {
  
    socket.on('joinRoom', async (userId) => {
      const messages = await Message.find().sort({ timestamp: 1 });
      socket.emit('loadMessages', messages);
    });
  
    socket.on('message', async (message) => {
      const newMessage = new Message(message);
      await newMessage.save();
      io.emit('message', newMessage);
    });
  
    socket.on('disconnect', () => {
    });
  });

app.use('/auth',auth.auth());
app.use('/load',link.link());

app.get('/get-pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', 'pdf', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});


app.listen(port,()=>{
    console.log(`Server is listening on the Port ${port}`)
})