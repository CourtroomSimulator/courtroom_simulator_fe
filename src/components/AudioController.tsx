import { useEffect, useState } from "react";
import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from "react-icons/fa";
import "./AudioController.css";

// 假设你的背景音乐文件放在 public 文件夹下
const AUDIO_URL = "/background-music.mp3";

// 创建单例音频实例
class AudioSingleton {
  private static instance: HTMLAudioElement | null = null;

  static getInstance(): HTMLAudioElement {
    if (!this.instance) {
      this.instance = new Audio(AUDIO_URL);
      this.instance.loop = true;
    }
    return this.instance;
  }
}

const AudioController = () => {
  const [volume, setVolume] = useState(0.5);
  // const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const audio = AudioSingleton.getInstance();
    audio.volume = volume;

    // 尝试播放并处理自动播放策略
    const playAudio = async () => {
      try {
        // 设置音量
        audio.volume = volume;
        // 尝试播放
        await audio.play();
        console.log("Audio started playing successfully");
      } catch (error) {
        console.log("Autoplay prevented:", error);
        // 添加点击事件监听器来在用户首次交互时开始播放
        const startAudioOnInteraction = () => {
          audio.play();
          // 移除事件监听器
          document.removeEventListener("click", startAudioOnInteraction);
        };
        document.addEventListener("click", startAudioOnInteraction);
      }
    };

    playAudio();

    // 清理函数
    return () => {
      // 不要在清理时暂停音频，因为我们想要在路由间保持播放
      document.removeEventListener("click", () => {});
    };
  }, []);

  useEffect(() => {
    const audio = AudioSingleton.getInstance();
    audio.volume = volume;
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(0.5);
    } else {
      setVolume(0);
    }
  };

  return (
    <div className="audio-controller">
      <button onClick={toggleMute} className="volume-button">
        {volume === 0 ? (
          <FaVolumeMute />
        ) : volume < 0.5 ? (
          <FaVolumeDown />
        ) : (
          <FaVolumeUp />
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
    </div>
  );
};

export default AudioController;
