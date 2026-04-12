import jsPDF from "jspdf";
import cvImage from "../../Image/Cv ko.png";

export function generateResume() {
  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.addImage(cvImage, "PNG", 0, 0, 210, 297);
    doc.save("Rhenmart_Dela_Cruz_Resume.pdf");
  } catch (err) {
    console.error("Failed to generate resume:", err);
    alert("Sorry, couldn't generate the resume. Please try again.");
  }
}
