"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_config_1 = require("./config/dotenv.config");
const db_config_1 = require("./config/db.config");
const cloudinary_config_1 = __importDefault(require("./config/cloudinary.config"));
const auth_router_1 = require("./router/auth.router");
const file_link_route_1 = require("./router/file.link.route");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const http_2 = require("http");
const message_model_1 = __importDefault(require("./model/message.model"));
const app = (0, express_1.default)();
const port = process.env.PORT || 9002;
(0, dotenv_config_1.loadEnv)();
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use(express_1.default.json());
console.log('_dirname is: ', __dirname);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// allowedCors();
app.use((0, cors_1.default)());
(0, db_config_1.connectDatabase)();
cloudinary_config_1.default;
const server = http_1.default.createServer(app);
const io = new http_2.Server(server);
app.get('/', (req, res) => {
    res.send(`Server is Live!`);
});
io.on('connection', (socket) => {
    socket.on('joinRoom', (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield message_model_1.default.find().sort({ timestamp: 1 });
        socket.emit('loadMessages', messages);
    }));
    socket.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        const newMessage = new message_model_1.default(message);
        yield newMessage.save();
        io.emit('message', newMessage);
    }));
    socket.on('disconnect', () => {
    });
});
app.use('/auth', auth_router_1.auth.auth());
app.use('/load', file_link_route_1.link.link());
app.get('/get-pdf/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path_1.default.join(__dirname, '../uploads', 'pdf', filename);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(404).send('File not found');
        }
    });
});
app.listen(port, () => {
    console.log(`Server is listening on the Port ${port}`);
});
