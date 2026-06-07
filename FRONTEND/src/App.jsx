import "./App.css"
import axios from "axios"
import { useState } from "react"
import * as XLSX from "xlsx"


function App() {

  const [msg, setMsg] = useState("")
  const [subject, setSubject] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("")
  const [totalEmails, setTotalEmails] = useState(0);
  const [emailList, setEmailList] = useState([]);

  function handlemsg(e) {
    setMsg(e.target.value)
  }

  function handlesend() {
    setLoading(true)
    setStatus("Sending emails...")
    console.log(emailList);
    axios.post("https://bulkmail-app-72v8.onrender.com/send-emails",
       { message: msg, subject: subject, emailList: emailList })
      .then(function () {
        setTimeout(() => {
          setLoading(false)
          setStatus("✅ Emails sent successfully!")
          setMsg("")
          setSubject("")
        }, 2000)
      })
      .catch(function () {
        console.log("Error sending emails")
        setLoading(false)
        setStatus("Error sending emails")
      })
  }

  function handleFileChange(e) {
  const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=(e)=>{
        const data=e.target.result;
        const workbook=XLSX.read(data,{type:'binary'});
        const sheet=workbook.Sheets[workbook.SheetNames[0]];
        const json=XLSX.utils.sheet_to_json(sheet);
        const emails = json.map(item => item.EMAIL);
        setEmailList(emails);
        const totalEmails=json.length;
        setTotalEmails(totalEmails);
        console.log(json);
    };
    reader.readAsBinaryString(file);
  } 

  return (
    <>
      <div className="container">
        <div className="header">
          <h1>EasyMail.com</h1>
          <p>Send bulk emails with ease using our user-friendly interface.</p>
        </div>
        <div className="upload-section">
          <input type="text" placeholder="Enter your email subject here..." className="subject-input" onChange={(e)=>setSubject(e.target.value)}/>
          <textarea onChange={handlemsg} value={msg} placeholder="Enter your email content here..." rows="10" cols="50"></textarea>
          <div className="upload-area">
            <p>Drag and drop your files here or click to select files</p>
            <input type="file" multiple onChange={handleFileChange}  accept=".xlsx,.xls,.csv" className="upload-input" />
          </div>
          <p>total emails in the file: {totalEmails}</p>
          <button onClick={handlesend} disabled={loading} className="send-btn">
            {
              loading ? <div className="spinner"></div>
                : "Send Emails"
            }
          </button>
          <p className="status">{status}</p>
        </div>
      </div>
    </>
  )
}

export default App
