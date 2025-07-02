
import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Upload, Download, Eye, Zap, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThreatAnalysisResult } from './ThreatAnalysisResult';
import { FileUploadZone } from './FileUploadZone';
import { ThemeToggle } from './ThemeToggle';
import { useThreatDetection } from '../hooks/useThreatDetection';
import { generateThreatReportPDF } from '../utils/pdfGenerator';

const ThreatScanner = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const { analyzeUrl, analyzeFile } = useThreatDetection();

  const handleUrlScan = async () => {
    if (!url.trim()) return;
    
    setIsScanning(true);
    console.log('Starting URL analysis for:', url);
    
    try {
      const result = await analyzeUrl(url);
      setAnalysisResult(result);
      console.log('Analysis complete:', result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileScan = async (file: File) => {
    setIsScanning(true);
    console.log('Starting file analysis for:', file.name);
    
    try {
      const result = await analyzeFile(file);
      setAnalysisResult(result);
      console.log('File analysis complete:', result);
    } catch (error) {
      console.error('File analysis failed:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!analysisResult) return;
    
    const pdf = generateThreatReportPDF(analysisResult);
    const fileName = `threat-report-${Date.now()}.pdf`;
    pdf.save(fileName);
  };

  const handleDownloadJSON = () => {
    if (!analysisResult) return;
    
    const dataStr = JSON.stringify(analysisResult, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `threat-report-${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-colors duration-300">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                LinkGuardian AI
              </h1>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Advanced AI-Powered Phishing & Threat Detection System
            </p>
          </div>

          {/* Main Scanner */}
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground flex items-center space-x-2 text-lg sm:text-xl">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <span>Threat Analysis Engine</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted h-9 sm:h-10">
                  <TabsTrigger value="url" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                    URL Scanner
                  </TabsTrigger>
                  <TabsTrigger value="file" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">
                    File Upload
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="url" className="space-y-4 mt-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Input
                      placeholder="Enter URL to analyze (e.g., https://suspicious-site.com)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 bg-background border-input text-foreground placeholder-muted-foreground h-10 sm:h-11 text-sm sm:text-base"
                      disabled={isScanning}
                    />
                    <Button 
                      onClick={handleUrlScan}
                      disabled={isScanning || !url.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
                    >
                      {isScanning ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                          <span className="hidden sm:inline">Scanning...</span>
                          <span className="sm:hidden">Scan...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Deep Scan</span>
                          <span className="sm:hidden">Scan</span>
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="file" className="mt-4">
                  <FileUploadZone onFileUpload={handleFileScan} isScanning={isScanning} />
                </TabsContent>
              </Tabs>

              {isScanning && (
                <div className="mt-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-primary">
                      <div className="animate-pulse h-2 w-2 sm:h-3 sm:w-3 bg-primary rounded-full" />
                      <span className="text-sm sm:text-base">Analyzing threat patterns...</span>
                    </div>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span>Heuristic Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                      <span>Blacklist Check</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-primary" />
                      <span>AI Analysis</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {analysisResult && (
            <>
              <ThreatAnalysisResult 
                result={analysisResult} 
                onDownloadReport={handleDownloadJSON}
              />
              
              {/* Download Options */}
              <Card className="bg-card/50 border-border backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
                    <Button 
                      onClick={handleDownloadPDF}
                      className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white h-10 sm:h-11 text-sm sm:text-base"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Download PDF Report</span>
                      <span className="sm:hidden">PDF Report</span>
                    </Button>
                    <Button 
                      onClick={handleDownloadJSON}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-10 sm:h-11 text-sm sm:text-base"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Download JSON Data</span>
                      <span className="sm:hidden">JSON Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-primary">24,891</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Threats Blocked</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-500">99.7%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Detection Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-500">1,234</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Monitors</div>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border">
              <CardContent className="p-3 sm:p-4 text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-500">0.3s</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Avg Scan Time</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatScanner;
