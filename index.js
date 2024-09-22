
// add button to learnpress dashboard nav item 
const para = document.createElement("li");
const node = document.createElement("button");
node.id = "generate_master_cer";
node.innerHTML = "Download Master Certificate";
para.appendChild(node);

const element = document.querySelector("#profile-nav .lp-profile-nav-tabs");
if(mcg_data.passed_course){
  element.appendChild(para);

    const submitBtn = document.getElementById("generate_master_cer");
    const { PDFDocument, rgb, degrees } = PDFLib;


    submitBtn.addEventListener("click", () => {
        const val = mcg_data.user_fullname;
        if (val.trim() !== "" ) {
            // console.log(val);
            generatePDF(val, mcg_data.start_date);
        } else {
            userName.reportValidity();
        }
        console.log('clicked to generate certificate')
    });
    const generatePDF = async (name, date) => {
        const existingPdfBytes = await fetch("http://caregivercourses.local/wp-content/uploads/2023/10/Master-Caregiver-Certificate.pdf").then((res) =>
        res.arrayBuffer()
        );

        // Load a PDFDocument from the existing PDF bytes
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        pdfDoc.registerFontkit(fontkit);

        
        //get font
        const fontBytes = await fetch(mcg_data.plugin_url + "/Sanchez-Regular.ttf").then((res) =>
        res.arrayBuffer()
        );
        // Embed our custom font in the document
        const SanChezFont  = await pdfDoc.embedFont(fontBytes);
        // Get the first page of the document
        
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const textWidth = SanChezFont.widthOfTextAtSize(name, 30);
        // Draw a string of text diagonally across the first page
        firstPage.drawText(name, {
            x: firstPage.getWidth() / 2 - textWidth/2 + 20,
            y: 290,
            size: 25,
            // font: SanChezFont ,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText('Caregiver Master Certificate', {
            x: 275,
            y: 220,
            size: 24,
            // font: SanChezFont ,
            color: rgb(0, 0, 0),
        });
        firstPage.drawText(date, {
            x: 334,
            y: 155,
            size: 24,
            // font: SanChezFont ,
            color: rgb(0, 0, 0),
        });
        
        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        saveAs(pdfDataUri,"newcertificate.pdf")
    };

}
