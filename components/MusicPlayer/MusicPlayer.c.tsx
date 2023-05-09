import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import { PlayArrow, Pause, SkipPrevious, SkipNext, VolumeUp } from "@mui/icons-material";
import { setMusic } from "../../redux/music.slice";
import styles from "../../css/components/MusicPlayer.module.css";
import useWindowDimensions from "../../utils/useWindowDimensions";

const audioFiles = [
  {
    src: "/audio/song1.mp3",
    title: "Calare pe motoare",
    artist: "Cargo",
  },
  {
    src: "/audio/song2.mp3",
    title: "Ziua Vrajitoarelor",
    artist: "Cargo",
  },
  // add more audio files as needed
];

const MusicPlayer = () => {
  const { width } = useWindowDimensions();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const musicRedux = useSelector((state: any) => state.music.music);
  const dispatch = useDispatch();

  const playerRef = useRef<ReactPlayer>(null);
  const currentTrack = audioFiles[currentTrackIndex];

  const playTrack = () => {
    setIsPlaying(true);
    dispatch(
      setMusic({
        ...musicRedux,
        playing: true,
      })
    );
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    dispatch(
      setMusic({
        ...musicRedux,
        playing: false,
      })
    );
  };

  const playNextTrack = () => {
    setCurrentTrackIndex(prevIndex => (prevIndex === audioFiles.length - 1 ? 0 : prevIndex + 1));
    setIsPlaying(true);
    dispatch(
      setMusic({
        ...musicRedux,
        playing: true,
      })
    );
  };

  const playPrevTrack = () => {
    setCurrentTrackIndex(prevIndex => (prevIndex === 0 ? audioFiles.length - 1 : prevIndex - 1));
    setIsPlaying(true);
    dispatch(
      setMusic({
        ...musicRedux,
        playing: true,
      })
    );
  };

  const handleSliderChange = (event: any, newValue: any) => {
    setCurrentTime(newValue);
    playerRef.current?.seekTo(newValue, "seconds");
    if (!isPlaying) {
      setIsPlaying(true);
      dispatch(
        setMusic({
          ...musicRedux,
          playing: true,
        })
      );
    }
  };

  const handleVolumeChange = (event: any, newValue: any) => {
    const volumeValue = newValue / 100;
    setVolume(volumeValue);
  };

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {width < 910 && (
        <React.Fragment>
          <Box
            display={musicRedux.show ? "flex" : "none"}
            alignItems="center"
            flexDirection="column"
            color="var(--white)"
            justifyContent="space-evenly"
            width="100%"
          >
            <Box display="flex" alignItems="center" flexDirection="row">
              <IconButton onClick={playPrevTrack}>
                <SkipPrevious htmlColor="var(--secondaryMUI)" />
              </IconButton>
              {isPlaying ? (
                <IconButton onClick={pauseTrack}>
                  <Pause htmlColor="var(--secondaryMUI)" style={{ fontSize: "1.5em" }} />
                </IconButton>
              ) : (
                <IconButton onClick={playTrack}>
                  <PlayArrow htmlColor="var(--secondaryMUI)" style={{ fontSize: "1.5em" }} />
                </IconButton>
              )}
              <IconButton onClick={playNextTrack}>
                <SkipNext htmlColor="var(--secondaryMUI)" />
              </IconButton>
            </Box>
            <Slider
              value={currentTime}
              max={duration}
              onChange={handleSliderChange}
              style={{ margin: "0 10px", flexGrow: 1, width: "80%" }}
              color="secondary"
            />
            <Typography variant="subtitle2">{formatTime(currentTime)}</Typography>
          </Box>
        </React.Fragment>
      )}
      <Box display={musicRedux.show ? "flex" : "none"} className={styles.container}>
        <Box className={styles.typo}>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            {currentTrack.title}
          </Typography>
          <Typography variant="subtitle1" style={{ width: "100%" }}>
            {currentTrack.artist}
          </Typography>
        </Box>
        {width > 910 && (
          <React.Fragment>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              color="var(--white)"
              justifyContent="space-evenly"
              width="50%"
            >
              <Box display="flex" alignItems="center" flexDirection="row">
                <IconButton onClick={playPrevTrack}>
                  <SkipPrevious htmlColor="var(--secondaryMUI)" />
                </IconButton>
                {isPlaying ? (
                  <IconButton onClick={pauseTrack}>
                    <Pause htmlColor="var(--secondaryMUI)" style={{ fontSize: "1.5em" }} />
                  </IconButton>
                ) : (
                  <IconButton onClick={playTrack}>
                    <PlayArrow htmlColor="var(--secondaryMUI)" style={{ fontSize: "1.5em" }} />
                  </IconButton>
                )}
                <IconButton onClick={playNextTrack}>
                  <SkipNext htmlColor="var(--secondaryMUI)" />
                </IconButton>
              </Box>
              <Slider
                value={currentTime}
                max={duration}
                onChange={handleSliderChange}
                style={{ margin: "0 10px", flexGrow: 1, width: "50%" }}
                color="secondary"
              />
              <Typography variant="subtitle2">{formatTime(currentTime)}</Typography>
            </Box>
          </React.Fragment>
        )}
        <Box className={styles.volume}>
          <VolumeUp style={{ marginLeft: "auto" }} />
          <Slider
            value={volume * 100}
            onChange={handleVolumeChange}
            color="secondary"
            style={{ width: 100 }}
          />
        </Box>
        <ReactPlayer
          url={currentTrack.src}
          playing={isPlaying}
          ref={playerRef}
          volume={volume}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={playNextTrack}
          onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
          onDuration={setDuration}
          style={{ display: "none" }}
        />
      </Box>
    </>
  );
};

export default MusicPlayer;
