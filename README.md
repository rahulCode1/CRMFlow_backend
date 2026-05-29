# CRMFlow

An RESET API for leads management, where you can browse,  add, edit & view details of leads.
Built with  Express/Node backend, Mongodb database.

---

## Demo Link

[Live API](https://crm-flow-backend.vercel.app/api/leads)

---

## Quick Start

```
git clone  https://github.com/rahulCode1/CRMFlow_backend.git
cd backend
npm install
npm start
```

## Technologies

- Node JS
- Express
- Mongodb


---

## Features


- Display list of all leads.
- Add new lead.
- Get all sales agent.
- Add new Sales agent.
- Manage sales agent & leads.


---

## Environment Variables
```
PORT=80
MONGODB=XXXXXXXXXXXXXXXXXXX
```

---



## API Reference

### **GET api/leads**

List of all leads
Sample Response

```
[{id, name, source, ...}, ...]
```

### **POST api/lead**<br>

Add new Lead
Sample Response

```
{id, name, source...}
```

### **GET api/lead/id**<br>

Lead details
Sample Response

```
{id, name, source...}
```

### **PATCH api/lead/id**<br>

Edit lead
Sample Response

```
{id, name, source...}
```

### **DELETE api/lead/id**<br>

Delete lead

### **POST api/lead/id/comments**<br>

Add comment on lead
Sample Response

```
{id, author, commentText, ...}
```

### **GET api/lead/id/comments**<br>

Get all comments
Sample Response

```
[{id, author, commentText, ...}, ...]
```

### **GET api/report/last-week**<br>

Get leads closed last week
Sample Response

```
{id, name, salesAgent, ...}
```

### **GET api/report/pipeline**<br>

Get active or closed lead.
Sample Response

```
{activeLeads, closedLeads}
```

### **GET api/report/closed-by-agent**<br>

Get lead closed by agent.
Sample Response

```
[
    {
        agent: [
            {
                id, name, status, ...
            }
        ]
    }
]
```

## **POST api/agent**<br>

Add new sales agent
Sample response

```
{name, email}
```

## **GET api/agent**<br>

Get all sales agent
Sample response

```
[{name, email}, ...]
```

## **DELETE api/agent/id**<br>

Delete sales agent
Sample response

## Contact

For bugs or feature requests, please reach out to rahulkumawat50665@gmail.com
