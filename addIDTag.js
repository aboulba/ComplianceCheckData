const fs = require("fs");
const path = require("path");
const basicXMLFile = "D:/2023_SP0_Beta/energyAnalysis/Beta_ComplianceCheckData.xml";
const FR_XMLFile = "D:/2023_SP0_Beta/energyAnalysis/FR_ComplianceCheckData.xml";
const PL_XMLFile = "D:/2023_SP0_Beta/energyAnalysis/PL_ComplianceCheckData.xml";
const NL_XMLFile = "D:/2023_SP0_Beta/energyAnalysis/NL_ComplianceCheckData.xml";

const FR_XMLFile_res = "D:/2023_SP0_Beta/energyAnalysis/FR_ComplianceCheckData_res.xml";
const PL_XMLFile_res = "D:/2023_SP0_Beta/energyAnalysis/PL_ComplianceCheckData_res.xml";
const NL_XMLFile_res = "D:/2023_SP0_Beta/energyAnalysis/NL_ComplianceCheckData_res.xml";

let basicXMLFileArray;
let FR_XMLFileArray;
let PL_XMLFileArray;
let NL_XMLFileArray;

const loadXMLINArray = function(XMLPath ) {
    return new Promise((resolve, reject) => {
        fs.readFile(XMLPath, (err, data) =>{
          let readedFileArray;
          if(err) throw err;
          data = data.toString().replace(/(\r)/gm,"");
          readedFileArray = data.toString().split("\n");
          resolve(readedFileArray);
        })
      });
}

const writeToFile = function(filename,writeArray ){
    let logger = fs.createWriteStream(filename);
    writeArray.forEach(elment => {
      logger.write( elment +'\r\n');
    });
    logger.end(); 
    console.log("done writing to file: ",filename);
}


let Pbasic = loadXMLINArray(basicXMLFile).then(array =>{
    basicXMLFileArray = array.filter(e => String(e).trim());
    console.log("basic done convert to array");
});
let Pfr = loadXMLINArray(FR_XMLFile).then(array =>{
    FR_XMLFileArray = array.filter(e => String(e).trim());
    console.log("FR done convert to array");
});
let Pnl = loadXMLINArray(NL_XMLFile).then(array =>{
    NL_XMLFileArray = array.filter(e => String(e).trim());
    console.log("NL done convert to array");
});
let Ppl = loadXMLINArray(PL_XMLFile).then(array =>{
    PL_XMLFileArray = array.filter(e => String(e).trim());
    console.log("PL done convert to array");
});

Promise.all([Pbasic,Pfr,Pnl,Ppl]).then(val=>{
    console.log("ALL done convert to array");
    basicXMLFileArray.forEach((elm,index) => {
        if(elm.includes("ComplianceCheck name=") && elm.includes("id="))
        {
            FR_XMLFileArray[index] = FR_XMLFileArray[index].replace('>', ' ') +  elm.substring(elm.indexOf("id="),elm.length);
            NL_XMLFileArray[index] = NL_XMLFileArray[index].replace('>', ' ') +  elm.substring(elm.indexOf("id="),elm.length);
            PL_XMLFileArray[index] = PL_XMLFileArray[index].replace('>', ' ') +  elm.substring(elm.indexOf("id="),elm.length);
        }

    });
    writeToFile(FR_XMLFile_res,FR_XMLFileArray);
    writeToFile(NL_XMLFile_res,NL_XMLFileArray);
    writeToFile(PL_XMLFile_res,PL_XMLFileArray);
});
