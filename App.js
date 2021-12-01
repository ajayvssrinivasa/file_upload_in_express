const express=require('express');
const multer=require('multer');
const path=require('path');
const helpers=require('./helpers/helpers');
const PORT=8888;
const app=express();
app.use(express.static("uploads"));
app.set("view engine","ejs");
//for uploading 
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
})
//end 
app.get("/",(req,res)=>{
    res.render("upload");
})
app.post("/fileupload",(req,res)=>{
    let upload=multer({storage:storage,fileFilter:helpers.imageFilter}).array('myfile',10);
    upload(req,res,(err)=>{
        if(req.fileValidationError){
            res.send(req.fileValidationError)
        }
       else if(!req.files){
           res.send("Please select a file");
       }
       else if(err){
           res.send("SOme uploading error");
       }
       else {
           const files=req.files;
           let result='';
           for(index=0, len=files.length; index<len; ++index){
              
               result+=`You uploaded the file : <hr/> <img src="${files[index].filename}" width="300" height="300"/>`;
           }
           res.send(result);
       }
    })
})
app.listen(PORT,(err)=>{
    if(err) throw err;
    console.log(`Work on ${PORT}`);
})