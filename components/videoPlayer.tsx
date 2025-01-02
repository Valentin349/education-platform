"use client"

import dynamic from 'next/dynamic';
import 'plyr-react/plyr.css';
import { useEffect, useRef } from 'react';

const Plyr = dynamic(() => import('plyr-react'), { ssr: false });

type VideoPlayerProps = {
    videoUrl: string;
    type?: 'youtube' | 'html5';
    chapters: { time: number; title: string }[];
};

export default function VideoPlayer({ videoUrl, type = 'youtube', chapters }: VideoPlayerProps) {
    const updatedVideoUrl = type === 'youtube' ? `${videoUrl}&rel=0` : videoUrl;

    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (playerRef.current) {
            const player = playerRef.current.plyr;

            player.on('ready', () => {
                const progressBar = player.elements.progress;

                if (progressBar) {
                    chapters.forEach((chapter) => {
                        const marker = document.createElement('div');
                        marker.classList.add('plyr__progress__marker');
                        marker.style.left = `${(chapter.time / player.duration) * 100}%`;
                        marker.title = chapter.title;

                        progressBar.appendChild(marker);
                    });
                }
            });
        }
    });

    return (
        <div>
            <Plyr ref={playerRef} source={{ type: 'video', sources: [{ src: updatedVideoUrl, provider: type }] }} />
            <style jsx>{`
                .plyr__progress__marker {
                    position: absolute;
                    top: 0;
                    width: 2px;
                    background-color: red;
                    pointer-events; none;
                }
            `}</style>
        </div>
    );
}
