import React from 'react';
import { AlertTriangle, Shield, CheckCircle, Brain, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface ThreatAnalysisResultProps {
  result: any;
  onDownloadReport: () => void;
}

export const ThreatAnalysisResult: React.FC<ThreatAnalysisResultProps> = ({ 
  result, 
  onDownloadReport 
}) => {
  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBadgeColor = (category: string) => {
    const colors = {
      'CRITICAL': 'bg-red-500/20 text-red-400 border-red-500/30',
      'HIGH': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'MEDIUM': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'LOW': 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return colors[category] || colors['LOW'];
  };

  const getRiskIcon = (category: string) => {
    if (category === 'CRITICAL' || category === 'HIGH') {
      return <AlertTriangle className="h-5 w-5" />;
    }
    if (category === 'MEDIUM') {
      return <Shield className="h-5 w-5" />;
    }
    return <CheckCircle className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Main Threat Score */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getRiskIcon(result.riskCategory)}
              <span>Threat Analysis Report</span>
            </div>
            <Badge className={getRiskBadgeColor(result.riskCategory)}>
              {result.riskCategory} RISK
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className={`text-6xl font-bold ${getRiskColor(result.threatScore)}`}>
                {result.threatScore}
              </div>
              <div className="text-slate-400 text-sm">/ 100 Threat Score</div>
            </div>
            <Progress 
              value={result.threatScore} 
              className="h-3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-cyan-400" />
                Detection Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target URL:</span>
                  <span className="text-white break-all">{result.url}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scan Date:</span>
                  <span className="text-white">{result.scanDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Processing Time:</span>
                  <span className="text-white">{result.processingTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recommendation:</span>
                  <span className={getRiskColor(result.threatScore)}>
                    {result.recommendation}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-3">Detection Methods</h4>
              <div className="space-y-2">
                {result.detectionMethods.map((method: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{method.name}</span>
                    <Badge 
                      variant={method.result === 'PASS' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {method.result}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span>AI Security Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-300 leading-relaxed">
              {result.aiAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Threat Indicators */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Detailed Threat Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-red-400 font-semibold mb-3">🚨 Risk Factors Found</h4>
              <div className="space-y-2">
                {result.riskFactors.map((factor: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-green-400 font-semibold mb-3">✅ Security Features</h4>
              <div className="space-y-2">
                {result.securityFeatures.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Technical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="text-cyan-400 font-medium mb-2">Domain Analysis</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Domain Age:</span>
                  <span className="text-white">{result.technicalDetails.domainAge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SSL Status:</span>
                  <span className={result.technicalDetails.sslStatus === 'Valid' ? 'text-green-400' : 'text-red-400'}>
                    {result.technicalDetails.sslStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reputation:</span>
                  <span className={result.technicalDetails.reputation === 'Good' ? 'text-green-400' : 'text-red-400'}>
                    {result.technicalDetails.reputation}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-cyan-400 font-medium mb-2">Content Analysis</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Suspicious Scripts:</span>
                  <span className="text-white">{result.technicalDetails.suspiciousScripts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hidden iFrames:</span>
                  <span className="text-white">{result.technicalDetails.hiddenIframes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Form Security:</span>
                  <span className={result.technicalDetails.formSecurity === 'Secure' ? 'text-green-400' : 'text-red-400'}>
                    {result.technicalDetails.formSecurity}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-cyan-400 font-medium mb-2">Network Info</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">IP Location:</span>
                  <span className="text-white">{result.technicalDetails.ipLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Redirects:</span>
                  <span className="text-white">{result.technicalDetails.redirects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Response Time:</span>
                  <span className="text-white">{result.technicalDetails.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
