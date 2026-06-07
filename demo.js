const fileinput=document.getElementById('fileInput');
fileinput.addEventListener('change',(e)=>{
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=(e)=>{
        const data=e.target.result;
        const workbook=XLSX.read(data,{type:'binary'});
        const sheet=workbook.Sheets[workbook.SheetNames[0]];
        const json=XLSX.utils.sheet_to_json(sheet);
        console.log(json);
    };
    reader.readAsBinaryString(file);
});