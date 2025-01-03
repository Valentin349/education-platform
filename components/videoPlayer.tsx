"use client"

import 'plyr-react/plyr.css';
import dynamic from 'next/dynamic';

const Plyr = dynamic(() => import('plyr-react'), { ssr: false });

type VideoPlayerProps = {
    videoUrl: string;
    type?: 'youtube' | 'html5';
    chapters?: { time: number; label: string }[];
};

export default function VideoPlayer({ videoUrl, type = 'youtube', chapters = [] }: VideoPlayerProps) {
    const updatedVideoUrl = type === 'youtube' ? `${videoUrl}&rel=0` : videoUrl;
      
    return (
        <Plyr
            source={{ type: 'video', sources: [{ src: updatedVideoUrl, provider: type }] }}
            options={{
                markers: { enabled: true, points: chapters },
            }}
        />
    );
}
