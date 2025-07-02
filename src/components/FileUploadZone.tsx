
import React, { useCallback } from 'react';
import { Upload, File, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploadZoneProps {
  onFileUpload: (file: File) => void;
  isScanning: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ 
  onFileUpload, 
  isScanning 
}) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.eml'))) {
      onFileUpload(file);
    } else {
      console.warn('Invalid file type. Please upload HTML or email files.');
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Card className="bg-muted/50 border-dashed border-2 border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="text-center space-y-3 sm:space-y-4"
        >
          <div className="flex justify-center">
            <Upload className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Upload File for Analysis</h3>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Drag and drop your HTML or email files here, or click to browse
            </p>
          </div>
          
          <div className="flex justify-center">
            <label className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors inline-flex items-center space-x-2 text-sm sm:text-base touch-target">
              <File className="h-4 w-4" />
              <span>Choose File</span>
              <input
                type="file"
                className="hidden"
                accept=".html,.htm,.eml,.txt"
                onChange={handleFileInput}
                disabled={isScanning}
              />
            </label>
          </div>
          
          <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <div className="flex items-center justify-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>Supported formats: HTML, EML, TXT</span>
            </div>
            <div>Max file size: 10MB</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
