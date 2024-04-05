const express = require('express');
const cors = require('cors');
const {v4:uuidv4} = require('uuid');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const dbSource = "todo.db";
const db = new sqlite3.Database(dbSource);

const HTTP_PORT = 8000;
console.log("Listening on port " + HTTP_PORT);
var app = express();
app.use(cors());

////////////// USERS //////////////
/*
Method: POST
Required Parameters: Email, Password
Expected Returns: JSON Object with a key of Message
*/
app.post("/users",(req,res,next) => {
    let strEmail = req.query.Email;
    let strPassword = req.query.Password;
    let strUserID = uuidv4();

    if(strEmail && strPassword){
        bcrypt.hash(strPassword,10).then(hash => {
            strPassword = hash;
            let strCommand = 'INSERT INTO tblUsers VALUES(?,?,?)';
            let arrParameters = [strEmail,strPassword,strUserID];
            db.run(strCommand,arrParameters,function(err){
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
/*
Method: PUT
Required Parameters: Email,Password
Expected Returns: JSON Object with a key of Message
*/
app.put("/users",(req,res,next) => {
    let strEmail = req.query.Email;
    let strPassword = req.query.Password;

    if(strEmail && strPassword){
        bcrypt.hash(strPassword,10).then(hash => {
            strPassword = hash;
            let strCommand = 'UPDATE tblUsers SET Password = ? WHERE Email = ?';
            let arrParameters = [strPassword,strEmail];
            db.run(strCommand,arrParameters,function(err){
                if(err){
                    res.status(400).json({error:err.message});
                } else{
                    res.status(200).json({Message:"success"});
                }
            })
        })
    } else{
        res.status(400).json({error:"not all parameters provided"})
    }
})
/*
Method: DELETE
Required Parameters: Email
Expected Returns: JSON Object with a key of Message
*/
app.delete("/users",(req,res,next) => {
    let strEmail = req.query.Email;

    if(strEmail){
        let strCommand = "DELETE FROM tblUsers WHERE Email = ?";
        let arrParameters = [strEmail];
        db.run(strCommand,arrParameters,function(err){
            if(err){
                res.status(400).json({error:err.message});
            } else{
                res.status(200).json({Message:"success"});
            }
        })
    } else{
        res.status(400).json({error:"no email provided"});
    }
})
/*
Method: GET
Required Parameters: Email
Expected Returns: JSON Object with a key of User containing Password(Hashed) and UserID
*/
app.get("/users",(req,res,next) => {
    let strEmail = req.query.Email;

    if(strEmail){
        let strCommand = "SELECT Password,UserID FROM tblUsers WHERE Email = ?";
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
////////////// SESSIONS //////////////
/*
Method: POST
Required Parameters: Email, Password
Expected Returns: JSON Object with a key of Message or SessionID
*/
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
                        db.run(strCommand,arrParameters,function(err){
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
/*
Method: PUT
Required Parameters: SessionID
Expected Returns: JSON Object with a key of message
*/
app.put("/sessions",(req,res,next) => {
    let strSessionID = req.query.SessionID;
    let strTimeStamp = new Date().toISOString();

    if(strSessionID){
        let strCommand = 'UPDATE tblSessions SET TimeStamp = ? WHERE SessionID = ?';
        let arrParameters = [strTimeStamp,strSessionID];
        db.run(strCommand,arrParameters,function(err){
            if(err){
                res.status(400).json({error:err.message});
            } else{
                res.status(200).json({Message:"success"});
            }
        })
    } else{
        res.status(400).json({error:"not all parameters provided"})
    }
})
/*
Method: DELETE
Required Parameters: SessionID
Expected Returns: JSON Object with a key of Message
*/
app.delete("/sessions",(req,res,next) => {
    let strSessionID = req.query.SessionID;

    if(strSessionID){
        let strCommand = "DELETE FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.run(strCommand,arrParameters,function(err){
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
/*
Method: GET
Required Parameters: SessionID
Expected Returns: JSON Object with a key of Session containing UserID and TimeStamp
*/
app.get("/sessions",(req,res,next) => {
    let strSessionID = req.query.SessionID;

    if(strSessionID){
        let strCommand = "SELECT UserID,TimeStamp FROM tblSessions WHERE SessionID = ?";
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
/////////////// PROJECTS //////////////
/*
Method: POST
Required Parameters: ProjectName,SessionID
Expected Returns: JSON Object with a key of Message and ProjectID
*/
app.post("/projects",(req,res,next) => {
    let strProjectName = req.query.ProjectName;
    let strSessionID = req.query.SessionID;
    let strProjectID = uuidv4();

    if(strProjectName && strSessionID){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                strCommand = "INSERT INTO tblProjects VALUES(?,?,?)";
                arrParameters = [strProjectID,strProjectName,strUserID];
                db.run(strCommand,arrParameters,function(err){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(201).json({Message:"success",ProjectID:strProjectID});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"});
            }
        }
        )
    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})
/*
Method: PUT
Required Parameters: ProjectID,ProjectName,SessionID
Expected Returns: JSON Object with a key of Message
*/
app.put("/projects",(req,res,next) => {
    let strProjectID = req.query.ProjectID;
    let strProjectName = req.query.ProjectName;
    let strSessionID = req.query.SessionID;

    if(strProjectID && strProjectName && strSessionID){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                strCommand = "UPDATE tblProjects SET ProjectName = ? WHERE ProjectID = ? AND UserID = ?";
                arrParameters = [strProjectName,strProjectID,strUserID];
                db.run(strCommand,arrParameters,function(err){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(200).json({Message:"success"});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"});
            }
        })
    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})
/*
Method: DELETE
Required Parameters: ProjectID,SessionID
Expected Returns: JSON Object with a key of Message
*/
app.delete("/projects",(req,res,next) => {
    let strProjectID = req.query.ProjectID;
    let strSessionID = req.query.SessionID;

    if(strProjectID && strSessionID){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                strCommand = "DELETE FROM tblProjects WHERE ProjectID = ? AND UserID = ?";
                arrParameters = [strProjectID,strUserID];
                db.run(strCommand,arrParameters,function(err){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(200).json({Message:"success"});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"});
            }
        })
    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})
/*
Method: GET
Required Parameters: SessionID
Expected Returns: JSON Object with a key of Message or Projects containing:
                    - ProjectName
                    - ProjectID
*/
app.get("/projects",(req,res,next) => {
    let strSessionID = req.query.SessionID;

    if(strSessionID){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                console.log(strUserID);
                strCommand = "SELECT ProjectID,ProjectName FROM tblProjects WHERE UserID = ?";
                arrParameters = [strUserID];
                db.all(strCommand,arrParameters,function(err,rows){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(200).json({Projects:rows});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"});
            }
        })
    } else{
        res.status(400).json({error:"no sessionID provided"});
    }
})
////////////// TASKS //////////////
/*
Method: POST
Required Parameters: TaskName,Status,SessionID
Optional Parameters: DueDate,Location,Instructions,ProjectID
Expected Returns: JSON Object with a key of Message and TaskID
*/
app.post("/tasks",(req,res,next) => {
    let strDueDate = null;
    let strLocation = null;
    let strInstructions = null;
    let strProjectID = null;

    let strTaskName = req.query.TaskName;
    if(req.query.DueDate){
        strDueDate = req.query.DueDate;
    }
    if(req.query.Location){
        strLocation = req.query.Location;
    }
    if(req.query.Instructions){
        strInstructions = req.query.Instructions;
    }
    if(req.query.ProjectID){
        strProjectID = req.query.ProjectID;
    }
    let strStatus = req.query.Status;
    let strTaskID = uuidv4();
    let strSessionID = req.query.SessionID;

    if(strTaskName && strStatus && strSessionID){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                strCommand = "INSERT INTO tblTasks VALUES(?,?,?,?,?,?,?,?)";
                arrParameters = [strTaskName,strDueDate,strLocation,strInstructions,strStatus,strTaskID,strUserID,strProjectID];
                db.run(strCommand,arrParameters,function(err){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(201).json({Message:"success", TaskID:strTaskID});
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
/*
Method: PUT
Required Parameters: TaskID,SessionID
Optional Parameters: TaskName,DueDate,Location,Instructions,Status,ProjectID
Expected Returns: JSON Object with a key of Message
*/
app.put("/tasks",(req,res,next) => {
    let strTaskID = req.query.TaskID;
    let strSessionID = req.query.SessionID;

    if(strTaskID && strSessionID){
        let strCommand = 'SELECT COUNT(*) FROM tblSessions WHERE SessionID = ?';
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,count){
            if(err){
                res.status(400).json({error:err.message});
            } else if(count[0]['COUNT(*)'] > 0){
                strCommand = 'SELECT TaskName,DueDate,Location,Instructions,Status,ProjectID FROM tblTasks WHERE TaskID = ?';
                arrParameters = [strTaskID];
                db.all(strCommand,arrParameters,function(err,rows){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else if(rows.length > 0){
                        let strTaskName = rows[0].TaskName;
                        let strDueDate = rows[0].DueDate;
                        let strLocation = rows[0].Location;
                        let strInstructions = rows[0].Instructions;
                        let strStatus = rows[0].Status;
                        let strProjectID = rows[0].ProjectID;

                        if(req.query.TaskName){
                            strTaskName = req.query.TaskName;
                        }
                        if(req.query.DueDate){
                            strDueDate = req.query.DueDate;
                        }
                        if(req.query.Location){
                            strLocation = req.query.Location;
                        }
                        if(req.query.Instructions){
                            strInstructions = req.query.Instructions;
                        }
                        if(req.query.Status){
                            strStatus = req.query.Status;
                        }
                        if(req.query.ProjectID){
                            strProjectID = req.query.ProjectID;
                        }
                        strCommand = 'UPDATE tblTasks SET TaskName = ?, DueDate = ?, Location = ?, Instructions = ?, Status = ?,ProjectID = ? WHERE TaskID = ?';
                        arrParameters = [strTaskName,strDueDate,strLocation,strInstructions,strStatus,strProjectID,strTaskID];
                        db.run(strCommand,arrParameters,function(err){
                            if(err){
                                res.status(400).json({error:err.message});
                            } else{
                                res.status(200).json({Message:"success"});
                            }
                        })
                    } else{
                        res.status(200).json({Message:"invalid task"});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"});
            }
        })
    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})
/*
Method: DELETE
Required Parameters: SessionID,TaskID
Expected Returns: JSON Object with a key of Message
*/
app.delete("/tasks",(req,res,next) => {
    let strSessionID = req.query.SessionID;
    let strTaskID = req.query.TaskID;

    if(strTaskID && strSessionID){
        let strCommand = 'SELECT UserID FROM tblSessions WHERE SessionID = ?';
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                strCommand = 'DELETE FROM tblTasks WHERE TaskID = ? AND UserID=?';   
                arrParameters = [strTaskID,strUserID];
                db.run(strCommand,arrParameters,function(err){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(200).json({Message:"success"});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"});
            }
        })
    } else{
        res.status(400).json({error:"not all parameters provided"});
    }
})
/*
Method: GET
Required Parameters: SessionID
Expected Returns: JSON Object with a key of Message or Tasks containing:
                    - TaskName
                    - DueDate
                    - Location
                    - Instructions
                    - Status
                    - TaskID
                    - ProjectID
*/
app.get("/tasks",(req,res,next) => {
    let strSessionID = req.query.SessionID;

    if(strSessionID){
        let strCommand = "SELECT UserID FROM tblSessions WHERE SessionID = ?";
        let arrParameters = [strSessionID];
        db.all(strCommand,arrParameters,function(err,row){
            if(err){
                res.status(400).json({error:err.message});
            } else if(row.length > 0){
                let strUserID = row[0].UserID;
                strCommand = "SELECT TaskName,DueDate,Location,Instructions,Status,TaskID,ProjectID FROM tblTasks WHERE UserID = ?";
                arrParameters = [strUserID];
                db.all(strCommand,arrParameters,function(err,rows){
                    if(err){
                        res.status(400).json({error:err.message});
                    } else{
                        res.status(200).json({Tasks:rows});
                    }
                })
            } else{
                res.status(200).json({Message:"invalid session"});
            }
        })
    } else{
        res.status(400).json({error:"no sessionID provided"});
    }
})

app.listen(HTTP_PORT);