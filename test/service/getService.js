import jwt from "jsonwebtoken";
import moment from "moment-timezone";


export default function GetService(){
    return{
        getCheckQuickQuit(req,res){
            try {
                const token = req.cookies.quickQuitToken
                jwt.verify(token,'QuickQuit',(err,data)=>{
                    if(err){
                        res.status(400).send('No Token')
                    }else{
                        res.status(200).send('200')
                    }
                })
            }catch (e){
                res.status(400).send('No Token')
            }
        },

        getQuitTokenVeri(req,res){
            try {
                const token = req.cookies.quitToken
                jwt.verify(token,'QuickQuit',(err,data)=>{
                    if(err){
                        res.status(400).send(err)
                    }else{
                        res.status(200).send(data)
                    }
                })
            }catch (e){
                res.status(500).send(e)
            }
        },

        todayDate(req,res){
            let time = moment().tz('Asia/Seoul')
            let day = time.format('YYYY년 MM월 DD일')
            res.status(200).send(day)
        },

    }
}