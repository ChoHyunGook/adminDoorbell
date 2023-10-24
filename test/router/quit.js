import express from "express";
import cors from "cors"
import getService from '../service/getService.js'
import postService from '../service/postService.js'
import tokenDelService from '../service/delService.js'

const app = express()


const corsOptions = {
    origin : process.env.ORIGIN,
    optionsSuccessStatus : 200
}

app.use(cors({
    origin:true,
    credentials: true
}))

app.use(function(_req, res, next) {
    res.header(
        "Access-Control-Allow-Tabletheaders",
        "x-access-token, Origin, Content-Type, Accept",
        "Access-Control-Allow-Origin", "*"
    );
    next();
});

//post
app.post('/qqiiiskwdls/eiwrjsdsdf/wwii/test/fgis',cors(corsOptions),(req,res)=>{
    postService().postQuickQuitToken(req,res)
})
app.post('/quit',cors(corsOptions),(req,res)=>{
    postService().quitDate(req,res)
})
app.post('/quitLogin/soakdoas/ewoirewi/2325/33%25%/2lsa',cors(corsOptions),(req,res)=>{
    postService().quitLogin(req,res)
})
app.post('/quitJoin/soqwsld/weoir%%23/waskd2%212/qwk',cors(corsOptions),(req,res)=>{
    postService().quitJoin(req,res)
})



//get
app.get('/checkQuickQuit',cors(corsOptions),(req,res)=>{
    getService().getCheckQuickQuit(req,res)
})
app.get('/quittoken/asia/dtasqda/date/sa/2353/test/quit/tokendata/get',cors(corsOptions),(req,res)=>{
    getService().getQuitTokenVeri()
})
app.get('/date/asia/seoul/dtasqda/quittest%2352',cors(corsOptions),(req,res)=>{
    getService().todayDate(req,res)
})


//tokenDelete
app.get('/quit/token/quickquick/quicktokendata/getclear/this',cors(corsOptions),(req,res)=>{
    tokenDelService().delQuickquit(req,res)
})
app.get('/quittoken/asia/dtasqda/date/sa/2353/%/test/quit/tokendata/getClear/tokenQuit/quick',cors(corsOptions),(req,res)=>{
    tokenDelService().delQuit(req,res)
})








export default app


