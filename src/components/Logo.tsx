
import React, { useRef } from 'react';
import { Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface LogoProps {
  downloadable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  downloadFormat?: 'svg' | 'jpeg';
}

const Logo: React.FC<LogoProps> = ({ downloadable = true, size = 'md', downloadFormat = 'svg' }) => {
  const logoRef = useRef<SVGSVGElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);

  const sizes = {
    sm: { logoSize: 24, fontSize: 'text-base', padding: 'p-2' },
    md: { logoSize: 32, fontSize: 'text-xl', padding: 'p-3' },
    lg: { logoSize: 48, fontSize: 'text-2xl', padding: 'p-4' },
    xl: { logoSize: 64, fontSize: 'text-3xl', padding: 'p-5' },
  };

  const { logoSize, fontSize, padding } = sizes[size];

  const downloadLogo = () => {
    if (!logoRef.current && !logoContainerRef.current) return;

    if (downloadFormat === 'svg') {
      // SVG içeriği
      const svgElement = logoRef.current.cloneNode(true) as SVGSVGElement;
      
      // SVG'yi temizle ve boyutlandır
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgElement.setAttribute('width', `${logoSize * 3}`);
      svgElement.setAttribute('height', `${logoSize * 3}`);
      
      // SVG içeriğine yazı ekle
      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('x', `${logoSize + 10}`);
      foreignObject.setAttribute('y', '0');
      foreignObject.setAttribute('width', `${logoSize * 2}`);
      foreignObject.setAttribute('height', `${logoSize}`);
      
      const div = document.createElement('div');
      div.innerHTML = 'Robotik Okulu';
      div.style.fontWeight = 'bold';
      div.style.fontSize = `${logoSize/2}px`;
      div.style.fontFamily = 'Inter, sans-serif';
      div.style.color = '#1E40AF'; // primary renk
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.height = '100%';
      
      foreignObject.appendChild(div);
      svgElement.appendChild(foreignObject);
      
      // SVG'yi string olarak al
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      
      // Base64 kodlama
      const svgBase64 = btoa(unescape(encodeURIComponent(svgString)));
      const dataUri = `data:image/svg+xml;base64,${svgBase64}`;
      
      // İndirme işlemi
      const link = document.createElement('a');
      link.href = dataUri;
      link.download = 'robotik-okulu-logo.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Logo SVG olarak indirildi!');
    } else if (downloadFormat === 'jpeg') {
      if (!logoContainerRef.current) return;
      
      // Canvas oluştur
      const canvas = document.createElement('canvas');
      const containerWidth = logoSize * 4; // Logo ve yazı için gereken genişlik
      const containerHeight = logoSize * 2; // Yükseklik
      
      canvas.width = containerWidth;
      canvas.height = containerHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast.error('Canvas oluşturulamadı.');
        return;
      }
      
      // Arka planı beyaz yap
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, containerWidth, containerHeight);
      
      // Logo arka plan çemberi
      ctx.beginPath();
      ctx.fillStyle = 'rgba(30, 64, 175, 0.1)'; // primary/10 renk
      ctx.arc(logoSize, containerHeight/2, logoSize, 0, 2 * Math.PI);
      ctx.fill();
      
      // SVG'yi çiz
      const img = new Image();
      img.onload = () => {
        // Logo ikonu
        ctx.drawImage(img, logoSize/2, containerHeight/2 - logoSize/2, logoSize, logoSize);
        
        // Yazıyı ekle
        ctx.font = `bold ${logoSize/2}px Inter, sans-serif`;
        ctx.fillStyle = '#1E40AF'; // primary renk
        ctx.fillText('Robotik Okulu', logoSize * 1.5, containerHeight/2 + logoSize/6);
        
        // JPEG olarak indir
        const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'robotik-okulu-logo.jpeg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Logo JPEG olarak indirildi!');
      };
      
      // Lucide-react Cpu ikonu için basit bir SVG oluştur
      const cpuSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${logoSize}" height="${logoSize}" viewBox="0 0 24 24" fill="none" stroke="#1E40AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
          <rect x="9" y="9" width="6" height="6"></rect>
          <line x1="9" y1="1" x2="9" y2="4"></line>
          <line x1="15" y1="1" x2="15" y2="4"></line>
          <line x1="9" y1="20" x2="9" y2="23"></line>
          <line x1="15" y1="20" x2="15" y2="23"></line>
          <line x1="20" y1="9" x2="23" y2="9"></line>
          <line x1="20" y1="14" x2="23" y2="14"></line>
          <line x1="1" y1="9" x2="4" y2="9"></line>
          <line x1="1" y1="14" x2="4" y2="14"></line>
        </svg>
      `;
      
      const svgBlob = new Blob([cpuSvg], { type: 'image/svg+xml' });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.src = svgUrl;
    }
  };

  return (
    <div className="flex flex-col items-center" ref={logoContainerRef}>
      <div className="flex items-center">
        <div className={`bg-primary/10 rounded-full ${padding} flex items-center justify-center`}>
          <Cpu
            ref={logoRef}
            className="text-primary"
            size={logoSize}
            strokeWidth={2}
          />
        </div>
        <span className={`${fontSize} font-semibold ml-2`}>Robotik Okulu</span>
      </div>
      
      {downloadable && (
        <Button 
          onClick={downloadLogo} 
          variant="outline" 
          size="sm" 
          className="mt-4 flex items-center gap-2"
        >
          <Download size={16} />
          Logo İndir ({downloadFormat.toUpperCase()})
        </Button>
      )}
    </div>
  );
};

export default Logo;
