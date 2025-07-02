
import { useState } from 'react';

export interface ThreatAnalysisResult {
  url: string;
  threatScore: number;
  riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
  scanDate: string;
  processingTime: string;
  aiAnalysis: string;
  riskFactors: string[];
  securityFeatures: string[];
  detectionMethods: Array<{
    name: string;
    result: 'PASS' | 'FAIL' | 'WARNING';
  }>;
  technicalDetails: {
    domainAge: string;
    sslStatus: string;
    reputation: string;
    suspiciousScripts: string;
    hiddenIframes: string;
    formSecurity: string;
    ipLocation: string;
    redirects: string;
    responseTime: string;
  };
}

export const useThreatDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate threat database (in real app, this would be from external APIs)
  const knownThreats = [
    'phishing-example.com',
    'suspicious-bank.net',
    'fake-paypal.org',
    'malware-site.biz',
    'scam-lottery.info'
  ];

  const suspiciousPatterns = [
    /bit\.ly|tinyurl|t\.co/i, // URL shorteners
    /urgent|act now|limited time|verify account/i, // Phishing language
    /paypal|amazon|microsoft|google/i, // Brand impersonation
    /click here|download now|free money/i, // Suspicious calls to action
  ];

  const analyzeUrl = async (url: string): Promise<ThreatAnalysisResult> => {
    return new Promise((resolve) => {
      // Simulate analysis delay
      setTimeout(() => {
        const analysis = performThreatAnalysis(url);
        resolve(analysis);
      }, 2000 + Math.random() * 2000); // 2-4 seconds
    });
  };

  const analyzeFile = async (file: File): Promise<ThreatAnalysisResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTimeout(() => {
          const analysis = performFileAnalysis(file.name, content);
          resolve(analysis);
        }, 1500 + Math.random() * 2000);
      };
      reader.readAsText(file);
    });
  };

  const performThreatAnalysis = (url: string): ThreatAnalysisResult => {
    console.log('Performing threat analysis for URL:', url);
    
    let threatScore = 0;
    const riskFactors: string[] = [];
    const securityFeatures: string[] = [];
    const detectionMethods = [];

    // Heuristic Analysis
    const domain = extractDomain(url);
    
    // Check against known threats
    const isKnownThreat = knownThreats.some(threat => domain.includes(threat));
    if (isKnownThreat) {
      threatScore += 80;
      riskFactors.push('Domain found in threat database');
    }
    detectionMethods.push({
      name: 'Blacklist Check',
      result: isKnownThreat ? 'FAIL' : 'PASS'
    });

    // Check suspicious patterns
    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => pattern.test(url));
    if (hasSuspiciousPattern) {
      threatScore += 30;
      riskFactors.push('Contains suspicious keywords or patterns');
    }

    // HTTPS check
    const hasHttps = url.toLowerCase().startsWith('https://');
    if (!hasHttps) {
      threatScore += 25;
      riskFactors.push('Uses insecure HTTP protocol');
    } else {
      securityFeatures.push('Uses secure HTTPS protocol');
    }
    detectionMethods.push({
      name: 'SSL/TLS Check',
      result: hasHttps ? 'PASS' : 'FAIL'
    });

    // Domain age simulation (would be real API call)
    const domainAge = Math.random() > 0.7 ? 'New (< 30 days)' : 'Established (> 1 year)';
    if (domainAge.includes('New')) {
      threatScore += 20;
      riskFactors.push('Domain registered recently');
    } else {
      securityFeatures.push('Domain has established history');
    }

    // URL shortener check
    if (/bit\.ly|tinyurl|t\.co|short\.link/i.test(url)) {
      threatScore += 15;
      riskFactors.push('Uses URL shortening service');
    }

    // Suspicious TLD check
    if (/\.tk|\.ml|\.ga|\.cf|\.info|\.biz$/i.test(domain)) {
      threatScore += 10;
      riskFactors.push('Uses potentially suspicious top-level domain');
    }

    detectionMethods.push({
      name: 'Heuristic Analysis',
      result: threatScore > 30 ? 'FAIL' : 'PASS'
    });

    detectionMethods.push({
      name: 'ML Anomaly Detection',
      result: Math.random() > 0.8 ? 'WARNING' : 'PASS'
    });

    // Add some positive security features
    if (Math.random() > 0.5) {
      securityFeatures.push('Domain has valid WHOIS information');
    }
    if (Math.random() > 0.6) {
      securityFeatures.push('No suspicious redirects detected');
    }

    // Determine risk category
    let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    let recommendation: string;

    if (threatScore >= 80) {
      riskCategory = 'CRITICAL';
      recommendation = 'DO NOT VISIT - High phishing/malware risk detected';
    } else if (threatScore >= 50) {
      riskCategory = 'HIGH';
      recommendation = 'Avoid this link - Multiple risk factors identified';
    } else if (threatScore >= 25) {
      riskCategory = 'MEDIUM';
      recommendation = 'Exercise caution - Some risk factors present';
    } else {
      riskCategory = 'LOW';
      recommendation = 'Generally safe to visit with normal precautions';
    }

    // Generate AI analysis
    const aiAnalysis = generateAIAnalysis(url, threatScore, riskFactors, riskCategory);

    return {
      url,
      threatScore: Math.min(threatScore, 100),
      riskCategory,
      recommendation,
      scanDate: new Date().toLocaleString(),
      processingTime: `${(Math.random() * 2 + 0.5).toFixed(1)}s`,
      aiAnalysis,
      riskFactors,
      securityFeatures,
      detectionMethods,
      technicalDetails: {
        domainAge,
        sslStatus: hasHttps ? 'Valid' : 'Missing/Invalid',
        reputation: threatScore > 50 ? 'Poor' : 'Good',
        suspiciousScripts: Math.random() > 0.7 ? 'Detected' : 'None',
        hiddenIframes: Math.random() > 0.8 ? 'Found' : 'None',
        formSecurity: Math.random() > 0.6 ? 'Secure' : 'Unsecured',
        ipLocation: ['US', 'Russia', 'China', 'Netherlands', 'Germany'][Math.floor(Math.random() * 5)],
        redirects: Math.floor(Math.random() * 3).toString(),
        responseTime: `${(Math.random() * 500 + 100).toFixed(0)}ms`
      }
    };
  };

  const performFileAnalysis = (fileName: string, content: string): ThreatAnalysisResult => {
    console.log('Performing file analysis for:', fileName);
    
    let threatScore = 0;
    const riskFactors: string[] = [];
    const securityFeatures: string[] = [];

    // Check for suspicious HTML patterns
    if (/<script.*?>.*?<\/script>/is.test(content)) {
      const scriptMatches = content.match(/<script.*?>.*?<\/script>/gis);
      if (scriptMatches && scriptMatches.length > 5) {
        threatScore += 20;
        riskFactors.push(`Contains ${scriptMatches.length} script tags (potentially excessive)`);
      }
    }

    // Check for iframe injections
    if (/<iframe/i.test(content)) {
      threatScore += 30;
      riskFactors.push('Contains embedded iframes (potential malware injection)');
    }

    // Check for suspicious form actions
    const formMatches = content.match(/action\s*=\s*["']([^"']+)["']/gi);
    if (formMatches) {
      formMatches.forEach(match => {
        if (!/^https:/i.test(match)) {
          threatScore += 25;
          riskFactors.push('Form submits to insecure endpoint');
        }
      });
    }

    // Check for phishing keywords
    const phishingKeywords = /verify.*account|suspended.*account|urgent.*action|click.*here.*immediately/i;
    if (phishingKeywords.test(content)) {
      threatScore += 35;
      riskFactors.push('Contains typical phishing language patterns');
    }

    // Check for brand impersonation
    const brandKeywords = /paypal|amazon|microsoft|google|apple|netflix|spotify/i;
    if (brandKeywords.test(content)) {
      threatScore += 15;
      riskFactors.push('Potentially impersonating well-known brands');
    }

    if (threatScore === 0) {
      securityFeatures.push('No obvious malicious patterns detected');
      securityFeatures.push('Content appears to follow standard practices');
    }

    const riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 
      threatScore >= 80 ? 'CRITICAL' :
      threatScore >= 50 ? 'HIGH' :
      threatScore >= 25 ? 'MEDIUM' : 'LOW';

    const recommendation = 
      threatScore >= 80 ? 'DO NOT OPEN - High risk email/file detected' :
      threatScore >= 50 ? 'Quarantine recommended - Multiple threats found' :
      threatScore >= 25 ? 'Review carefully before opening' :
      'File appears safe for normal handling';

    return {
      url: fileName,
      threatScore: Math.min(threatScore, 100),
      riskCategory,
      recommendation,
      scanDate: new Date().toLocaleString(),
      processingTime: `${(Math.random() * 1.5 + 0.3).toFixed(1)}s`,
      aiAnalysis: generateFileAIAnalysis(fileName, threatScore, riskFactors, riskCategory),
      riskFactors,
      securityFeatures,
      detectionMethods: [
        { name: 'Content Analysis', result: threatScore > 30 ? 'FAIL' : 'PASS' },
        { name: 'Script Inspection', result: threatScore > 20 ? 'WARNING' : 'PASS' },
        { name: 'Phishing Detection', result: threatScore > 40 ? 'FAIL' : 'PASS' }
      ],
      technicalDetails: {
        domainAge: 'N/A (File Analysis)',
        sslStatus: 'N/A',
        reputation: 'File-based scan',
        suspiciousScripts: /<script/i.test(content) ? 'Found' : 'None',
        hiddenIframes: /<iframe/i.test(content) ? 'Found' : 'None',
        formSecurity: /action.*https/i.test(content) ? 'Secure' : 'Unsecured',
        ipLocation: 'N/A',
        redirects: 'N/A',
        responseTime: 'N/A'
      }
    };
  };

  const extractDomain = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const generateAIAnalysis = (
    url: string, 
    score: number, 
    risks: string[], 
    category: string
  ): string => {
    const templates = {
      LOW: [
        `Based on my analysis, "${url}" appears to be a legitimate website with minimal security concerns. The site uses standard security practices and shows no obvious signs of malicious intent.`,
        `This URL shows positive security indicators and follows web security best practices. While no site is 100% risk-free, this appears to be safe for normal browsing.`
      ],
      MEDIUM: [
        `The URL "${url}" shows some concerning patterns that warrant caution. While not definitively malicious, ${risks[0]?.toLowerCase() || 'certain risk factors'} suggest you should verify the site's legitimacy before providing any sensitive information.`,
        `This website displays mixed security signals. I recommend exercising caution and avoiding entering personal information unless you can independently verify the site's authenticity.`
      ],
      HIGH: [
        `I've detected multiple red flags for "${url}" that strongly suggest this is a potentially dangerous site. The combination of ${risks.slice(0, 2).join(' and ').toLowerCase()} are common indicators of phishing or malware distribution.`,
        `This URL exhibits several characteristics typical of malicious websites. I strongly advise against visiting this site, as it poses significant security risks.`
      ],
      CRITICAL: [
        `WARNING: "${url}" appears to be a highly dangerous website with multiple critical threat indicators. This site shows clear signs of being designed for malicious purposes such as credential theft, malware distribution, or financial fraud.`,
        `This is almost certainly a malicious website designed to harm visitors. The URL contains known threat patterns and should be avoided completely.`
      ]
    };

    const categoryTemplates = templates[category as keyof typeof templates] || templates.LOW;
    return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  };

  const generateFileAIAnalysis = (
    fileName: string,
    score: number,
    risks: string[],
    category: string
  ): string => {
    if (category === 'LOW') {
      return `The file "${fileName}" appears to be clean with no obvious malicious indicators. The content follows standard formatting practices and contains no suspicious elements that would indicate malicious intent.`;
    }
    
    if (category === 'MEDIUM') {
      return `Analysis of "${fileName}" reveals some concerning patterns that suggest caution. ${risks[0] || 'Certain elements'} could potentially be used for malicious purposes, though this may also be legitimate functionality.`;
    }
    
    if (category === 'HIGH') {
      return `The file "${fileName}" contains multiple suspicious elements commonly found in malicious emails or documents. The presence of ${risks.slice(0, 2).join(' and ').toLowerCase()} suggests this could be a phishing attempt or contain malware.`;
    }
    
    return `CRITICAL ALERT: "${fileName}" contains highly suspicious content that strongly indicates malicious intent. This file exhibits multiple characteristics of advanced phishing or malware campaigns and should be immediately quarantined.`;
  };

  return {
    analyzeUrl,
    analyzeFile,
    isAnalyzing
  };
};
