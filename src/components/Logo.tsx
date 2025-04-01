
import React, { useRef } from 'react';
import { Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface LogoProps {
  downloadable?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ downloadable = true, size = 'md' }) => {
  const logoRef = useRef<SVGSVGElement>(null);

  const sizes = {
    sm: { logoSize: 24, fontSize: 'text-base', padding: 'p-2' },
    md: { logoSize: 32, fontSize: 'text-xl', padding: 'p-3' },
    lg: { logoSize: 48, fontSize: 'text-2xl', padding: 'p-4' },
    xl: { logoSize: 64, fontSize: 'text-3xl', padding: 'p-5' },
  };

  const { logoSize, fontSize, padding } = sizes[size];

  const downloadLogo = () => {
    if (!logoRef.current) return;

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
    
    toast.success('Logo başarıyla indirildi!');
  };

  return (
    <div className="flex flex-col items-center">
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
          Logo İndir
        </Button>
      )}
    </div>
  );
};

export default Logo;
