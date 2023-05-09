import styles from "../../css/components/MusicPlayer.module.css";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { MotionButton } from "../../interface/MotionButton";
import { useSelector, useDispatch } from "react-redux";
import { setMusic } from "../../redux/music.slice";

const MusicPlayerButton = () => {
  const musicRedux = useSelector((state: any) => state.music.music);
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(
      setMusic({
        ...musicRedux,
        show: true,
      })
    );
  };

  const handleClose = () => {
    dispatch(
      setMusic({
        ...musicRedux,
        show: false,
      })
    );
  };

  return (
    <>
      <MotionButton
        className={styles.musicPlayerButton}
        hover={"boxShadow"}
        tap
        onClick={musicRedux.show ? handleClose : handleOpen}
        onKeyDown={event =>
          event.code === "Enter" && musicRedux.show ? handleClose() : handleOpen()
        }
        initialOptions={{ opacity: 0 }}
        animateOptions={{ opacity: [0, 1] }}
        role="button"
        ariaLabel="Music Player"
        label={
          <>
            {musicRedux.playing ? (
              <span className={styles.loader}></span>
            ) : (
              <MusicNoteIcon htmlColor="#fff" className={styles.musicPlayerButtonIcon} />
            )}
          </>
        }
      />
    </>
  );
};

export default MusicPlayerButton;
