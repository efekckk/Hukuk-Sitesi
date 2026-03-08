interface GoogleMapProps {
  embedUrl?: string;
  className?: string;
}

export function GoogleMap({ embedUrl, className = "" }: GoogleMapProps) {
  const url =
    embedUrl ||
    process.env.NEXT_PUBLIC_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.0596648498498!2d29.010295!3d41.0782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab63e47c1d4b5%3A0x93e1b3e1ed2b8891!2sLevent%2C%20Be%C5%9Fikta%C5%9F%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str";

  return (
    <div className={`w-full aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={url}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ofis Konumu"
      />
    </div>
  );
}
