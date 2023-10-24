import applyDotenv from "../../lambdas/applyDotenv.js";
import dotenv from "dotenv";
import db from "../../models/index.js";
import getDatabase from "../../lambdas/getDataBase.js";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import config from "../../../config/aws_user_config.js";
dotenv.config()

export default function TableService(){

    const { access_jwt_secret,AWS_TABLE_USER,AWS_TABLE_DEVICE } = applyDotenv(dotenv)

    const Table = db.Table
    const dbo = getDatabase()
    const dbConnect = dbo.getDb()

    AWS.config.update(config.aws_remote_config); //config 세팅
    const connection = new AWS.DynamoDB.DocumentClient(); //몽고디비 connection개념
    const userTable = {TableName:AWS_TABLE_USER}


    return{
        create(req,res){
            try {
                Table.findOne({contract_num:req.body.contract_num},function (err,tables){
                    if(!tables){
                        Table.findOne({id:req.body.id},function (err,users){
                            if(!users){
                                const bodyData = req.body;
                                new Table(bodyData).save((err)=>{
                                    if(err){
                                        return res.status(400).send(err)
                                    }else {
                                        return res.status(200).send('신규 가입 완료.')
                                    }
                                })
                            }else{
                                res.status(400).send('이미 존재하는 Id입니다. 다시한번 확인해주세요.')
                            }
                        })
                    }else {
                        res.status(400).send('이미 존재하는 계약번호 입니다. 다시 한번 확인해 주세요.')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },

        read(req,res){
            try {
                const data = req.body
                let searchType = data.selectBox
                const searchTarget = data.searchText

                const token = req.cookies.accessToken
                const tokenData = jwt.verify(token,access_jwt_secret)
                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send('로그인 후 사용해주세요')
                    }
                    else {
                        if(searchType === 'contract_num'){
                            Table.find({contract_num:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 계약번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'device_id'){

                            Table.find({device_id:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 단말기번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 단말기번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 단말기번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'name'){

                            Table.find({name:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약자명이 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 계약자명이 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약자명이 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'tel'){

                            Table.find({tel:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 연락처가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 연락처가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 연락처가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'service_name'){

                            Table.find({service_name:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 서비스종류가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 서비스종류가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 서비스종류가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'id'){
                            Table.find({id:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 ID가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        res.status(200).json(board)
                                    }else if(err){
                                        res.status(400).send('일치하는 ID가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 ID가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }
                    }
                })
            }
            catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }
        },

        update(req,res){
            try {

                const data = req.body

                Table.findOne({id:data.id},function (err,users){
                    if(!users){
                        res.status(400).send('가입되어 있지 않는 아이디입니다.')
                    }else{
                        Table.findOneAndUpdate({contract_num:data.contract_num},
                            {$set:data},
                            function (err,board){
                                if(err){
                                    res.status(400).send(err)
                                }else{

                                    connection.scan(userTable,(err,users)=>{
                                        const userData = users.Items

                                        let user_key;
                                        const findUser = userData.filter((item)=>{
                                            if(data.company === item.company && data.id === item.user_id ){
                                                return item
                                            }
                                        })
                                        findUser.filter((items)=>{
                                            user_key= items.user_key
                                        })

                                        if(user_key === undefined){
                                            console.log('해당하는 유저 정보가 없습니다.')
                                            res.status(400).send('해당하는 유저 정보가 없습니다.')
                                        }else{
                                            const userParams ={
                                                TableName:AWS_TABLE_USER,
                                                Key:{
                                                    "user_key":user_key
                                                },
                                                UpdateExpression: "set addr = :addr, #push_name = :user_name, tel = :tel, user_id = :id",
                                                ExpressionAttributeNames:{
                                                    '#push_name':'name'
                                                },
                                                ExpressionAttributeValues:{
                                                    ':addr':data.addr.replace(/(\s*)/g, ""),
                                                    ':user_name':data.name.replace(/(\s*)/g, ""),
                                                    ':tel':data.tel.replace(/(\s*)/g, ""),
                                                    ':id':data.id.replace(/(\s*)/g, "")
                                                }
                                            }

                                            const deviceParams = {
                                                TableName:AWS_TABLE_DEVICE,
                                                Key:{
                                                    "device_id":data.device_id.replace(/(\s*)/g, ""),
                                                    "user_key":user_key
                                                },
                                                UpdateExpression: "set contract_num = :contract_num, " +
                                                    "contract_service = :contract_service, service_name = :service_name, " +
                                                    "service_start = :service_start, service_end = :service_end, start_up = :start_up",
                                                ExpressionAttributeValues:{
                                                    ':contract_num':data.contract_num.replace(/(\s*)/g, ""),
                                                    ':contract_service':data.contract_service.replace(/(\s*)/g, ""),
                                                    ':service_name':data.service_name.replace(/(\s*)/g, ""),
                                                    ':service_start':data.service_start.replace(/(\s*)/g, ""),
                                                    ':service_end':data.service_end.replace(/(\s*)/g, ""),
                                                    ':start_up':(data.start_up.replace(/(\s*)/g, "") === 'O') ? true:false
                                                }
                                            }

                                            connection.update(userParams,(err,usersdata)=>{
                                                if(err) throw err
                                                connection.update(deviceParams,(err,devicesData)=>{
                                                    if(err) throw err

                                                })
                                            })

                                        }
                                    })

                                    res.status(200).json({data:board, message:'수정 성공'})
                                }
                            })
                    }
                })




            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },

        delete(req,res){
            try {
                const data = req.body
                let idMapper = data.map(id => id.id)
                let contractMapper = data.map(contract=>contract.contract_num)
                let phoneNumMapper = data.map(phoneNum=>phoneNum.tel)
                let terminalNumMapper = data.map(terminalNum=>terminalNum.device_id)



                Table.deleteMany({id:idMapper,contract_num:contractMapper,tel:phoneNumMapper,device_id:terminalNumMapper}, function (err){
                    if(err){
                        return res.status(400).send('데이터가 없습니다. 새로고침하여 다시 한번 확인해주세요.')
                    }else {
                        connection.scan(userTable,(err,users)=>{
                            const userData = users.Items
                            userData.filter((item)=>{
                                data.map(obj=>{
                                    if(item.company === obj.company && item.user_id === obj.id){
                                        connection.delete({
                                            TableName:AWS_TABLE_USER,
                                            Key:{
                                                "user_key":item.user_key
                                            },
                                            ConditionExpression:"set addr = :addr, #push_name = :user_name, tel = :tel, user_id = :id",
                                            ExpressionAttributeNames:{
                                                '#push_name':'name'
                                            },
                                            ExpressionAttributeValues:{
                                                ':user_name':obj.name.replace(/(\s*)/g, ""),
                                                ':addr':obj.addr.replace(/(\s*)/g, ""),
                                                ':tel':obj.tel.replace(/(\s*)/g, ""),
                                                ':id':obj.id.replace(/(\s*)/g, "")
                                            }
                                        },function (err){

                                            if(err) throw err

                                            connection.delete({
                                                TableName:AWS_TABLE_DEVICE,
                                                Key:{
                                                    "device_id":obj.device_id.replace(/(\s*)/g, ""),
                                                    "user_key":item.user_key
                                                },
                                                ConditionExpression: "set contract_num = :contract_num, " +
                                                    "contract_service = :contract_service, service_name = :service_name, " +
                                                    "service_start = :service_start, service_end = :service_end, start_up = :start_up",
                                                ExpressionAttributeValues:{
                                                    ':contract_num':obj.contract_num.replace(/(\s*)/g, ""),
                                                    ':contract_service':obj.contract_service.replace(/(\s*)/g, ""),
                                                    ':service_name':obj.service_name.replace(/(\s*)/g, ""),
                                                    ':service_start':obj.service_start.replace(/(\s*)/g, ""),
                                                    ':service_end':obj.service_end.replace(/(\s*)/g, ""),
                                                    ':start_up':(obj.start_up.replace(/(\s*)/g, "") === 'O') ? true:false
                                                }
                                            },function (err){
                                                if(err) throw err
                                            })

                                        })
                                    }
                                })
                            })
                        })

                        return res.status(200).send('삭제 성공')
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },
        excelDownload(req,res){
            try {
                const data = req.body;

                let bodyData = [];

                data.filter((names)=>{
                    let dbs = {
                        '회사명':names.company,
                        '계약번호':names.contract_num,
                        '개통':names.start_up,
                        '기기번호(MAC)':names.device_id,
                        '계약자이름':names.name,
                        '통신':names.communication,
                        '아이디':names.id,
                        '전화번호':names.tel,
                        '계약자구분':names.contract_service,
                        '서비스명':names.service_name,
                        '주소':names.addr,
                        '서비스시작일자(년도-월-일)':names.service_start,
                        '서비스종료일자(년도-월-일)':names.service_end
                    }
                    bodyData.push(dbs)
                })
                res.status(200).send(bodyData)



            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }
        },

        excelUpload(req,res){
            try {
                const data = req.body;

                let bodyData = [];

               data.filter((names)=>{
                   let dbs = {
                        company:names['회사명'],
                        contract_num:names['계약번호'],
                        start_up:names['개통'],
                        device_id:names['기기번호(MAC)'],
                        name:names['계약자이름'],
                        communication:names['통신'],
                        id:names['아이디'],
                        tel:names['전화번호'],
                        contract_service:names['계약자구분'],
                        service_name:names['서비스명'],
                        addr:names['주소'],
                        service_start:names['서비스시작일자(년도-월-일)'],
                        service_end:names['서비스종료일자(년도-월-일)']
                    }
                   bodyData.push(dbs)
                })


                Table.bulkWrite(
                    bodyData.map((item) =>
                        ({
                            updateOne: {
                                filter: {id: item.id},
                                update: {$set: item},
                                upsert: true
                            }
                        })
                    )
                    , function (err, board) {
                        if (err) {
                            res.status(400).send('데이터 오류. 새로고침 후 사용해주세요.')
                        } else {
                            connection.scan(userTable,(err,users)=>{
                                const userData = users.Items
                                userData.filter((item)=>{
                                    bodyData.map(obj=>{
                                        if(item.company === obj.company && item.user_id === obj.id){
                                            connection.update({
                                                TableName:AWS_TABLE_USER,
                                                Key:{
                                                    "user_key":item.user_key
                                                },
                                                UpdateExpression: "set addr = :addr, #push_name = :user_name, tel = :tel, user_id = :id",
                                                ExpressionAttributeNames:{
                                                    '#push_name':'name'
                                                },
                                                ExpressionAttributeValues:{
                                                    ':user_name':obj.name.replace(/(\s*)/g, ""),
                                                    ':addr':obj.addr.replace(/(\s*)/g, ""),
                                                    ':tel':obj.tel.replace(/(\s*)/g, ""),
                                                    ':id':obj.id.replace(/(\s*)/g, "")
                                                }
                                            },function (err){

                                                if(err) throw err

                                                connection.update({
                                                    TableName:AWS_TABLE_DEVICE,
                                                    Key:{
                                                        "device_id":obj.device_id.replace(/(\s*)/g, ""),
                                                        "user_key":item.user_key
                                                    },
                                                    UpdateExpression: "set contract_num = :contract_num, " +
                                                        "contract_service = :contract_service, service_name = :service_name, " +
                                                        "service_start = :service_start, service_end = :service_end, start_up = :start_up",
                                                    ExpressionAttributeValues:{
                                                        ':contract_num':obj.contract_num.replace(/(\s*)/g, ""),
                                                        ':contract_service':obj.contract_service.replace(/(\s*)/g, ""),
                                                        ':service_name':obj.service_name.replace(/(\s*)/g, ""),
                                                        ':service_start':obj.service_start.replace(/(\s*)/g, ""),
                                                        ':service_end':obj.service_end.replace(/(\s*)/g, ""),
                                                        ':start_up':(obj.start_up.replace(/(\s*)/g, "") === 'O') ? true:false
                                                    }
                                                },function (err){
                                                    if(err) throw err
                                                })
                                            })
                                        }
                                    })
                                })
                            })

                            res.status(200).json({data: board, message: '수정 성공'})
                        }
                    })


            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }

        },

        tableByCompany(req,res){
            try {
                const token = req.cookies.accessToken
                const data = jwt.verify(token,access_jwt_secret)
                Table.find({company:data.company},function (err,board){
                    try{
                        res.status(200).send(board)
                    }
                    catch (err){
                        res.status(400).json({message:"실패"})
                    }
                })
            }catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }
        },

        readMobile(req,res){
            const data = req.body
            let searchType = data.selectBox
            const searchTarget = data.searchText


            const token = req.cookies.accessToken
            const tokenData = jwt.verify(token,access_jwt_secret)

            try {
                jwt.verify(token,access_jwt_secret,(err)=>{
                    if(err){
                        res.status(400).send('로그인 후 사용해주세요')
                    }
                    else {
                        if(searchType === 'contract_num'){
                            Table.find({contract_num:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 계약번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'device_id'){

                            Table.find({device_id:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 단말기번호가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 단말기번호가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 단말기번호가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'name'){

                            Table.find({name:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 계약자명이 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 계약자명이 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 계약자명이 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'tel'){

                            Table.find({tel:searchTarget}, function (err,board){

                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 연락처가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 연락처가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 연락처가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'service_name'){

                            Table.find({service_name:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 서비스종류가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 서비스종류가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 서비스종류가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }

                        else if(searchType === 'id'){
                            Table.find({id:searchTarget}, function (err,board){
                                if(board && board.length === 0){
                                    res.status(400).send('일치하는 ID가 없습니다.')
                                }else{
                                    let comp = board.find(item => item.company)
                                    if(tokenData.company === comp.company){
                                        const dbDataToken = jwt.sign({
                                            userData: board
                                        },access_jwt_secret)

                                        res.cookie('dbDataToken',dbDataToken,{
                                            secure:false,
                                            httpOnly:true
                                        })
                                        res.status(200).send('Success')
                                    }else if(err){
                                        res.status(400).send('일치하는 ID가 없습니다.')
                                    }else{
                                        res.status(400).send('일치하는 ID가 없습니다.(회사틀림)')
                                    }
                                }
                            })
                        }
                    }
                })
            }
            catch (e){
                if(e.name === 'TokenExpiredError'){
                    res.status(500).send('로그인 시간이 만료되었습니다.')
                }
            }
        },




    }

}