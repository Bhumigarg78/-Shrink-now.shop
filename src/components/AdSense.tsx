import React, { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  fullWidthResponsive?: boolean;
}

const AdSense: React.FC<AdSenseProps> = ({ adSlot, adFormat = 'auto', fullWidthResponsive = true }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [adSlot]);

  // Use environment variable for the publisher ID, fallback to the current one if not set
  const publisherId = import.meta.env.VITE_GOOGLE_ADSENSE_PUBLISHER_ID || "ca-pub-9142489111131355";

  return (
    <div className="ad-container" style={{ 
      textAlign: 'center', 
      margin: '40px 0', 
      overflow: 'hidden', 
      minHeight: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '12px',
      border: '1px dashed rgba(255, 255, 255, 0.1)'
    }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdSense;
