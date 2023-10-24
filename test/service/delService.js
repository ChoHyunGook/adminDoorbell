


export default function DelService(){

    return{
        delQuickquit(req,res){
            try{
                res.status(200)
                    .clearCookie('quickQuitToken','')
                    .clearCookie('quitToken','')
                    .send('AllclearCookie')
            }catch (e){
                res.status(400).send(e)
            }
        },
        delQuit(req,res){
            try{
                res.status(200)
                    .clearCookie('quitToken','')
                    .send('clearCookie')
            }catch (e){
                res.status(400).send(e)
            }
        },
    }
}