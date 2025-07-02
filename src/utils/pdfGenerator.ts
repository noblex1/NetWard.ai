
import jsPDF from 'jspdf';

export const generateThreatReportPDF = (result: any) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let yPosition = 30;

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * fontSize * 0.6);
  };

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LinkGuardian AI - Threat Analysis Report', margin, yPosition);
  
  yPosition += 20;
  doc.setDrawColor(0, 150, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Main threat score
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`Threat Score: ${result.threatScore}/100`, margin, yPosition);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const riskColor: [number, number, number] = result.threatScore >= 80 ? [255, 0, 0] : result.threatScore >= 50 ? [255, 165, 0] : [0, 128, 0];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`Risk Category: ${result.riskCategory} RISK`, margin + 100, yPosition);
  doc.setTextColor(0, 0, 0);
  
  yPosition += 20;

  // Detection Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detection Summary', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Target URL: ${result.url}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Scan Date: ${result.scanDate}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Processing Time: ${result.processingTime}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Recommendation: ${result.recommendation}`, margin, yPosition);
  yPosition += 15;

  // AI Analysis
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Security Analysis', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addWrappedText(result.aiAnalysis, margin, yPosition, pageWidth - 2 * margin);
  yPosition += 10;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 30;
  }

  // Risk Factors
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 0, 0);
  doc.text('Risk Factors Found', margin, yPosition);
  doc.setTextColor(0, 0, 0);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  result.riskFactors.forEach((factor: string) => {
    yPosition = addWrappedText(`• ${factor}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 2;
  });
  yPosition += 10;

  // Security Features
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 128, 0);
  doc.text('Security Features', margin, yPosition);
  doc.setTextColor(0, 0, 0);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  result.securityFeatures.forEach((feature: string) => {
    yPosition = addWrappedText(`• ${feature}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 2;
  });
  yPosition += 15;

  // Technical Details
  if (yPosition > 220) {
    doc.addPage();
    yPosition = 30;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Analysis', margin, yPosition);
  yPosition += 15;

  // Domain Analysis
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Domain Analysis', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Domain Age: ${result.technicalDetails.domainAge}`, margin, yPosition);
  yPosition += 6;
  doc.text(`SSL Status: ${result.technicalDetails.sslStatus}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Reputation: ${result.technicalDetails.reputation}`, margin, yPosition);
  yPosition += 12;

  // Content Analysis
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Content Analysis', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Suspicious Scripts: ${result.technicalDetails.suspiciousScripts}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Hidden iFrames: ${result.technicalDetails.hiddenIframes}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Form Security: ${result.technicalDetails.formSecurity}`, margin, yPosition);
  yPosition += 12;

  // Network Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Network Information', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`IP Location: ${result.technicalDetails.ipLocation}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Redirects: ${result.technicalDetails.redirects}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Response Time: ${result.technicalDetails.responseTime}`, margin, yPosition);

  // Footer
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated by LinkGuardian AI - Page ${i} of ${pageCount}`, margin, doc.internal.pageSize.height - 10);
    doc.text(`Report generated on ${new Date().toLocaleString()}`, pageWidth - 80, doc.internal.pageSize.height - 10);
  }

  return doc;
};
