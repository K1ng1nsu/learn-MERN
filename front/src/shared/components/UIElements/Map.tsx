import React, { CSSProperties, useEffect, useRef } from 'react';

import './Map.css';

type Props = {
    className: string;
    center: google.maps.LatLngLiteral;
    zoom: number;
    style?: CSSProperties;
};

const Map = (props: Props) => {
    const mapRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const loadScript = () => {
            return new Promise<void>((resolve) => {
                const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
                if (!existingScript) {
                    const script = document.createElement('script');
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${
                        import.meta.env.VITE_GOOGLE_API_KEY
                    }&loading=async&libraries=marker&v=beta`;
                    script.async = true;
                    script.defer = true;
                    script.onload = () => resolve();
                    document.body.appendChild(script);
                } else {
                    resolve();
                }
            });
        };

        const initMap = () => {
            if (mapRef.current) {
                // Google Maps 객체 초기화
                const map = new google.maps.Map(mapRef.current, {
                    center: props.center,
                    zoom: props.zoom,
                    mapId: 'MyMapId',
                });

                // 마커 추가
                new google.maps.marker.AdvancedMarkerElement({
                    position: props.center,
                    map: map,
                });
            }
        };
        loadScript().then(initMap);
    }, [props.center, props.zoom]); // center와 zoom이 변경될 때마다 재렌더링

    return (
        <div ref={mapRef} className={`map ${props.className}`} style={props.style}>
            Map
        </div>
    );
};

export default Map;
