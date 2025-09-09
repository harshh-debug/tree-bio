"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, Share2, QrCode, ExternalLink } from 'lucide-react';

interface QRCodeGeneratorProps {
  username: string;
}

const QRCodeGenerator = ({ username }: QRCodeGeneratorProps) => {
  const [url, setUrl] = useState('');
  const [size, setSize] = useState('200');
  const [errorLevel, setErrorLevel] = useState('M');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Get the full link on client side
  useEffect(() => {
    const origin = window.location.origin;
    const fullLink = `${origin}/${username}`;
    setUrl(fullLink);
  }, [username]);

  // Generate QR code using QR Server API
  const generateQRCode = async () => {
    if (!url.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&ecc=${errorLevel}&data=${encodeURIComponent(url)}`;
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;
    
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${username}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const copyToClipboard = async () => {
    setCopySuccess(false);
    
    if (!qrCodeUrl) return;
    
    try {
      // Try to copy the image first
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // Fallback: copy the URL instead
      try {
        await navigator.clipboard.writeText(url);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackError) {
        console.error('Error copying to clipboard:', fallbackError);
      }
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeUrl) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], `${username}-qr-code.png`, { type: 'image/png' });
        
        await navigator.share({
          title: `${username}'s Profile QR Code`,
          text: `Check out ${username}'s profile: ${url}`,
          files: [file]
        });
      } catch (error) {
        // Fallback to sharing just the URL
        try {
          await navigator.share({
            title: `${username}'s Profile`,
            text: `Check out ${username}'s profile: ${url}`,
            url: url
          });
        } catch (fallbackError) {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const openProfile = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
            Your Profile QR Code
          </CardTitle>
          <CardDescription className="text-sm">
            Generate a QR code that links directly to your public profile
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm">Profile URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Loading..."
                className="text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={openProfile}
                title="Open profile in new tab"
                className="flex-shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="size" className="text-sm">Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150x150</SelectItem>
                  <SelectItem value="200">200x200</SelectItem>
                  <SelectItem value="300">300x300</SelectItem>
                  <SelectItem value="400">400x400</SelectItem>
                  <SelectItem value="500">500x500</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="error-level" className="text-sm">Error Correction</Label>
              <Select value={errorLevel} onValueChange={setErrorLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateQRCode} 
            className="w-full"
            disabled={!url.trim() || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </CardContent>
      </Card>

      {qrCodeUrl && (
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm border">
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="block max-w-full h-auto"
                    style={{ 
                      width: `${Math.min(parseInt(size), 280)}px`, 
                      height: `${Math.min(parseInt(size), 280)}px`,
                      maxWidth: '100%'
                    }}
                  />
                </div>
              </div>

              {/* Mobile: Stacked buttons, Desktop: 3 columns */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQRCode}
                  className="flex-1 sm:flex-none justify-center h-10 sm:h-10"
                >
                  <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-none justify-center h-10 sm:h-10"
                >
                  <Copy className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className={copySuccess ? 'text-green-600' : ''}>
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareQRCode}
                  className="flex-1 sm:flex-none justify-center h-10 sm:h-10"
                >
                  <Share2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  Share
                </Button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  QR code links to:
                </p>
                <p className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded break-all">
                  {url}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRCodeGenerator;