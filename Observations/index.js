const express = require('express');
const cors = require('cors');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const dbSource = ".db";
const db = new sqlite3.Database(dbSource);

const HTTP_PORT = 8000;
console.log("Listening on port " + HTTP_PORT);
var app = express();
app.use(cors());

app.post("/users",(req,res,next) => {
    let strEmail = req.query.Email;
    let strPassword = req.query.Password;
    let strFirstName = req.query.FirstName;
    let strLastName = req.query.LastName;
    let strUserID = uuidv4();

    if(strEmail && strPassword){
        bcrypt.hash(strPassword,10).then(hash => {
            strPassword = hash;
            let strCommand = 'INSERT INTO tblUsers VALUES(?,?,?,?,?)';
            let arrParameters = [strUserID,strEmail,strPassword,strFirstName,strLastName];
            db.run(strCommand,arrParameters,function(err,result){
                if(err){
                    res.status(400).json({error:err.message});
                } else{
                    res.status(201).json({Message:"success"});
                }
            })
        })
    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})

app.get("/users",(req,res,next) => {
    let strEmail = req.query.Email;

    if(strEmail){
        let strCommand = "SELECT Password,UserID,FirstName,LastName FROM tblUsers WHERE Email = ?";
        let arrParameters = [strEmail];
        db.all(strCommand,arrParameters,function(err,rows){
            if(err){
                res.status(400).json({error:err.message});
            } else{
                res.status(200).json({User:rows[0]})
            }
        })
    } else{
        res.status(400).json({error:"no email provided"});
    }
})

app.post("/sessions",(req,res,next) => {
    let strEmail = req.query.Email;
    let strPassword = req.query.Password;
    let strSessionID = uuidv4();
    let strTimeStamp = new Date().toISOString();

    if(strEmail && strPassword){
        let strCommand = "SELECT Password,UserID FROM tblUsers WHERE Email = ?";
        let arrParameters = [strEmail];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else{
                let strUserID = row[0].UserID;
                bcrypt.compare(strPassword,row[0].Password).then(result => {
                    if(result){
                        strCommand = "INSERT INTO tblSessions VALUES(?,?,?)";
                        arrParameters = [strSessionID,strUserID,strTimeStamp];
                        db.run(strCommand,arrParameters,function(err,result){
                            if(err){
                                res.status(400).json({error:err.message});
                            } else{
                                res.status(201).json({SessionID:strSessionID});
                            }
                        })
                    } else{
                        res.status(200).json({Message:"error: invalid password"});
                    }
                })
            }
        })     
    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})

app.get("/sessions",(req,res,next) => {
    let strSessionID = req.query.SessionID;

    if(strSessionID){
        let strCommand = "SELECT UserID,DateTimeStart FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else{
                res.status(200).json({Session:row[0]})
            }
        })
    } else{
        res.status(400).json({error:"no sessionID provided"});
    }
})

app.delete("/sessions",(req,res,next) => {
    let strSessionID = req.query.SessionID;

    if(strSessionID){
        let strCommand = "DELETE FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.run(strCommand,arrParameters,function(err,result){
            if(err){
                res.status(400).json({error:err.message});
            } else{
                res.status(200).json({Message:"success"});
            }
        })
    } else{
        res.status(400).json({error:"no sessionID provided"});
    }
})

app.post("/species",(req,res,next) => {
    let strCommonName = req.query.CommonName;
    let strSpeciesID = uuidv4();
    let strScientificName = null;
    let strIdentifyURL = null;
    if(req.query.ScientificName){
        strScientificName = req.query.ScientificName;
    }
    if(req.query.IdentifyURL){
        strIdentifyURL = req.query.IdentifyURL;
    }

    if(strCommonName){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                strCommand = "INSERT INTO tblTreeSpecies VALUES(?,?,?,?)";
                arrParameters = [strSpeciesID,strScientificName,strCommonName,strIdentifyURL];
                db.run(strCommand,arrParameters,function(err,result){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(200).json({Message:"success",SpeciesID:strSpeciesID});
                    }  
                })
            } else{
                res.status(200).json({Message:"invalid session"})
            }
        })

    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})

app.post("/observations",(req,res,next) => {
    

    if(strTaskName && strStatus && strSessionID){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                strCommand = "INSERT INTO tblTasks VALUES(?,?,?,?,?,?,?)";
                arrParameters = [strTaskName,strDueDate,strLocation,strInstructions,strStatus,strTaskID,strUserID];
                db.run(strCommand,arrParameters,function(err,result){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(201).json({Message:"success"});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"})
            }
        })

    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})

app.listen(HTTP_PORT);