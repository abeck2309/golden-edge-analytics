"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { PodcastEpisodeConfig } from "@/lib/site-config";
import { PodcastWaveform } from "@/components/podcast-waveform";

const SAMPLE_COUNT = 144;

export function PodcastPlayerCard({ episode }: { episode: PodcastEpisodeConfig }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [samples, setSamples] = useState<number[]>(() => Array.from({ length: SAMPLE_COUNT }, () => 0));

  const smoothSamplesRef = useRef<number[]>(Array.from({ length: SAMPLE_COUNT }, () => 0));

  const idleDuration = episode.audioSrc ? formatTime(duration) : episode.duration;
  const progressPercent = duration && duration > 0 ? (currentTime / duration) * 100 : 0;

  const fallbackSamples = useMemo(() => Array.from({ length: SAMPLE_COUNT }, () => 0), []);

  useEffect(() => {
    if (!episode.audioSrc) {
      setSamples(fallbackSamples);
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const setupAudio = async () => {
      if (!contextRef.current) {
        contextRef.current = new AudioContext();
      }

      if (contextRef.current.state === "suspended") {
        await contextRef.current.resume();
      }

      if (!sourceRef.current) {
        sourceRef.current = contextRef.current.createMediaElementSource(audio);
      }

      if (!gainRef.current) {
        const gainNode = contextRef.current.createGain();
        gainNode.gain.value = volume;
        sourceRef.current.connect(gainNode);
        gainNode.connect(contextRef.current.destination);
        gainRef.current = gainNode;
      }

      if (!analyserRef.current) {
        const analyser = contextRef.current.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.85;
        sourceRef.current.connect(analyser);
        analyserRef.current = analyser;
      }
    };

    const draw = () => {
      const analyser = analyserRef.current;

      if (!analyser) {
        return;
      }

      const dataArray = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(dataArray);

      const step = Math.max(1, Math.floor(dataArray.length / SAMPLE_COUNT));
      const previous = smoothSamplesRef.current;
      const nextSamples = Array.from({ length: SAMPLE_COUNT }, (_, index) => {
        const start = index * step;
        const slice = dataArray.slice(start, start + step);
        const average =
          slice.reduce((total, value) => total + (value - 128) / 128, 0) /
          Math.max(1, slice.length);
        const boosted = average * 2.6;
        const smoothed = previous[index] * 0.72 + boosted * 0.28;
        const magnitude = Math.min(1, Math.abs(smoothed) * 1.35);
        const shaped = Math.sign(smoothed || 0) * Math.pow(magnitude, 1.04);
        return shaped;
      });

      const blendedSamples = nextSamples.map((sample, index) => {
        const left = nextSamples[Math.max(0, index - 1)] ?? sample;
        const right = nextSamples[Math.min(nextSamples.length - 1, index + 1)] ?? sample;
        return left * 0.14 + sample * 0.72 + right * 0.14;
      });

      smoothSamplesRef.current = blendedSamples;
      setSamples(blendedSamples);
      frameRef.current = window.requestAnimationFrame(draw);
    };

    const handlePlay = async () => {
      await setupAudio();
      setIsPlaying(true);
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(draw);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      smoothSamplesRef.current = Array.from({ length: SAMPLE_COUNT }, () => 0);
      setSamples(fallbackSamples);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || null);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [episode.audioSrc, fallbackSamples]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 1;
    if (gainRef.current) {
      gainRef.current.gain.value = volume;
    }
  }, [volume]);

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio || !episode.audioSrc) {
      return;
    }

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextTime = Number(event.target.value);

    setCurrentTime(nextTime);

    if (audio && episode.audioSrc) {
      audio.currentTime = nextTime;
    }
  };

  return (
    <article className="panel p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">{episode.label}</p>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">
          {episode.date}
        </span>
      </div>

      <h2 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-white">
        {episode.title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-mist md:text-base">
        {episode.description}
      </p>

      <div className="mt-6 rounded-[1.5rem] border border-line bg-[linear-gradient(180deg,rgba(8,10,18,0.96),rgba(26,9,15,0.92))] p-4 shadow-[0_0_40px_rgba(200,16,46,0.14)]">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={togglePlayback}
            disabled={!episode.audioSrc}
            className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-mist"
          >
            {episode.audioSrc ? (isPlaying ? "Pause" : "Play") : "Audio Soon"}
          </button>
          <label className="flex min-w-[160px] items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-mist">
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              disabled={!episode.audioSrc}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#d8bc7a] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
        </div>

        <PodcastWaveform samples={samples} isPlaying={isPlaying} />

        <div className="mt-4 flex items-center gap-3 text-xs text-mist">
          <span>{episode.audioSrc ? formatTime(currentTime) : "00:00"}</span>
          <input
            type="range"
            min="0"
            max={duration && duration > 0 ? duration : 0}
            step="0.01"
            value={duration && duration > 0 ? Math.min(currentTime, duration) : 0}
            onChange={handleProgressChange}
            disabled={!episode.audioSrc || !duration}
            aria-label="Seek podcast"
            className="podcast-progress-slider h-2 flex-1 cursor-pointer appearance-none rounded-full disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: `linear-gradient(90deg, #d8bc7a 0%, #d8bc7a ${progressPercent}%, rgba(255,255,255,0.14) ${progressPercent}%, rgba(255,255,255,0.14) 100%)`
            }}
          />
          <span>{idleDuration}</span>
        </div>

        {episode.audioSrc ? <audio ref={audioRef} src={episode.audioSrc} preload="metadata" /> : null}
      </div>

      <style jsx>{`
        .podcast-progress-slider::-webkit-slider-runnable-track {
          height: 0.5rem;
          border-radius: 999px;
          background: transparent;
        }

        .podcast-progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: -7px;
          border: 0;
          border-radius: 999px;
          background-color: transparent;
          background-image: url("/259-2590893_vegas-golden-knights-logo.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .podcast-progress-slider::-moz-range-track {
          height: 0.5rem;
          border: 0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.14);
        }

        .podcast-progress-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border: 0;
          border-radius: 999px;
          background-color: transparent;
          background-image: url("/259-2590893_vegas-golden-knights-logo.png");
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }
      `}</style>
    </article>
  );
}

function formatTime(value: number | null) {
  if (!value || Number.isNaN(value)) {
    return "00:00";
  }

  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
