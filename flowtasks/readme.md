# flowtasks

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `node index.js` to start the server. The server will run on port 8000 by default.
4. Open index.html in a browser to view the client.

## Endpoints

**/users**

Method: POST  
Required Parameters: Email, Password  
Expected Returns: JSON Object with a key of Message  

Method: PUT  
Required Parameters: Email,Password  
Expected Returns: JSON Object with a key of Message  

Method: DELETE  
Required Parameters: Email  
Expected Returns: JSON Object with a key of Message  

Method: GET  
Required Parameters: Email  
Expected Returns: JSON Object with a key of User containing Password(Hashed) and UserID  

**/sessions**

Method: POST  
Required Parameters: Email, Password  
Expected Returns: JSON Object with a key of Message or SessionID  

Method: PUT  
Required Parameters: SessionID  
Expected Returns: JSON Object with a key of message  

Method: DELETE  
Required Parameters: SessionID  
Expected Returns: JSON Object with a key of Message  

Method: GET  
Required Parameters: SessionID  
Expected Returns: JSON Object with a key of Session containing UserID and TimeStamp  

**/projects**

Method: POST  
Required Parameters: ProjectName,SessionID  
Expected Returns: JSON Object with a key of Message or ProjectID  

Method: PUT  
Required Parameters: ProjectID,ProjectName,SessionID  
Expected Returns: JSON Object with a key of Message  

Method: DELETE  
Required Parameters: ProjectID,SessionID  
Expected Returns: JSON Object with a key of Message  

Method: GET  
Required Parameters: SessionID  
Expected Returns: JSON Object with a key of Message or Projects containing:  
- ProjectName  
- ProjectID  

**/tasks**

Method: POST  
Required Parameters: TaskName,Status,SessionID  
Optional Parameters: DueDate,Location,Instructions,ProjectID  
Expected Returns: JSON Object with a key of Message or TaskID  

Method: PUT  
Required Parameters: TaskID,SessionID  
Optional Parameters: TaskName,DueDate,Location,Instructions,Status,ProjectID  
Expected Returns: JSON Object with a key of Message  

Method: DELETE  
Required Parameters: SessionID,TaskID  
Expected Returns: JSON Object with a key of Message  

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
