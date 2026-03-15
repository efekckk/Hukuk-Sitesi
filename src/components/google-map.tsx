interface GoogleMapProps {
  embedUrl?: string;
  className?: string;
}

export function GoogleMap({ embedUrl, className = "" }: GoogleMapProps) {
  const url =
    embedUrl ||
    process.env.NEXT_PUBLIC_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1264.8024832187223!2d28.987225782511512!3d41.06409113978253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7232a06a9c7%3A0x17f8412d21270583!2sAEB%20Hukuk!5e0!3m2!1str!2str!4v1773399491463!5m2!1str!2str";

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
