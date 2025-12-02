import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

export const compressVideo = async (file: File): Promise<File> => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();
  console.log("Compressing video file:", file.name);
  
  const inputName = 'input.mp4';
  const outputName = 'output.mp4';

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  await ffmpeg.exec([
    '-i', inputName,
    '-vcodec', 'libx264',
    '-crf', '28',
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);

  const blob = new Blob([data], { type: 'video/mp4' });
  const compressedFile = new File([blob], 'compressed.mp4', { type: 'video/mp4' });

  return compressedFile;
};