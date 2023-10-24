import dotenv from 'dotenv'
import applyDotenv from "../lambdas/applyDotenv.js";
import moment from "moment-timezone";

export default function TableDataBase(mongoose){
    const{ mongoUri, port } = applyDotenv(dotenv)
    const getCurrentTime = ()=>{
        const m = moment().tz("Asia/Seoul")
        return m.format('YYYY.MM.DD HH:mm:ss')
    }

    const tableSchema = new mongoose.Schema({
        contract_num:{type:String,required:true,unique:true},
        device_id:{type:String, required:true},
        company:{type:String,required:true},
        name:{type:String,required:true},
        contract_service:{type:String,required:true},
        id:{type:String,required:true,unique:true},
        addr:{type:String,required:true},
        tel:{type:String,required:true},
        communication: {type:String,required:true},
        service_name:{type:String,required:true},
        service_start: {type:String,required:true},
        service_end: {type:String,required:true},
        start_up:{type:String,required:true},
    },{versionKey:false});


    return mongoose.model('Table',tableSchema)
}