import jwt from "jsonwebtoken";
import moment from "moment-timezone";
import db from '../models/index.js'


export default function PostService(){

    const User = db.User


    return{
        postQuickQuitToken(req,res){
            const data = req.body
            const quickQuitToken = jwt.sign({
                Access:data.QuitAccess
            },'QuickQuit',{expiresIn:'9h'})
            res.cookie("quickQuitToken",quickQuitToken,{
                secure:false,
                httpOnly:true
            })
            res.status(200).send(200)
        },

        quitDate(req,res){
            const data = req.body

            let time = moment().tz('Asia/Seoul')

            const timeContains = data.quit.includes(':')

            if(timeContains === false){
                res.status(400).send(` 똑디 적으라~!!\n - 기입한 시간:${data.quit}\n\n 예시)8:00 or 8:00:00`)
            }else{

                let reqTime = data.quit.split(':')
                let reqHour = Number(reqTime[0])
                let reqMinutes = Number(reqTime[1])
                let reqSeconds;

                if(reqTime[2]===undefined){
                    reqSeconds = 0
                }else{
                    reqSeconds = Number(reqTime[2])
                }

                let startTime = `출근시간: 오전 ${reqHour}시 ${reqMinutes}분 ${reqSeconds}초`
                let quitTime = `퇴근시간: 오후 ${reqHour+9 -12}시 ${reqMinutes}분 ${reqSeconds}초`

                if(reqHour > 10 || reqHour <= 5){
                    res.status(400).send(`출근은 6시부터 10시 59분까지 입니당`)
                }else if(reqMinutes >= 60) {
                    res.status(400).send(`장난 치다 딱 걸릿 60분 이상이 어딧슴 \n 적은 분: ${reqMinutes}`)
                }else if(reqSeconds >= 60){
                    res.status(400).send(`나를 시험하는 것 인가 혼꾸녕이 날라고 \n 적은 초: ${reqSeconds}`)
                }
                else {
                    const quitToken = jwt.sign({
                        start:startTime,
                        quit:quitTime,
                        filter:`${time.format('YYYY')}:${time.format('MM')}:${time.format('DD')}:${reqHour+9}:${reqMinutes}:${reqSeconds}`
                    },'QuickQuit',{expiresIn:'9h'})
                    res.cookie("quitToken",quitToken,{
                        secure:false,
                        httpOnly:true
                    })
                    res.status(200).send(200)
                }//출근시간 기준

            }//timeContains
        },

        quitLogin(req,res){
            console.log(req.body)
            User.findOne({userId:req.body.id},function (err,user) {
                if(err) throw err
                if(!user){
                    res.status(400).send('가입된 아이디 없어유!')
                }else{
                    user.comparePassword(req.body.pw,function (_err, isMatch) {
                        if(!isMatch){
                            res.status(400).send('비밀번호 틀렸음!! (영어+숫자포함 5~10자리!!)')
                        }else{
                            try {
                                const workTime =user.work.split(':')
                                const ex = Number(workTime[0])+1
                                const loginToken = jwt.sign({
                                    id:user.id,
                                    name:user.name
                                },'QuickQuit',{expiresIn:`${ex}h`})
                                const autoLoginToken = jwt.sign({
                                    id:user.id,
                                    pw:req.body.pw,
                                    name:user.name
                                },'QuickQuit',{expiresIn:'30d'})

                            }catch (e){

                            }
                        }
                    })
                }
            })
        },

        quitJoin(req,res){
            const data = req.body
            const workFilter = data.workTime.split(':')

            if(Number(workFilter[0]) > 10){
                res.status(400).send(`노동청 신고 ㄱㄱ 주 40시간, 일 8시간 이상임!!(식사시간 포함 최대 10시간 공장포함!!)\n 작성한 시간: ${workFilter[0]}시간`)
            }else{
                if(Number(workFilter[0]) === 10 && Number(workFilter[1]) >= 1 ){
                    res.status(400).send(`노동청 신고 ㄱㄱ 주 40시간, 일 8시간 이상임!!\n(식사시간 포함 최대 10시간 공장포함!!)\n작성한 시간: ${workFilter[0]}시간 ${workFilter[1]}분`)
                }else{
                    User.findOne({userId:data.id},function (err,user) {
                        if(err) throw err
                        if(!user){
                            let saveData = {
                                name:data.name,
                                userId:data.id,
                                password:data.pw,
                                work:data.workTime
                            }

                            new User(saveData).save((err)=>{
                                if(err){
                                    console.log(1)
                                    res.status(500).send(err)
                                }else{
                                    console.log(2)
                                    const joinToken = jwt.sign({
                                        id:data.id,
                                        pw:data.pw
                                    },'QuickQuit',{expiresIn:'1m'})
                                    res.cookie('joinToken',joinToken,{
                                        secure:false,
                                        httpOnly:true
                                    })
                                    res.status(200).send('회원가입 완료!!')
                                }
                            })
                        }else{
                            console.log(3)
                            res.status(400).send('이미 사용 중인 아이디임!!!')
                        }
                    })
                }
            }
        },


    }
}